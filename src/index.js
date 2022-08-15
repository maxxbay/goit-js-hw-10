import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchcountries';

const DEBOUNCE_DELAY = 300;

const inputCountry = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

//========ФУНКЦІЇ================

const clearContent = () => {
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
};

const searchCountry = event => {
  const findCountry = event.target.value.trim();
  if (!findCountry) {
    clearContent();
    return;
  }
  fetchCountries(findCountry)
    .then(country => {
      if (country.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        clearContent();
        return;
      } else if (country.length === 1) {
        clearContent(countryList.innerHTML);
        renderCountryInfo(country);
      } else if (country.length > 1 && country.length <= 10) {
        clearContent(countryInfo.innerHTML);
        renderCountryList(country);
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      clearContent();
      return error;
    });
};

//==========ПОКАЗ ОДНОЇ АБО ДЕКІЛЬКОХ КРАЇН В ПОШУКУ=========================

const renderCountryList = country => {
  const markup = country
    .map(({ name, flags }) => {
      return `<li><img src="${flags.svg}" alt="${name.official}" width="100" height="60"><p>${name.official}</p></li>`;
    })
    .join('');
  countryList.innerHTML = markup;
};

//=========ПОКАЗ 10 АБО МЕНШЕ КРАЇН=================

const renderCountryInfo = country => {
  const markup = country
    .map(({ name, capital, population, flags, languages }) => {
      return `<section><h1><img src="${flags.svg}" alt="${
        name.official
      }" width="100" height="60"> ${name.official}</h1>
      <p><span>Capital: </span> ${capital}</p>
      <p><span>Population:</span> ${population}</p>
      <p><span>Languages:</span> ${Object.values(languages)} </p><section>`;
    })
    .join('');
  countryInfo.innerHTML = markup;
};

//=========ВИКЛИК ПОДІЇ============
inputCountry.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));
