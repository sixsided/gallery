// this will drop the remote db's `photos` table and re-create it with whatever is 
// found in Uploadcare

import { FileInfo } from '@uploadcare/rest-client';
import { client } from './db-lib';
import { listFiles } from './uc-lib';
import { fileInfoToDbFile } from '../app/morphisms';

// Postgres create table
const createStatement = `
  CREATE TABLE photos (
    id SERIAL PRIMARY KEY,
    uuid TEXT UNIQUE, -- UUID v4, in 8-4-4-4-12 format
    keywords TEXT,
    name TEXT,
    json JSONB -- JSONB for perf
  );`;

async function initializeDatabase() {
  try {
    const result = await client.query('DROP TABLE photos')
    console.log(result.command, 'OK');
  } catch (e) {
    console.log('error dropping table: ', e)
  }

  try {
    const result = await client.query(createStatement)
    console.log(result.command, 'OK');
  } catch (e) {
    console.log('error creating table: ', e);
  }

  try {
    const ucFiles = await listFiles();
    console.log(`INSERTing ${ucFiles.length} rows into psql table...`);
    for (let i = 0; i < ucFiles.length; i++) {
      const item = ucFiles[i];
      // call json so we error out on any attemt to insert invalid JSON
      const result = await client.query("INSERT INTO photos(uuid, name, json) VALUES($1,$2,$3)", [
        item.uuid,
        item.originalFilename,
        JSON.stringify(fileInfoToDbFile(item)),
      ]);
      console.log(`    ${i+1}/${ucFiles.length}`);
    }
  } catch(e) {
    console.log('error copying file listing from uploadcare to psql:', e);
  }
  process.exit(0);
}

initializeDatabase();
