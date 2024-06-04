import "dotenv/config";

export default {
  uploadcarePubKey: process.env.UC_PUBLIC_KEY || 'fake pub key',
  uploadcarePrivKey: process.env.UC_SECRET_KEY || 'fake priv key',
  postgresConnectionString: process.env.TEMBO_CONNECTION_STRING || 'fake conn string',
  postgresCert: process.env.TEMBO_CA_CERT || 'fake cert'
}
