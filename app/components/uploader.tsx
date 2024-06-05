import * as LR from '@uploadcare/blocks';
import { useEffect, useRef, useState } from 'react';

LR.registerBlocks(LR); // enable the Web Components

export type UploaderPropsType = {
  onUpload: (files: LR.UploadcareFile[]) => void;
  onRemove?: (uuid: string) => void;
};

export const Uploader = ({ onUpload, onRemove }: UploaderPropsType) => {
  const [alreadyUploaded, setAlreadyUploaded] = useState({}); // hack: Uploader component fires multiple success events with same file uuids
  console.log('[Uploader] render', Object.keys(alreadyUploaded).length);
  const ctxProviderRef = useRef<InstanceType<LR.UploadCtxProvider>>(null);

  const addChangeHandler = () => {
    const ctxProvider = ctxProviderRef.current;
    if (!ctxProvider) return;

    const handleChangeEvent = (e: LR.EventMap['change']) => {
      // wait until status is `success` and uploading is done
      const isSuccess = e.detail.status === 'success';
      const isInactive = e.detail.successCount + e.detail.failedCount === e.detail.totalCount;
      const isDone = isSuccess && isInactive;
      console.warn(
        e.detail.status,
        'when',
        e.detail.successCount + ' + ' + e.detail.failedCount,
        ' = ' + e.detail.totalCount,
        isDone ? 'DONE' : 'PENDING',
        '@',
        e.detail.progress,
      );
      if (!isDone) return;

      const newUploads = e.detail.successEntries.filter((f) => !alreadyUploaded[f.uuid]);

      // exclude already-seen uploads, as when user clicks the delete widget
      newUploads.forEach((f) => (alreadyUploaded[f.uuid] = true));
      setAlreadyUploaded(alreadyUploaded);
      onUpload(newUploads.map((f) => f.fileInfo));
      // console.log('->', ...Object.keys(alreadyUploaded));

      // newUploads.forEach(f => onUpload?.(f.fileInfo))
    };

    const handleRemoveEvent = (e: LR.EventMap['file-removed']) => {
      console.log('removed:', e);
      if (e.detail.uuid) {
        onRemove?.(e.detail.uuid);
      }
    };

    ctxProvider.addEventListener('change', handleChangeEvent);
    ctxProvider.addEventListener('file-removed', handleRemoveEvent);

    return () => ctxProvider.removeEventListener('change', handleChangeEvent);
  };

  useEffect(addChangeHandler, []);

  return (
    <div>
      <ul>
        {Object.keys(alreadyUploaded).map((uuid) => (
          <li key={uuid}>{uuid}</li>
        ))}
      </ul>
      <h3>upload images:</h3>
      <lr-config ctx-name="my-uploader" pubkey="c9c5b55dca319d0802a6"></lr-config>
      <lr-file-uploader-minimal
        ctx-name="my-uploader"
        css-src={`https://cdn.jsdelivr.net/npm/@uploadcare/blocks@0.38.1/web/lr-file-uploader-minimal.min.css`}
      ></lr-file-uploader-minimal>
      <lr-upload-ctx-provider id="uploaderctx" ctx-name="my-uploader" ref={ctxProviderRef}></lr-upload-ctx-provider>
    </div>
  );
};
