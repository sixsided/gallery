// (backend) rest-client listOfFiles -> PaginatedList<FileInfo>
// (frontend) upload block events -> OutputFileEntry<status>
//                                   OutputFileEntry<'success'>['fileInfo'] : UploadcareFile
// (frontend) UploadClient.upload* methods -> Promise<UploadcareFile>

import { FileInfo } from "@uploadcare/rest-client";

export interface DbFile {
  uuid: string;
  originalFileUrl: string;
  contentInfo: FileInfo['contentInfo']; // FileInfo type is the same in @uploadcare/blocks and @uploadcare/rest-client
  originalFilename: string;
  size: number; 
}

export type PhotosDbRowType = { uuid: string; name: string; json: DbFile };

export type PhotoContextProps = { filesList:DbFile[], imageIds:string[] } 