import { fetchJSON } from "./api.js";


const form =
    document.querySelector("#movieForm");

const input =
    document.querySelector("#movieInput");

const grid =
    document.querySelector("#movieGrid");

const status =
    document.querySelector("#movieStatus");

const keyInput =
    document.querySelector("#apiKey");

const saveKey =
    document.querySelector("#saveKey");


keyInput.value =
    localStorage.getItem("omdb_api_key") || "";


saveKey.addEventListener(
    "click",
    () => {

        const key =
            keyInput.value.trim();


        if (!key) {

            status.textContent =
                "Please enter your OMDb API key.";

            return;
        }


        localStorage.setItem(
            "omdb_api_key",
            key
        );


        status.textContent =
            "API key saved.";
    }
);


const searchMovies = async (title) => {

    const key =
        localStorage.getItem("omdb_api_key");


    if (!key) {

        throw new Error(
            "Please enter your OMDb API key first."
        );
    }


    const searchURL =
        `https://www.omdbapi.com/?apikey=${encodeURIComponent(key)}&s=${encodeURIComponent(title)}&type=movie`;


    const searchData =
        await fetchJSON(searchURL);


    if (searchData.Response === "False") {

        throw new Error(
            searchData.Error ||
            "No movies found."
        );
    }


    const movies =
        await Promise.all(

            searchData.Search
                .slice(0, 10)
                .map(
                    async ({ imdbID }) => {

                        try {

                            return await fetchJSON(
                                `https://www.omdbapi.com/?apikey=${encodeURIComponent(key)}&i=${imdbID}&plot=short`
                            );

                        }

                        catch {

                            return null;
                        }

                    }
                )

        );


    return movies.filter(Boolean);
};


const displayMovies = (movies) => {

    grid.innerHTML =

        movies.map(
            (movie) => `

            <article class="movie-card">

                <img
                    class="poster"
                    src="${
                        movie.Poster !== "N/A"
                            ? movie.Poster
                            : "https://via.placeholder.com/300x450?text=No+Poster"
                    }"
                    alt="${movie.Title} poster"
                >

                <div class="movie-info">

                    <h3>
                        ${movie.Title}
                    </h3>

                    <div class="meta">

                        <span>
                            ${movie.Year}
                        </span>

                        <span class="rating">
                            ★ ${movie.imdbRating}
                        </span>

                    </div>

                    <p class="plot">

                        ${
                            movie.Plot !== "N/A"
                                ? movie.Plot
                                : "Plot information is not available."
                        }

                    </p>

                </div>

            </article>

        `
        ).join("");
};


form.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const title =
            input.value.trim();


        if (!title) {

            status.textContent =
                "Please enter a movie title.";

            return;
        }


        status.textContent =
            "Searching movies...";


        grid.innerHTML = "";


        try {

            const movies =
                await searchMovies(title);


            displayMovies(movies);


            status.textContent =
                `${movies.length} movie(s) found.`;

        }

        catch (error) {

            grid.innerHTML = `
                <div class="empty">
                    🎬 No movies found.
                </div>
            `;

            status.textContent =
                `⚠️ ${error.message}`;
        }

    }
);