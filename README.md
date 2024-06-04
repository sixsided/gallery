# Photo gallery and uploader
- uploadcare.com for file upload and storage
- tembo.io for postgres backend
- photos link to full-size originals
- keyboard navigation

# Setup
- copy .env.example to .env and fill it with your Uploadcare and Tembo credentials
- `npm run init-db` to create a Postgres table in tembo
- `npm start` (or `npm run build` and then `NODE_ENV=production node server.js`)
