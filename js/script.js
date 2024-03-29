
const global = {
    currentPage: window.location.pathname,
    search: {
        term: '',
        type: '',
        page: `1`,
        totalPages: 1,
        totalResults: 0,
    },

    api: {
        apiKey: '81d8e294631eb763043051e297c1fb2d',
        apiUrl: 'https://api.themoviedb.org/3/',
    }
}



async function displayPopularMovies() {
    const { results } = await fetchApiData('movie/popular');

    results.forEach(movie => {
        const div = document.createElement('div');
        div.classList.add('card')
        div.innerHTML = `
            <a href="movie-details.html?id=${movie.id}">
            ${movie.poster_path
                ? `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt=${movie.title} class="card-img-top" />

                `: `
            <img src="../images/no-image.jpg" alt="no images" class="card-img-top" />

                `
            }
            </a>
            <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
            <small class="text-muted">${movie.release_date}</small>
            </p>
            </div>


        `
        document.querySelector('#popular-movies').appendChild(div);
    })
}
//dispaly popular tv shows
async function displayPopularShows() {
    const { results } = await fetchApiData('tv/popular');

    results.forEach(show => {
        const div = document.createElement('div');
        div.classList.add('card')
        div.innerHTML = `
            <a href="tv-details.html?id=${show.id}">
            ${show.poster_path
                ? `
            <img src="https://image.tmdb.org/t/p/w500${show.poster_path}" alt=${show.name} class="card-img-top" />
                
                `: `
            <img src="../images/no-image.jpg" alt="no images" class="card-img-top" />
                
                `
            }
            </a>
            <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
            <small class="text-muted">Air Date: ${show.first_air_date}</small>
            </p>
            </div>
            
        
        `
        document.querySelector('#popular-shows').appendChild(div);
    })
}

// display movie details
async function displayMovieDetails() {
    const movieId = window.location.search.split("=")[1]
    const movie = await fetchApiData(`movie/${movieId}`)
    // overlay for background image
    displayBackgroundImage('movie', movie.backdrop_path)

    const { title, poster_path, release_date, vote_average, overview, homepage, budget, revenue, runtime, status } = movie;
    const div = document.createElement('div');
    div.innerHTML = `
      <div class="details-top">
          <div>
            ${poster_path
            ? `
            <img src="https://image.tmdb.org/t/p/w500${poster_path}" alt=${title} class="card-img-top" />
                
                `: `
            <img src="../images/no-image.jpg" alt="no images" class="card-img-top" />
                
                `
        }
          </div>
          <div>
            <h2>${title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${vote_average.toFixed(1)}/ 10
            </p>
            <p class="text-muted">Release Date: ${release_date}</p>
            <p>
             ${overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
             ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href=${homepage} target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span>  ${addCommasToNumber(budget)}</li>
            <li><span class="text-secondary">Revenue:</span> ${addCommasToNumber(revenue)}</li>
            <li><span class="text-secondary">Runtime:</span> ${runtime} minutes</li>
            <li><span class="text-secondary">Status:</span> ${status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${movie.production_companies.map((company) => `<span>${company.name}</span>`).join(', ')}</div>
        </div>
`;
    document.querySelector('#movie-details').appendChild(div);
}

// display show details
async function displayShowDetails() {
    const showId = window.location.search.split("=")[1]
    const show = await fetchApiData(`tv/${showId}`)
    // overlay for background image
    displayBackgroundImage('tv', show.backdrop_path)

    const { name, poster_path, first_air_date, vote_average, overview, homepage, status, number_of_seasons, number_of_episodes, last_air_date } = show;

    const div = document.createElement('div');
    div.innerHTML = `
      <div class="details-top">
          <div>
            ${poster_path
            ? `
            <img src="https://image.tmdb.org/t/p/w500${poster_path}" alt=${name} class="card-img-top" />
                
                `: `
            <img src="../images/no-image.jpg" alt="no images" class="card-img-top" />
                
                `
        }
          </div>
          <div>
            <h2>${name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${vote_average.toFixed(1)}/ 10
            </p>
            <p class="text-muted">Last Air Date: ${last_air_date}</p>
            <p>
             ${overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
             ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href=${homepage} target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number of Episodes:</span> ${number_of_episodes}</li>
            <li><span class="text-secondary">Last Episode to Air:</span> ${last_air_date}</li>
            <li><span class="text-secondary">Status:</span> ${status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${show.production_companies.map((company) => `<span>${company.name}</span>`).join(', ')}</div>
        </div>
`;
    document.querySelector('#show-details').appendChild(div);
}

//display background image on details pages
function displayBackgroundImage(type, backgroundPath) {
    const overlayDiv = document.createElement('div');
    overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
    overlayDiv.style.backgroundSize = 'cover';
    overlayDiv.style.backgroundPosition = 'center';
    overlayDiv.style.backgroundRepeat = 'no-repeat';
    overlayDiv.style.height = '100vh';
    overlayDiv.style.width = '100vw';
    overlayDiv.style.position = 'absolute';
    overlayDiv.style.top = '0';
    overlayDiv.style.left = '0';
    overlayDiv.style.zIndex = '-1';
    overlayDiv.style.opacity = '0.2';

    if (type === 'movie')
    {
        document.querySelector('#movie-details').appendChild(overlayDiv);
    } else
    {
        document.querySelector('#show-details').appendChild(overlayDiv);
    }
}

// search movies and shows
async function search() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    global.search.type = urlParams.get('type')
    global.search.term = urlParams.get('search-term')

    if (global.search.term !== '' && global.search.term !== null)
    {
        //@todo - make request and display results
        const { results, total_pages, page, total_results } = await searchApiData()

        global.search.page = page
        global.search.totalPages = total_pages
        global.search.totalResults = total_results

        if (results.length === 0)
        {
            showAlert('No results found');
            return
        }

        displaySearchResults(results)

        document.querySelector('#search-term').value = ''
    } else
    {
        showAlert('Please enter a search term')
    }

}

function displaySearchResults(results) {
    // clear prev results
    document.querySelector('#search-results').innerHTML = ''
    document.querySelector('#search-results-heading').innerHTML = ''
    document.querySelector('#pagination').innerHTML = ''

    results.forEach(result => {
        const div = document.createElement('div');
        div.classList.add('card')
        div.innerHTML = `
            <a href="${global.search.type}-details.html?id=${result.id}">
            ${result.poster_path
                ? `
            <img src="https://image.tmdb.org/t/p/w500${result.poster_path}" alt=${global.search.type === 'movie' ? result.title : result.name} class="card-img-top" />

                `: `
            <img src="../images/no-image.jpg" alt=${global.search.type === 'movie' ? result.title : result.name} class="card-img-top" />

                `
            }
            </a>
            <div class="card-body">
            <h5 class="card-title">${global.search.type === 'movie' ? result.title : result.name}</h5>
            <p class="card-text">
            <small class="text-muted">${global.search.type === 'movie' ? result.release_date : result.first_air_date}</small>
            </p>
            </div>


        `
        document.querySelector('#search-results-heading').innerHTML = `
         <h2>${results.length} of ${global.search.totalResults} results for ${global.search.term}</h2>
        `;
        document.querySelector('#search-results').appendChild(div);
    })

    displayPagination()
}

// create and display pagination for search
function displayPagination() {
    const div = document.createElement('div')
    div.classList.add('pagination')
    div.innerHTML = `
       <button class="btn btn-primary" id="prev">Prev</button>
        <button class="btn btn-primary" id="next">Next</button>
        <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
    `
    document.querySelector('#pagination').appendChild(div)

    // disable prev button if on first page
    if (global.search.page === 1)
    {
        document.querySelector('#prev').disabled = true
    }

    // disable next button if on last page
    if (global.search.page === global.search.totalPages)
    {
        document.querySelector('#next').disabled = true
    }

    // next page
    document.querySelector('#next').addEventListener('click', async () => {
        global.search.page++
        const { results, total_pages } = await searchApiData()
        displaySearchResults(results)
    })

    document.querySelector('#prev').addEventListener('click', async () => {
        global.search.page--
        const { results, total_pages } = await searchApiData()
        displaySearchResults(results)
    })
}

// display slider movies
async function displaySlider() {
    const { results } = await fetchApiData(`movie/now_playing`);

    results.forEach((movie) => {
        const div = document.createElement('div');
        div.classList.add('swiper-slide')
        div.innerHTML = `
         <a href=movie-details.html?id=${movie.id}"> 
         <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt=${movie.title} />
            </a>
          <h4 class="swiper-rating">
          <i class="fas fa-star text-secondary"></i>
          ${movie.vote_average}/ 10
            </h4>      
        `

        document.querySelector('.swiper-wrapper').appendChild(div);

        initSwiper();
    })
}

function initSwiper() {
    const swiper = new Swiper('.swiper', {
        // Optional parameters
        slidesPerView: 1,
        spaceBetween: 30,
        freeMode: true,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,

        },
        breakpoints: {
            500: {
                slidesPerView: 2,
            },
            700: {
                slidesPerView: 3,
            },
            1200: {
                slidesPerView: 4,
            }
        }
    })
}


// fetch data from TMDB API
async function fetchApiData(endpoint) {
    const API_KEY = global.api.apiKey;
    const BASE_URL = global.api.apiUrl;

    showSpinner();

    const response = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
    const data = await response.json();

    hideSpinner();

    return data;
}

// make request to search
async function searchApiData() {
    const API_KEY = global.api.apiKey;
    const BASE_URL = global.api.apiUrl;

    showSpinner();

    const response = await fetch(`${BASE_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}&include_adult=false}`)
    const data = await response.json();

    hideSpinner();

    return data;
}

function showSpinner() {
    document.querySelector('.spinner').classList.add('show');
}

function hideSpinner() {
    document.querySelector('.spinner').classList.remove('show');
}

// highlight active nav link
function highlightActiveLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === global.currentPage)
        {
            link.classList.add('active');
        }
    });
}

// show alert
function showAlert(message, className = 'error') {
    const alertEl = document.createElement('div');
    alertEl.classList.add('alert', className);
    alertEl.appendChild(document.createTextNode(message));
    document.querySelector('#alert').appendChild(alertEl);

    setTimeout(() => alertEl.remove(), 3000)
}


function addCommasToNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// init app
function init() {
    switch (global.currentPage)
    {
        case '/':
        case '/index.html':
            displaySlider()
            displayPopularMovies()
            break;
        case '/shows.html':
            displayPopularShows()
            break;
        case '/movie-details.html':
            displayMovieDetails()
            break;
        case '/tv-details.html':
            displayShowDetails()
            break;
        case '/search.html':
            search()
            break;

    }
    highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init)