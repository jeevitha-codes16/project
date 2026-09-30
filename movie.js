/* =========================================
   FLARE - MOVIE SEARCH
   OMDb API
========================================= */


/* =========================================
   1. PUT YOUR OMDb API KEY HERE
========================================= */

const API_KEY = "7b946ca1";


/* =========================================
   2. OMDb API URL
========================================= */

const API_URL = "https://www.omdbapi.com/";


/* =========================================
   3. GET HTML ELEMENTS
========================================= */

const form = document.getElementById("movieForm");

const input = document.getElementById("movieInput");

const grid = document.getElementById("movieGrid");

const status = document.getElementById("movieStatus");


/* =========================================
   4. SEARCH MOVIES
========================================= */

async function searchMovies(movieName) {

    const url =
        `${API_URL}?apikey=${API_KEY}` +
        `&s=${encodeURIComponent(movieName)}` +
        `&type=movie`;


    const response = await fetch(url);


    if (!response.ok) {

        throw new Error(
            "Unable to connect to OMDb."
        );

    }


    const data = await response.json();


    /*
       OMDb returns:
       Response = "True" when movies are found
    */

    if (data.Response === "False") {

        throw new Error(
            data.Error || "Movie not found."
        );

    }


    return data.Search || [];

}


/* =========================================
   5. DISPLAY MOVIES
========================================= */

function displayMovies(movies) {

    grid.innerHTML = "";


    if (!movies || movies.length === 0) {

        grid.innerHTML = `

            <div class="empty">

                🎬

                <br><br>

                No movies found.

                <br><br>

                Try another movie name.

            </div>

        `;

        return;
    }


    movies.forEach((movie) => {

        const card =
            document.createElement("article");


        card.className = "movie-card";


        const title =
            movie.Title || "Unknown Movie";


        const year =
            movie.Year || "N/A";


        const poster =
            movie.Poster !== "N/A"
                ? movie.Poster
                : "https://via.placeholder.com/500x750?text=No+Poster";


        card.innerHTML = `

            <img
                class="movie-poster"
                src="${poster}"
                alt="${title} poster"
                onerror="
                    this.src='https://via.placeholder.com/500x750?text=No+Poster'
                "
            >

            <div class="movie-info">

                <h3>
                    ${title}
                </h3>

                <div class="movie-meta">

                    <span>
                        ${year}
                    </span>

                    <span class="movie-rating">
                        ${movie.Type || "Movie"}
                    </span>

                </div>

            </div>

        `;


        grid.appendChild(card);

    });

}


/* =========================================
   6. SEARCH FORM
========================================= */

form.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const movieName =
            input.value.trim();


        /* EMPTY SEARCH */

        if (movieName === "") {

            status.textContent =
                "Please enter a movie name.";

            grid.innerHTML = "";

            return;
        }


        /* API KEY CHECK */

        if (
            API_KEY ===
            "PASTE_YOUR_OMDB_API_KEY_HERE"
        ) {

            status.textContent =
                "Please add your OMDb API key in movie.js.";

            grid.innerHTML = `

                <div class="empty">

                    🔑

                    <br><br>

                    OMDb API key is missing.

                </div>

            `;

            return;
        }


        /* LOADING */

        status.textContent =
            `Searching for "${movieName}"...`;


        grid.innerHTML = `

            <div class="loading">

                Searching...

            </div>

        `;


        try {

            const movies =
                await searchMovies(movieName);


            displayMovies(movies);


            status.textContent =
                `${movies.length} movie result(s) found.`;

        }


        catch (error) {

            console.error(error);


            grid.innerHTML = `

                <div class="empty">

                    ⚠️

                    <br><br>

                    ${error.message}

                    <br><br>

                    Please try another movie name.

                </div>

            `;


            status.textContent =
                "Movie search failed.";

        }

    }
);