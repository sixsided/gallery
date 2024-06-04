import {
  listOfFiles,
  deleteFiles,
  UploadcareSimpleAuthSchema,
  FileInfo,
} from '@uploadcare/rest-client';
import config from '../config';


export const uploadcareSimpleAuthSchema = new UploadcareSimpleAuthSchema({
  publicKey: config.uploadcarePubKey,
  secretKey: config.uploadcarePrivKey
});

export const listFilesFirst1000 = () => listOfFiles(
  { limit: 1000, ordering: '-datetime_uploaded' },
  { authSchema: uploadcareSimpleAuthSchema }
).then(rsp => rsp.results);

export const listFiles = async (pageUrl = null):Promise<FileInfo[]> => {
  const fromPage = pageUrl && {from:new URL(pageUrl).searchParams.get('from')};
  const { next, total, results } = await listOfFiles(
    { ordering: '-datetime_uploaded', limit: 1000, ...fromPage },
    { authSchema: uploadcareSimpleAuthSchema }
  );
  return next ? results.concat(await listFiles(next)) : results;
}

export const deleteRemoteFiles = async(fileUuids) => {
  console.log('deleteRemoteFiles', fileUuids.length);
  const chunk = (size, xs) => xs.length < size ? [xs] : [xs.slice(0,size)].concat(chunk(size, xs.slice(size)))
  const uuidSets = chunk(100, fileUuids)

  let results = [], problems = [];
  for(const uuids of uuidSets) {
    console.log('deleting', uuids.length, '/', fileUuids.length);
    const rsp = await deleteFiles({uuids}, { authSchema: uploadcareSimpleAuthSchema }); // 100-file limit https://uploadcare.com/api-refs/rest-api/v0.7.0/#tag/File/operation/filesDelete
    results = results.concat(rsp.results);
    problems = problems.concat(rsp.problems);
  }
  return problems;
}