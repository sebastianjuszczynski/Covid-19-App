const header = document.querySelector(".header");
const form = document.querySelector(".form");
const countryContainer = document.querySelector(".country__container");

form.addEventListener("submit", e => {
    e.preventDefault();
    const country = form.country.value.trim();
    form.reset();
    form.country.blur();
    updateCountry(country)
        .then(data => updateCountryStats(data, country))
        .catch(err => console.log(err));
})

const updateGlobalStats = async (data) => {
    const date = data.Date.toLocaleString();

    header.innerHTML = `
    <h1 class="header__h1">Covid 19 Stats!</h1>
    <p>${date.slice(0, 10)}</p>
    <h2 class="header__h2">Statistics for the whole world:</h2>
    <p class="header__paragraph">New cases: <span class="header__cases">${data.Global.NewConfirmed.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span></p>
    <p class="header__paragraph">Total cases: <span class="header__cases">${data.Global.TotalConfirmed.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span></p>
    <p class="header__paragraph">New deaths: <span class="header__deaths">${data.Global.NewDeaths.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span></p>
    <p class="header__paragraph">Total deaths: <span class="header__deaths">${data.Global.TotalDeaths.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span></p>
    <p class="header__paragraph">New recovered: <span class="header__recovered">${data.Global.NewRecovered.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span></p>
    <p class="header__paragraph">Total recovered: <span class="header__recovered">${data.Global.TotalRecovered.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span></p>
    
    `
}

const updateCountryStats = async (data, country) => {

    countryContainer.innerHTML = `
    <h2 class="header__h2">Statistics for ${country.replace(/^\w/, (c) => c.toUpperCase())}:</h2>
    <p class="form__paragraph">New cases: <span class="header__cases">${(data.countryDetails.Confirmed - data.countryDetails2.Confirmed).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span></p>
    <p class="form__paragraph">Total cases: <span class="header__cases">${data.countryDetails.Confirmed.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span></p>
    <p class="form__paragraph">New deaths: <span class="header__deaths">${(data.countryDetails.Deaths - data.countryDetails2.Deaths).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span></p>
    <p class="form__paragraph">Total deaths: <span class="header__deaths">${data.countryDetails.Deaths.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span></p>
    <p class="form__paragraph">New recovered: <span class="header__recovered">${(data.countryDetails.Recovered - data.countryDetails2.Recovered).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span></p>
    <p class="form__paragraph">Total recovered: <span class="header__recovered">${data.countryDetails.Recovered.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span></p>
`
}
const updateCountry = async (country) => {
    const countryDetails = await getStats(country);
    const length = countryDetails.length;
    const index = length - 1;

    return {
        countryDetails: countryDetails[index],
        countryDetails2: countryDetails[index - 1]
    };
}

const getStats = async (country) => {
    const base = `https://api.covid19api.com/total/country/${country}`;


    const response = await fetch(base);
    const data = await response.json();

   

return data;
};
getStats()
    .then(data => updateCountryStats(data))
    .catch(err => console.log(err));

const getGlobalStats = async () => {
    const base = "https://api.covid19api.com/summary";

    const response = await fetch(base);
    const data = await response.json();

    return data;

};
getGlobalStats()
    .then(data => updateGlobalStats(data))
    .catch(err => console.log(err));
