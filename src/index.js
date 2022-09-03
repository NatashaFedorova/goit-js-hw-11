import createCardTemplate from './components/template.js';
import axios from 'axios';
import Notiflix from 'notiflix';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const KEY = '29685313-2ba6443e06a4499ef383b21bf';
const OPTIONS = 'image_type=photo&orientation=horizontal&safesearch=true';
const DEFAULT_HITS = 40;

let page = 1;

const form = {};

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};
console.log(refs.loadMore);

refs.searchForm.addEventListener('input', onInputForm);
refs.searchForm.addEventListener('submit', onSubmitForm);
refs.loadMore.addEventListener('click', onLoadMoreBtnClick);

function onInputForm(e) {
  form[e.target.name] = e.target.value.trim();
}

function onSubmitForm(e) {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  requestToCreateСollection(Object.values(form));
}

function addCardsToGallery(arr) {
  refs.gallery.insertAdjacentHTML('beforeend', createCardTemplate(arr));
  const lightbox = new SimpleLightbox('.gallery-card a', {
    captionDelay: 250,
  });
}

async function requestToCreateСollection(value) {
  try {
    const arr = await processingRequest(value);
    addCardsToGallery(arr);
  } catch (error) {
    console.log(error);
  }
}

async function processingRequest(value) {
  try {
    const response = await axios.get(
      `?key=${KEY}&q=${value}&${OPTIONS}&page=${page}&per_page=${DEFAULT_HITS}`
    );
    if (response.data.hits.length === 0) {
      throw new Error();
    }
    return response.data.hits;
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again'
    );
  }
}

function onLoadMoreBtnClick(e) {
  console.log('click');
}
