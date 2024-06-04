import { listFiles } from "./uc-lib";

const result = await listFiles();

result.forEach(r => 
  console.log(`${r.uuid}  ${r.originalFilename}`)
);
