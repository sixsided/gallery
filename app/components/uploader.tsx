import * as LR from '@uploadcare/blocks';
import { useEffect, useRef } from 'react';

LR.registerBlocks(LR); // enable the Web Components

export type UploaderPropsType = {
  onUpload: (file: LR.UploadcareFile) => void;
};

export const Uploader = ({ onUpload }: UploaderPropsType) => {
  const ctxProviderRef = useRef<InstanceType<LR.UploadCtxProvider>>(null);

  const addChangeHandler = () => {
    const ctxProvider = ctxProviderRef.current;
    if (!ctxProvider) return;

    const handleChangeEvent = (e: LR.EventMap['change']) => {
      e.detail.successEntries.forEach(f => onUpload?.(f.fileInfo))
    };

    ctxProvider.addEventListener('change', handleChangeEvent);

    return () => ctxProvider.removeEventListener('change', handleChangeEvent);
  };

  useEffect(addChangeHandler, []);

  return (
    <div>
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
