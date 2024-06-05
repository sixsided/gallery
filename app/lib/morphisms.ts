import { UploadcareFile } from '@uploadcare/blocks/types';
import { FileInfo } from '@uploadcare/rest-client';
import { DbFile } from './interfaces';

// takes a FileInfo as defined in @uploadcare/rest-client
export const fileInfoToDbFile = ({ uuid, contentInfo, size, originalFileUrl, originalFilename }: FileInfo): DbFile => ({
  uuid,
  size,
  originalFileUrl: originalFileUrl || '#',
  contentInfo,
  originalFilename,
});

// takes an UploadcareFile as returned in @uploadcare/blocks' event.detail.successEntries
export const uploadcareFileToDbFile = ({ uuid, contentInfo, size, cdnUrl, name, originalFilename }: UploadcareFile): DbFile => ({
  uuid,
  size: size || 0,
  originalFileUrl: cdnUrl! + name,
  contentInfo,
  originalFilename: originalFilename || 'untitled',
});
