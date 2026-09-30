import { fetchJSON } from "./api.js";


const form =
    document.getElementById("weatherForm");


const input =
    document.getElementById("cityInput");


const result =
    document.getElementById("weatherResult");


const status =
    document.getElementById("weatherStatus");


/* WEATHER CODE */

function getWeatherCondition(code) {

    if (code === 0) {
        return "Clear sky";
    }

    if ([1, 2, 3].includes(code)) {
        return "Partly cloudy";
    }

    if ([45, 48].includes(code)) {
        return "Foggy";
    }

    if ([51, 53, 55, 56, 57].includes(code)) {
        return "Drizzle";
    }

    if ([61, 63, 65, 66, 67].includes(code)) {
        return "Rain";
    }

    if ([71, 73, 75, 77].includes(code)) {
        return "Snow";
    }

    if ([80, 81, 82].includes(code)) {
        return "Rain showers";
    }

    if ([95, 96, 99].includes(code)) {
        return "Thunderstorm";
    }

    return "Unknown";
}


/* SEARCH WEATHER */

async function searchWeather(city) {

    const locationURL =
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;


    const locationData =
        await fetchJSON(locationURL);


    if (
        !locationData.results ||
        locationData.results.length === 0
    ) {

        throw new Error(
            "City not found."
        );

    }


    const {
        latitude,
        longitude,
        name,
        country
    } =
        locationData.results[0];


    const weatherURL =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;


    const weatherData =
        await fetchJSON(weatherURL);


    return {
        name,
        country,
        weather: weatherData.current
    };
}


/* DISPLAY */

function displayWeather(data) {

    const weather =
        data.weather;


    const condition =
        getWeatherCondition(
            weather.weather_code
        );


    result.innerHTML = `

        <article class="weather-card">

            <h2>
                ${data.name}, ${data.country}
            </h2>


            <div class="temperature">
                ${weather.temperature_2m}°C
            </div>


            <p class="condition">
                ${condition}
            </p>


            <div class="weather-details">

                <div class="detail">

                    <span>
                        Humidity
                    </span>

                    <strong>
                        ${weather.relative_humidity_2m}%
                    </strong>

                </div>


                <div class="detail">

                    <span>
                        Wind Speed
                    </span>

                    <strong>
                        ${weather.wind_speed_10m} km/h
                    </strong>

                </div>

            </div>

        </article>

    `;
}


/* FORM */

form.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const city =
            input.value.trim();


        if (!city) {

            status.textContent =
                "Please enter a city name.";

            result.innerHTML = "";

            return;
        }


        status.textContent =
            "Loading weather...";


        result.innerHTML = "";


        try {

            const data =
                await searchWeather(city);


            displayWeather(data);


            status.textContent =
                "Weather information updated.";

        }


        catch (error) {

            console.error(error);


            status.textContent =
                "Unable to find weather information.";


            result.innerHTML = `

                <div class="empty">

                    ⚠️

                    <br><br>

                    ${error.message}

                </div>

            `;

        }

    }
);