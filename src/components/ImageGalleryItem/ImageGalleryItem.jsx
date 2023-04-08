// import { Modal } from 'components/Modal/Modal';
import css from '../../components/ImageGalleryItem/ImageGalleryItem.module.css';

export const ImageGalleryItem = ({ img }) => {
  return (
    <>
      {img.map(el => (
        <li key={el.id} className={css.ImageGalleryItem}>
          <img
            src={el.webformatURL}
            alt={el.tags}
            className={css.ImageGalleryItem__image}
            id={el.id}
          />
        </li>
      ))}
    </>
  );
};
