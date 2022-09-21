import './css/styles.css';
import { fetchCountries } from './api/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const searchInput = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

searchInput.addEventListener('input', debounce(getCountryData, DEBOUNCE_DELAY));

function getCountryData(event) {
    const countryName = event.target.value.trim();

    if (!countryName) {
        return;
    }
    
    fetchCountries(countryName)
        .then(data => {
            
            if (data.length >= 2 && data.length <= 10) {
                markupCountryList(data);
            }
            
            if (data.length > 10) {
                Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
            }
            if (data.length === 1) { markupCountry(data[0]); }
        })
        .catch(err => {
            Notiflix.Notify.failure('Oops, there is no country with that name');
        });
    
}

function markupCountry(data){
    const markupOne = data.map(({ name, capital, population, languages }) => {
        return `<img src="${flags.svg}" alt="${name}" width="50px" height="50px"/>
        <h2>${name.official}</h2>
        <p>Capital:&nbsp<span>${capital}</span></p>
        <p>Population:&nbsp<span>${population}</span></p>
        <p>Languages:&nbsp<span>${languages}</span></p>`;
    }).join('');

    countryInfoEl.insertAdjacentHTML('beforeend', markupOne);
    };

function markupCountryList(data) {
    const markup = data.map(({ flags, name }) => {
        return `<li class = "country__list__item">
        <img src="${flags.svg}" alt="${name}" width="50px" height="50px"/>
        <p>${name.official}</p>
        </li>`;
    }).join('');
  
    countryListEl.insertAdjacentHTML('beforeend', markup);
    
}

// console.log(markupOne);