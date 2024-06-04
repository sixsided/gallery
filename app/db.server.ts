import { UploadcareFile } from '@uploadcare/blocks';
import { FileInfo } from '@uploadcare/rest-client';
import pg from 'pg';
import config from '../config';
import { PhotosDbRowType } from './interfaces';

export const toDbFile = ({uuid, contentInfo,size,originalFileUrl, originalFilename}:FileInfo) => ({
  uuid,
  size,
  originalFileUrl,
  contentInfo,
  originalFilename
});


async function getPostgresClient(): Promise<pg.Client> {
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

export async function dbSave(uploadedFiles: UploadcareFile[]) {
  const client = await getPostgresClient();
  const uuids: string[] = [];

  // save the upload info
  for (let i = 0; i < uploadedFiles.length; i++) {
    try {
      const item = uploadedFiles[i];
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
  const res = await client.query(`SELECT uuid, name, json FROM photos WHERE uuid IN ( ${escapedIds.join(', ')} ) `);
  return res.rows;
}
