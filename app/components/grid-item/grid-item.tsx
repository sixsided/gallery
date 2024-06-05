import { Link } from '@remix-run/react';
import ExpandIcon from '../expand-icon/expand-icon';
import './grid-item.css';

const dims = ({ width, height }) => {
  return `${width} x ${height}`;
};

type GridItemProps = {
  thumbnailUrl: string;
  largeUrl: string;
  originalUrl: string;
  name?: string;
  dimensions?: { width: number; height: number };
};

export default ({ thumbnailUrl, largeUrl, originalUrl, name, dimensions }: GridItemProps) => {
  const thumbnailCssUrl = `url("${thumbnailUrl}")`;
  return (
    <div className="grid-item">
      <Link to={largeUrl} title={name}>
        <div className="grid-item__thumbnail" style={{ backgroundImage: thumbnailCssUrl }}></div>
      </Link>
      <a className="grid-item__tools no-tufte-underline" target="_blank" href={originalUrl} title={name}>
        <ExpandIcon />
        {dimensions && <div>{dims(dimensions)}</div>}
      </a>
    </div>
  );
};
