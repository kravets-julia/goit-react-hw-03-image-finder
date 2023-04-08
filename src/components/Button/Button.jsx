import PropTypes from 'prop-types';
import css from '../../components/Button/Button.module.css';

export const LoadMoreBtn = ({ loadMore }) => {
  return (
    <button type="button" className={css.Button} onClick={() => loadMore()}>
      Load more
    </button>
  );
};

LoadMoreBtn.propTypes = {
  loadMore: PropTypes.func.isRequired,
};
