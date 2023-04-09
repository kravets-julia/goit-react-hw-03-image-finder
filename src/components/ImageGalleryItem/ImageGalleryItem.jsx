import PropTypes from 'prop-types';
import css from '../../components/ImageGalleryItem/ImageGalleryItem.module.css';

export const ImageGalleryItem = ({ webformatURL, id, tags }) => {
  return (
    <>
      <li className={css.ImageGalleryItem}>
        <img
          src={webformatURL}
          alt={tags}
          className={css.ImageGalleryItem__image}
          id={id}
        />
      </li>
    </>
  );
};

ImageGalleryItem.propTypes = {
  webformatURL: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  tags: PropTypes.string.isRequired,
};
