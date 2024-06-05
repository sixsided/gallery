import { installGlobals } from '@remix-run/node';
import '@testing-library/jest-dom/vitest';
import { OutputFileEntry } from '@uploadcare/blocks';
import { describe, expect, it, test } from 'vitest';
import { uploadcareFileToDbFile } from '../app/lib/morphisms';

installGlobals();

test('1+1=2', () => {
	expect(1+1).toEqual(2)
});

describe('type conversion', () => {
	it('should convert Uploadcare blocks response to DbFile', () => {
		const ucf:OutputFileEntry<'success'> = {
				"uuid": "043d5023-b3e6-4970-b49e-f1209e547ae0",
				"internalId": "TFagVvZTC-lqT",
				"name": "@ShipwrightA bWVkaWEvR0NtRVZWaGFjQUFpM0ZvLmpwZw==.jpg",
				"size": 1173032,
				"isImage": true,
				"mimeType": "image/jpeg",
				"file": null, //{},
				"externalUrl": null,
				"cdnUrlModifiers": "",
				"cdnUrl": "https://ucarecdn.com/043d5023-b3e6-4970-b49e-f1209e547ae0/",
				"fullPath": null,
				"uploadProgress": 100,
				"fileInfo": {
					"uuid": "043d5023-b3e6-4970-b49e-f1209e547ae0",
					"name": "ShipwrightAbWVkaWEvR0NtRVZWaGFjQUFpM0ZvLmpwZw.jpg",
					"size": 1173032,
					"isStored": true,
					"isImage": true,
					"mimeType": "image/jpeg",
					"cdnUrl": "https://ucarecdn.com/043d5023-b3e6-4970-b49e-f1209e547ae0/",
					"s3Url": null,
					"originalFilename": "@ShipwrightA bWVkaWEvR0NtRVZWaGFjQUFpM0ZvLmpwZw==.jpg",
					"imageInfo": {
						"dpi": null,
						"width": 3543,
						"format": "JPEG",
						"height": 4096,
						"sequence": false,
						"colorMode": "RGB",
						"orientation": null,
						"geoLocation": null,
						"datetimeOriginal": null
					},
					"videoInfo": null,
					"contentInfo": {
						"mime": {
							"mime": "image/jpeg",
							"type": "image",
							"subtype": "jpeg"
						},
						"image": {
							"dpi": null,
							"width": 3543,
							"format": "JPEG",
							"height": 4096,
							"sequence": false,
							"colorMode": "RGB",
							"orientation": null,
							"geoLocation": null,
							"datetimeOriginal": null
						}
					},
					"metadata": {},
					"s3Bucket": null,
					"defaultEffects": null
				},
				"metadata": {},
				"isSuccess": true,
				"isUploading": false,
				"isFailed": false,
				"isRemoved": false,
				"errors": [],
				"status": "success"
			};
		
		console.log(ucf);
		const dbf = uploadcareFileToDbFile(ucf.fileInfo);
		expect(dbf).toEqual({
			uuid: ucf.uuid,
			size: ucf.size,
			originalFileUrl: ucf.cdnUrl + ucf.fileInfo.name,
			contentInfo: ucf.fileInfo.contentInfo,
			originalFilename: ucf.fileInfo.originalFilename,
		});
	});

	
})

