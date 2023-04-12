import { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types';
import { ImageGalleryItem } from 'components/ImageGalleryItem/ImageGalleryItem';
import Modal from 'components/Modal/Modal';
import { LoadMoreBtn } from 'components/Button/Button';
import { Loader } from 'components/Loader/Loader';
import css from '../../components/ImageGallery/ImageGallery.module.css';

export default class ImageGallery extends Component {
  state = {
    img: [],
    error: null,
    status: 'idle',
    showModal: false,
    largeImgURL: '',
    pageNumber: 1,
  };

  componentDidUpdate(prevProps, prevState) {
    //  Змінився запит
    if (prevProps.searchName !== this.props.searchName) {
      this.setState({ status: 'pending', pageNumber: 1, img: [] });

      const BASE_URL = 'https://pixabay.com/api/';
      const API_KEY = '33829392-49d1eab567acddcf43bdfe9f1';

      fetch(
        `${BASE_URL}?q=${this.props.searchName}&page=1&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`
      )
        .then(res => res.json())

        .then(({ hits, totalHits }) => {
          if (totalHits === 0) {
            this.setState({ status: 'resolved', img: [] });
            return toast.error(`No found image ${this.props.searchName}`);
            // console.log(`No found image ${this.props.searchName}`);
          }
          if (hits.length < 12) {
            this.setState({ status: 'resolved' });
            toast.info('No more image');
          }
          const arr = hits.map(({ id, tags, webformatURL, largeImageURL }) => ({
            id,
            tags,
            webformatURL,
            largeImageURL,
          }));
          this.setState({ img: arr, status: 'resolved' });
        })
        .catch(error => {
          this.setState({ img: [], error: true, status: 'rejected' });
          console.log(error);
        });
      return;
    }

    //   Зміна номеру сторінки (Load More)

    if (
      prevState.pageNumber !== this.state.pageNumber &&
      this.state.pageNumber > 1
    ) {
      this.setState({ status: 'pending' });

      const BASE_URL = 'https://pixabay.com/api/';
      const API_KEY = '33829392-49d1eab567acddcf43bdfe9f1';

      fetch(
        `${BASE_URL}?q=${this.props.searchName}&page=${this.state.pageNumber}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`
      )
        .then(res => res.json())

        .then(({ hits }) => {
          if (hits.length < 12) {
            toast.info('No more image');
          }
          const arr = hits.map(({ id, tags, webformatURL, largeImageURL }) => ({
            id,
            tags,
            webformatURL,
            largeImageURL,
          }));
          this.setState(prevState => ({
            img: [...prevState.img, ...arr],
            status: 'resolved',
          }));
        })
        .catch(error => {
          this.setState({ img: [], error: true, status: 'rejected' });
          toast.error('Sorry, something wrong. Try again later');
        });
    }
  }

  handleIncrement = () => {
    this.setState(prevState => ({ pageNumber: prevState.pageNumber + 1 }));
  };

  toggleModal = () => {
    this.setState(({ showModal }) => ({ showModal: !showModal }));
  };

  onImgClick = e => {
    const { img } = this.state;
    const index = img.findIndex(img => Number(img.id) === Number(e.target.id));
    this.setState({ largeImgURL: img[index].largeImageURL, showModal: true });
  };

  render() {
    // console.log(this.state.img.length);
    // console.log(this.state.pageNumber);

    return (
      <>
        {/* {this.state.status === 'idle' && <div>Заповніть поле пошуку</div>} */}
        {this.state.img.length > 0 && !this.state.showModal && (
          <>
            <ul className={css.ImageGallery} onClick={e => this.onImgClick(e)}>
              {this.state.img.map(img => (
                <ImageGalleryItem
                  key={img.id}
                  webformatURL={img.webformatURL}
                  id={img.id}
                  tags={img.tags}
                />
              ))}
            </ul>
            {this.state.status === 'pending' && <Loader />}
            {this.state.status === 'rejected' && <div>Error</div>}
          </>
        )}

        {this.state.showModal && (
          <Modal largeImg={this.state.largeImgURL} onClose={this.toggleModal} />
        )}

        {this.state.img.length - this.state.pageNumber * 12 >= 0 && (
          <LoadMoreBtn loadMore={this.handleIncrement} />
        )}
      </>
    );
  }
}

ImageGallery.propTypes = {
  searchName: PropTypes.string.isRequired,
};
