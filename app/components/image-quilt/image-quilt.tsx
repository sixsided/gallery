import './image-quilt.css';

const resize = `-/resize/x240`;
const imgUrl = (p, tweak) => `https://ucarecdn.com/${p.uuid}/${tweak}/`;
const ucConstrain = (img) => imgUrl(img, resize);

export function ImageQuilt({ images, onClick }) {
  return (
    <div className="image-quilt">
      {images.map((x) => (
        <a className="image-quilt__item" href={`/photos/${x.uuid}`}>
          <img key={x.uuid} src={ucConstrain(x)} onClick={(e) => onClick(e, x)} />
        </a>
      ))}
    </div>
  );
}
