import { fetchJSON } from "./api.js";


const form =
    document.querySelector("#weatherForm");

const cityInput =
    document.querySelector("#cityInput");

const result =
    document.querySelector("#weatherResult");

const status =
    document.querySelector("#weatherStatus");


const weatherCodes = {

    0: "Clear Sky",

    1: "Mainly Clear",

    2: "Partly Cloudy",

    3: "Overcast",

    45: "Fog",

    48: "Rime Fog",

    51: "Light Drizzle",

    53: "Moderate Drizzle",

    55: "Dense Drizzle",

    61: "Slight Rain",

    63: "Moderate Rain",

    65: "Heavy Rain",

    71: "Slight Snow",

    73: "Moderate Snow",

    75: "Heavy Snow",

    80: "Rain Showers",

    81: "Moderate Rain Showers",

    82: "Heavy Rain Showers",

    95: "Thunderstorm",

    96: "Thunderstorm with Hail",

    99: "Heavy Thunderstorm"
};


const getWeather = async (city) => {

    const locationURL =
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    const locationData =
        await fetchJSON(locationURL);


    if (!locationData.results?.length) {

        throw new Error(
            "City not found. Please check the city name."
        );

    }


    const {
        latitude,
        longitude,
        name,
        country
    } = locationData.results[0];


    const weatherURL =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;


    const weatherData =
        await fetchJSON(weatherURL);


    return {
        ...weatherData.current,
        name,
        country
    };
};


const displayWeather = (data) => {

    const {
        name,
        country,
        temperature_2m,
        relative_humidity_2m,
        weather_code,
        wind_speed_10m
    } = data;


    result.innerHTML = `

        <div class="weather-main">

            <div>

                <div class="location">
                    ${name}, ${country}
                </div>

                <h2>
                    ${weatherCodes[weather_code]
                        || "Current Conditions"}
                </h2>

                <div class="condition">
                    Current Weather
                </div>

            </div>


            <div class="temperature">

                ${Math.round(temperature_2m)}

                <span class="unit">
                    °C
                </span>

            </div>

        </div>


        <div class="weather-details">

            <div class="detail">

                <span>
                    💧 Humidity
                </span>

                <strong>
                    ${relative_humidity_2m}%
                </strong>

            </div>


            <div class="detail">

                <span>
                    💨 Wind Speed
                </span>

                <strong>
                    ${wind_speed_10m} km/h
                </strong>

            </div>


            <div class="detail">

                <span>
                    🌡️ Temperature
                </span>

                <strong>
                    ${temperature_2m} °C
                </strong>

            </div>

        </div>

    `;


    result.classList.remove("hidden");
};


form.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const city =
            cityInput.value.trim();


        if (!city) {

            status.textContent =
                "Please enter a city name.";

            return;
        }


        status.textContent =
            "Loading weather information...";


        result.classList.add("hidden");


        try {

            const weather =
                await getWeather(city);


            displayWeather(weather);


            status.textContent = "";

        }

        catch (error) {

            status.textContent =
                `⚠️ ${error.message}`;

        }

    }
);