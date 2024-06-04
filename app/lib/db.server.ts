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


async function getPostgresClient(): Promise<any> {
  console.log('>>> pg.Pool.connect');
  const pool = new pg.Pool({
    connectionString: config.postgresConnectionString,
    ssl: {
      ca: config.postgresCert
    },
  });
  return pool.connect();
}

export async function dbQuery(): Promise<PhotosDbRowType[]> {
  const client = await getPostgresClient();
  const res = await client.query('SELECT uuid, name, json FROM photos ORDER BY ID DESC');
  return res.rows;
}

function validate(uf: DbFile):DbFile | null {
  // Never Trust The Client™
  const schema = joi.object().keys({
    uuid: joi.string().length(36),
    originalFileUrl: joi.string().min(12).max(512),
    originalFilename: joi.string().min(12).max(512),
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
  const {error, value} = schema.validate(uf, {stripUnknown:true});
  if(error) {
    console.error(error);
    return null;
  } else {
    return value;
  }
}

export async function dbSave(uploadedFiles: DbFile[]) {
  const client = await getPostgresClient();
  const uuids: string[] = [];

  // save the upload info
  for (let i = 0; i < uploadedFiles.length; i++) {
    try {
      const item = validate(uploadedFiles[i]);
      if(!item) continue; // skip if invalid
      await client.query('INSERT INTO photos(uuid, name, json) VALUES($1,$2,$3)', [
        item.uuid,
        item.originalFilename,
        JSON.stringify(item),
      ]);
      // TODO: check pg response for non-throwing failure
      uuids.push(item.uuid);
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  // respond with the new database rows
  const escapedIds = uuids.map((id) => pg.escapeLiteral(id));
  console.log('> > > INSERTed', ...escapedIds);
  const res = await client.query(`SELECT uuid, name, json FROM photos WHERE uuid IN ( ${escapedIds.join(', ')} ) `);
  return res.rows;
}
