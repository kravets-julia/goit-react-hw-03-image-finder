import { Component } from 'react';
import css from '../../components/ImageGallery/ImageGallery.module.css';
import { ImageGalleryItem } from 'components/ImageGalleryItem/ImageGalleryItem';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'components/Modal/Modal';
import { LoadMoreBtn } from 'components/Button/Button';
import { Loader } from 'components/Loader/Loader';

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
      this.setState({ status: 'pending' });

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
          this.setState({ img: hits, status: 'resolved' });
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

        .then(({ hits, totalHits }) => {
          if (hits.length <= 12) {
            this.setState({ status: 'resolved' });
            return toast.info('No more image');
          }

          this.setState(prevState => ({
            img: [...prevState.img, ...hits],
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
    if (this.state.status === 'idle') {
      return <div>Заповніть поле пошуку</div>;
    }
    if (this.state.status === 'pending') {
      return <Loader />;
    }
    if (this.state.status === 'rejected') {
      return <div>Error...</div>;
    }
    if (this.state.status === 'resolved') {
      //   console.log(this.state.img.length);
      return (
        <>
          {this.state.img.length > 0 && !this.state.showModal && (
            <ul className={css.ImageGallery} onClick={e => this.onImgClick(e)}>
              <ImageGalleryItem img={this.state.img} modal={this.toggleModal} />
            </ul>
          )}
          {this.state.img.length > 0 && this.state.showModal && (
            <ul className={css.ImageGallery}>
              <ImageGalleryItem img={this.state.img} modal={this.toggleModal} />
            </ul>
          )}
          {this.state.showModal && (
            <Modal
              largeImg={this.state.largeImgURL}
              onClose={this.toggleModal}
            />
          )}
          {/* {this.state.img.length <= 12 && toast.info('No more image')} */}
          {this.state.img.length >= 12 && (
            <LoadMoreBtn loadMore={this.handleIncrement} />
          )}
        </>
      );
    }
  }
}
