const header = document.querySelector(".header");
const form = document.querySelector(".form");
const countryContainer = document.querySelector(".country__container");

form.addEventListener("submit", e => {
    e.preventDefault();
    const country = form.country.value.trim();
    form.reset();
    form.country.blur();
    updateCountry(country)
        .then(data => updateCountryStats(data))
        .catch(err => alert("No data for this country"));
});

const casesCounter = () => {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;

            const inc = target / speed;

            if (count < target) {
                counter.innerText = (count + inc).toFixed(2);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target.toFixed().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
            }
        };

        updateCount();
    });
}

const updateGlobalStats = async (data) => {
    const date = data.Date.toLocaleString();

    header.innerHTML = `
    <h1 class="header__h1">Covid 19 Stats! <img src="img/covid-19.svg" alt="covid image"></h1>
    <p class="header__paragraph-date">${date.slice(0, 10)}</p>
    <h2 class="header__h2">Whole world statistics:</h2>
    <p class="header__paragraph">New cases: <span class="header__cases counter" data-target="${data.Global.NewConfirmed}">0</span></p>
    <p class="header__paragraph">Total cases: <span class="header__cases counter" data-target="${data.Global.TotalConfirmed}">0</span></p>
    <p class="header__paragraph">New deaths: <span class="header__deaths counter" data-target="${data.Global.NewDeaths}">0</span></p>
    <p class="header__paragraph">Total deaths: <span class="header__deaths counter" data-target="${data.Global.TotalDeaths}">0</span></p>
    <p class="header__paragraph">New recovered: <span class="header__recovered counter" data-target="${data.Global.NewRecovered}">0</span></p>
    <p class="header__paragraph">Total recovered: <span class="header__recovered counter" data-target="${data.Global.TotalRecovered}">0</span></p>
    `
    casesCounter();
}

const updateCountryStats = async (data) => {

    countryContainer.innerHTML = `
    <h2 class="header__h2">Statistics for ${data !== undefined ? data.countryDetails.Country : "country"}:</h2>
    ${data !== undefined ?
       `<p class="form__paragraph">New cases: <span class="header__cases counter" data-target="${data.countryDetails.Confirmed - data.countryDetails2.Confirmed}">0</span></p>
        <p class="form__paragraph">Total cases: <span class="header__cases counter" data-target="${data.countryDetails.Confirmed}">0</span></p>
        <p class="form__paragraph">New deaths: <span class="header__deaths counter" data-target="${data.countryDetails.Deaths - data.countryDetails2.Deaths}">0</span></p>
        <p class="form__paragraph">Total deaths: <span class="header__deaths counter" data-target="${data.countryDetails.Deaths}">0</span></p>`
    : 
       `<p class="form__paragraph">New cases: <span class="header__cases">N/A</span></p>
        <p class="form__paragraph">Total cases: <span class="header__cases">N/A</span></p>
        <p class="form__paragraph">New deaths: <span class="header__deaths">N/A</span></p>
        <p class="form__paragraph">Total deaths: <span class="header__deaths">N/A</span></p>`
    }   
`
// console.log(data.countryDetails.Deaths);
// console.log(data.countryDetails2.Deaths);
// console.log(data.countryDetails.Deaths - data.countryDetails2.Deaths);
    casesCounter();
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

    if (country !== undefined) {
        const response = await fetch(base);
        const data = await response.json();
        console.log(data)
        return data;

    }
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
