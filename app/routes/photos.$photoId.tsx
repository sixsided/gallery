import { Link, useMatches, useNavigate, useOutletContext } from '@remix-run/react';
import { useHotkeys } from 'react-hotkeys-hook';
import { PhotoContextProps } from '../interfaces';

export default () => {
  const routeMatches = useMatches();

  const navigate = useNavigate();

  // current photo
  const id = routeMatches.at(-1)?.params.photoId as string;

  // prev/next navigation
  const { imageIds: photoIds, filesList } = useOutletContext() as PhotoContextProps;

  // sizing hint
  const imageInfo = filesList.find((f) => f.uuid === id)?.contentInfo?.image;
  const styleHint = imageInfo && { width: imageInfo.width, height: imageInfo.height };

  // navigation
  const photoRouteUrl = (index) => `/photos/${photoIds[index]}`;
  const i = photoIds.indexOf(id);
  const prev = i <= 0 ? null : photoRouteUrl(i - 1);
  const next = i >= photoIds.length - 1 ? null : photoRouteUrl(i + 1);
  let navigation = (
    <>
      {prev && (
        <Link className="photo__prev" to={prev}>
          <div className="photo__link-text">PREV</div>
        </Link>
      )}
      {next && (
        <Link className="photo__next" to={next}>
          <div className="photo__link-text">NEXT</div>
        </Link>
      )}
    </>
  );
  useHotkeys('left', () => prev && navigate(prev));
  useHotkeys('right', () => next && navigate(next));

  const close = (e) => { if('photo__link-text' !== e.target.className) navigate('/photos'); }
  useHotkeys('escape', close);

  const photoImageUrl = (id) => `https://ucarecdn.com/${id}/`;
  // const photoImageUrl = (id) => filesList.find(f => f.uuid === id)?.

  return (
    <div className="photo" onClick={close}>
      <div className="photo__img" style={{ ...styleHint }}>
        <img src={photoImageUrl(id)} />
        {navigation}
      </div>
    </div>
  );
};