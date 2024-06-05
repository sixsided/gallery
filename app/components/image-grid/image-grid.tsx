import './image-grid.css';
import { DbFile } from '../../lib/interfaces';
import GridItem from '../grid-item/grid-item';

const resize = `-/resize/x240`;
const imgUrl = (uuid, tweak) => `https://ucarecdn.com/${uuid}/${tweak}/`;
const thumbnail = (uuid) => imgUrl(uuid, resize);

export function ImageGrid({ images }: { images: DbFile[] }) {
  return (
    <div className="image-grid">
      {[...images].map((x) => (
        <GridItem
          key={x.uuid}
          name={x.originalFilename || 'untitled'}
          thumbnailUrl={thumbnail(x.uuid)}
          largeUrl={`/photos/${x.uuid}`}
          originalUrl={x['originalFileUrl'] || '#'}
          dimensions={x.contentInfo?.image}
        />
      ))}
    </div>
  );
}
