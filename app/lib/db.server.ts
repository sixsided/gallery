import { UploadcareFile } from '@uploadcare/blocks';
import { FileInfo } from '@uploadcare/rest-client';
import pg from 'pg';
import config from '../../config';
import { DbFile, PhotosDbRowType } from './interfaces';
import joi from 'joi';

export const toDbFile = ({uuid, contentInfo,size,originalFileUrl, originalFilename}:FileInfo) => ({
  uuid,
  size,
  originalFileUrl,
  contentInfo,
  originalFilename
});


const pool = new pg.Pool({
  connectionString: config.postgresConnectionString,
  ssl: {
    ca: config.postgresCert
  },
});

async function getPostgresClient(): Promise<pg.Client> {
  console.log('[getPostgresClient]', 'total:', pool.totalCount, 'idle:',pool.idleCount);
  return pool.connect();
}

async function withPgClient(f){
  const client = await getPostgresClient();
  let result;
  try {
    console.log('[withPgClient]', 'total:', pool.totalCount, 'idle:',pool.idleCount);
    result = await f(client);
  } catch(e){
    console.error(e);
  }
  client.release();
  return result;
}

export async function dbQuery(): Promise<PhotosDbRowType[]> {
  const res = await withPgClient(client => client.query('SELECT uuid, name, json FROM photos ORDER BY ID DESC'));
  return res.rows;
}

function validate(uf: DbFile):DbFile | null {
  // Never Trust The Client™
  const schema = joi.object().keys({
    uuid: joi.string().length(36),
    originalFileUrl: joi.string().min(7).max(512),
    originalFilename: joi.string().min(1).max(512),
    size: joi.number(),
    // FileInfo['contentInfo']; // FileInfo type is the same in @uploadcare/blocks and @uploadcare/rest-client
    contentInfo: joi.object({
      mime: joi.object({
        mime: joi.string(),
        type: joi.string(),
        subtype: joi.string()
      }),
      image: joi.object({
        width: joi.number(),
        height:joi.number()
      })
    }),
  });
  const result = schema.validate(uf, {stripUnknown:true});
  // console.log(JSON.stringify(result, null, 4));
  if(result.error) {
    console.error(result.error);
    return null;
  } else {
    return result.value;
  }
}


const saveOne = uploadedFile => async client => {
  const item = validate(uploadedFile);
  if(!item) return false;

  const insertResult = await client.query('INSERT INTO photos(uuid, name, json) VALUES($1,$2,$3)', [
    item.uuid,
    item.originalFilename,
    JSON.stringify(item),
  ]);
  // console.log('INSERT:', JSON.stringify(insertResult));
}

export async function dbSaveOne(uploadedFile: DbFile) {
  console.log('[dbSaveOne]', uploadedFile);
  return withPgClient(saveOne(uploadedFile))
}

export async function dbSaveMany(ufs:DbFile[]) {
  return withPgClient(async client => {
    console.log('[>>> dbSaveMany]', ufs);
    for(let uf of ufs) {
      await saveOne(uf)(client);
    }
    const escapedIds = ufs.map(uf => uf.uuid).map((uuid) => pg.escapeLiteral(uuid));
    const res = await client.query(`SELECT uuid, name, json FROM photos WHERE uuid IN ( ${escapedIds.join(', ')} ) `);
    return res.rows;
  });
}

//   // respond with the new database rows
//   if(uuids.length){
//     const escapedIds = uuids.map((id) => pg.escapeLiteral(id));
//     console.log('[dbSave] > > > INSERTed', escapedIds.join(', '));
//     const res = await client.query(`SELECT uuid, name, json FROM photos WHERE uuid IN ( ${escapedIds.join(', ')} ) `);
//     return res.rows;
//   } else {
//     return [];
//   }
// }
