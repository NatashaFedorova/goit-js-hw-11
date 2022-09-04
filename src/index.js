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
let totalHits = 0;
let numberOfCards = 0;

const form = {};

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('input', onInputForm);
refs.searchForm.addEventListener('submit', onSubmitForm);
refs.loadMore.addEventListener('click', onLoadMoreBtnClick);

function onInputForm(e) {
  defaultNumberOfCardsAndTotalHits();
  form[e.target.name] = e.target.value.trim();
}

function onSubmitForm(e) {
  e.preventDefault();
  clearGallery();
  notVisibilityLoadMoreBtn();
  requestToCreateСollection(Object.values(form));
}

function addCardsToGallery(arr) {
  refs.gallery.insertAdjacentHTML('beforeend', createCardTemplate(arr));
  successMessage();

  if (numberOfCards !== totalHits) {
    isVisibilityLoadMoreBtn();
  } else {
    notVisibilityLoadMoreBtn();
    infoMessage();
  }
  defineLightboxParameters();
}

async function requestToCreateСollection(value) {
  try {
    const response = await processingRequest(value);
    totalHits = response.totalHits;
    numberOfCards += response.hits.length;
    addCardsToGallery(response.hits);
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
      notVisibilityLoadMoreBtn();
      throw new Error();
    }
    return response.data;
  } catch (error) {
    failureMessage();
  }
}

function onLoadMoreBtnClick() {
  page += 1;
  requestToCreateСollection(Object.values(form));
}

function isVisibilityLoadMoreBtn() {
  refs.loadMore.classList.add('is-visible');
}

function notVisibilityLoadMoreBtn() {
  refs.loadMore.classList.remove('is-visible');
}

function defaultNumberOfCardsAndTotalHits() {
  page = 1;
  numberOfCards = 0;
}

function defineLightboxParameters() {
  return (lightbox = new SimpleLightbox('.gallery-card a', {
    captionDelay: 250,
  }));
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

function successMessage() {
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}

function infoMessage() {
  Notiflix.Notify.info(
    'Were sorry, but youve reached the end of search results.'
  );
}
function failureMessage() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again'
  );
}

// бесконечный скролл
