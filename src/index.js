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
    removeMarkup(countryListEl);
    removeMarkup(countryInfoEl);
    if (!countryName) {
        return;
    };
    fetchCountries(countryName)
        .then(data => {
            if (data.length === 1) {
                markupCountry(data[0]);
            }
            if (data.length >= 2 && data.length <= 10) {
                console.log(data);
                markupCountryList(data);
            } else if (data.length > 10) {
                Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
            };
        })
        .catch(err => {
            Notiflix.Notify.failure('Oops, there is no country with that name');
        });
};

function markupCountry(countryData) {
    console.log(countryData);
    const { flags, capital, population, name, languages } = countryData;
    const language = Object.values(languages).join(', ');
    const { } = languages;
    return countryInfoEl.insertAdjacentHTML('beforeend',
        `<div class="list__name">
        <img src="${flags.svg}" width = "75px" alt = "flag"/>
        <span>${name.official}</span></div>
        <ul>
        <li class="list">Capital: ${capital}</li>
        <li class="list">Population: ${population}</li>
        <li class="list">Languages: ${language}</li>
        </ul>`);
};

function markupCountryList(dataArr) {
    const markup = dataArr.map(({ flags, name }) => 
        `<li>
        <div class = "country__list__item"><img src="${flags.svg}" alt="${name}" width="30px" height="50px"/>
        <p>${name.official}</p></div>
        </li>`
    ).join('');
    countryListEl.insertAdjacentHTML('beforeend', markup);
}

function removeMarkup(element) {
    element.innerHTML = '';
};