import { ActionFunctionArgs } from '@remix-run/node';
import { Outlet, json, useFetcher, useOutletContext } from '@remix-run/react';
import { UploadcareFile } from '@uploadcare/blocks';
import { ImageGrid } from '../components/image-grid/image-grid';
import { dbSave } from '../lib/db.server';
import { DbFile, PhotoContextProps } from '../lib/interfaces';
import { Uploader } from '../components/uploader';
import { uploadcareFileToDbFile } from '../lib/morphisms';

export async function action({ request }: ActionFunctionArgs) {
  const uploadedFiles: UploadcareFile[] = [await request.json()];
  const newDbRows = await dbSave(uploadedFiles);
  return json({ ok: Boolean(newDbRows.length), rows: newDbRows }); // FIXME get err from backend
}

export default () => {
  const { filesList, imageIds } = useOutletContext() as PhotoContextProps;

  const fetcher = useFetcher();
  const commit = async (file: UploadcareFile) => {
    console.log('uploading', JSON.stringify(file, null, 4));
    const rec:DbFile = uploadcareFileToDbFile(file)
    const result = await fetcher.submit(rec as any, {
      action: '/photos',
      method: 'POST',
      encType: 'application/json',
    });
  };

  return (
    <div id="photos">
      <div className="z-index-back">
        <Uploader onUpload={commit} />
      </div>
      <h3>your images:</h3>
      <ImageGrid images={filesList.map((f) => f.json)} />
      <div className="z-index-front">
        <Outlet context={{ imageIds, filesList }} />
      </div>
    </div>
  );
};
