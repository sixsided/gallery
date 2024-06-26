import { ActionFunctionArgs } from '@remix-run/node';
import { Outlet, json, useFetcher, useOutletContext } from '@remix-run/react';
import { UploadcareFile } from '@uploadcare/blocks';
import { ImageGrid } from '../components/image-grid/image-grid';
import { dbDelete, dbSaveMany, dbSaveOne } from '../lib/db.server';
import { DbFile, PhotoContextProps } from '../lib/interfaces';
import { Uploader } from '../components/uploader';
import { uploadcareFileToDbFile } from '../lib/morphisms';

export async function action({ request }: ActionFunctionArgs) {
  switch (request.method) {
    case 'POST':
      const uploadedFiles: DbFile[] = await request.json();
      await dbSaveMany(uploadedFiles);
      break;
    case 'DELETE':
      await dbDelete(await request.json());
      break;
  }
  return json({ ok: true });
}

export default () => {
  const { filesList, imageIds } = useOutletContext() as PhotoContextProps;

  const fetcher = useFetcher();
  const commit = async (files: UploadcareFile[]) => {
    console.log('[commit] > save', files.map((f) => f.originalFilename).join(', '), Date.now()); //JSON.stringify(file, null, 4));
    const rec: DbFile[] = files.map(uploadcareFileToDbFile);
    const result = await fetcher.submit(rec as any, {
      action: '/photos',
      method: 'POST',
      encType: 'application/json',
    });
    console.log('[commit] < saved', files.map((f) => f.originalFilename).join(', '), Date.now()); //JSON.stringify(file, null, 4));
  };

  const remove = async (uuid: string) =>
    fetcher.submit(
      { uuid },
      {
        action: '/photos',
        method: 'DELETE',
        encType: 'application/json',
      },
    );

  return (
    <div id="photos">
      <div className="z-index-back">
        <Uploader onUpload={commit} onRemove={remove} />
      </div>
      <h3>your images:</h3>
      <ImageGrid images={filesList.map((f) => f.json)} />
      <div className="z-index-front">
        <Outlet context={{ imageIds, filesList }} />
      </div>
    </div>
  );
};
