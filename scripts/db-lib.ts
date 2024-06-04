import pg from 'pg';
import config from '../config';

const pool = new pg.Pool({
  connectionString: process.env.TEMBO_CONNECTION_STRING,
  ssl: {
    ca: config.postgresCert,
  },
});

export const client = await pool.connect();
