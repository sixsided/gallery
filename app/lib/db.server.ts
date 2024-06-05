import joi from 'joi';
import pg from 'pg';
import config from '../../config';
import { DbFile, PhotosDbRowType } from './interfaces';

const pool = new pg.Pool({
  connectionString: config.postgresConnectionString,
  ssl: {
    ca: config.postgresCert,
  },
});

async function withPgClient(f) {
  console.log('[withPgClient]', 'total:', pool.totalCount, 'idle:', pool.idleCount);
  const client = await pool.connect();
  let result;
  try {
    result = await f(client);
  } catch (e) {
    console.error(e);
  }
  client.release();
  return result;
}

export async function dbQuery(): Promise<PhotosDbRowType[]> {
  const res = await withPgClient((client) => client.query('SELECT uuid, name, json FROM photos ORDER BY ID DESC'));
  return res.rows;
}

// Never Trust The Client™
function sanitize(uf: DbFile): DbFile | null {
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
        subtype: joi.string(),
      }),
      image: joi.object({
        width: joi.number(),
        height: joi.number(),
      }),
    }),
  });

  const result = schema.validate(uf, { stripUnknown: true });
  if (result.error) {
    console.error(result.error);
    return null;
  } else {
    return result.value;
  }
}

const saveOne = async (client, uploadedFile) => {
  const item = sanitize(uploadedFile);
  if (!item) return false;
  await client.query('INSERT INTO photos(uuid, name, json) VALUES($1,$2,$3)', [
    item.uuid,
    item.originalFilename,
    JSON.stringify(item),
  ]);
};

export const dbSaveOne = async (uploadedFile: DbFile) => withPgClient((c) => saveOne(c, uploadedFile));

export const dbSaveMany = async (ufs: DbFile[]) => withPgClient((c) => Promise.all(ufs.map((uf) => saveOne(c, uf))));

export const dbDelete = async ({ uuid }) => withPgClient((c) => c.query('DELETE FROM photos WHERE uuid=$1', [uuid]));
