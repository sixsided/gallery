import { listFiles, deleteRemoteFiles } from "./uc-lib";

const files = await listFiles();

console.log('found', files.length, 'files');

const problems = await deleteRemoteFiles(files.map(f => f.uuid));

console.log('deleted');

console.log(problems);