import { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import css from './App.module.css';

export class App extends Component {
  state = {
    searchName: '',
  };

  handleFormSubmit = searchName => {
    this.setState({ searchName });
  };
  render() {
    return (
      <div className={css.App}>
        <Searchbar onSubmit={this.handleFormSubmit} />
        <ImageGallery searchName={this.state.searchName} />
        <ToastContainer />
      </div>
    );
  }
}
