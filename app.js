let moviesData = [];

fetch('https://japceibal.github.io/japflix_api/movies-data.json')
    .then(response => response.json())
    .then(data => {
        moviesData = data;
        console.log('Películas cargadas:', moviesData); 
    })
    .catch(error => console.error('Error al cargar los datos:', error));

document.getElementById('searchButton').addEventListener('click', () => {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();

    if (!searchValue) {
        alert('Por favor, ingresa un término de búsqueda.');
        return;
    }

    const filteredMovies = moviesData.filter(movie =>
        movie.title.toLowerCase().includes(searchValue) ||
        movie.genres.some(genre => genre.toLowerCase().includes(searchValue)) ||
        movie.tagline.toLowerCase().includes(searchValue) ||
        movie.overview.toLowerCase().includes(searchValue)
    );

    displayMovies(filteredMovies);
});

function displayMovies(movies) {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = ''; 

    if (movies.length === 0) {
        resultsContainer.innerHTML = '<p>No se encontraron resultados.</p>';
        return;
    }

    movies.forEach(movie => {
        let rating = movie.vote_average;
        
        if (movie.title.toLowerCase() === 'shrek') {
            rating = 5;
        }

        const stars = '★'.repeat(Math.round(rating)) + '☆'.repeat(10 - Math.round(rating));
        const movieCard = document.createElement('div');
        movieCard.classList.add('card', 'mb-3', 'p-3', 'shadow-sm');
        movieCard.innerHTML = `
            <div>
                <h5>${movie.title}</h5>
                <p>${movie.tagline}</p>
                <p class="text-warning">${stars}</p>
            </div>
        `;

        movieCard.addEventListener('click', () => showMovieDetails(movie));
        resultsContainer.appendChild(movieCard);
    });
}

function showMovieDetails(movie) {
    const movieDetails = document.getElementById('movieDetails');
    const movieTitle = document.getElementById('movieTitle');
    const movieOverview = document.getElementById('movieOverview');
    const movieGenres = document.getElementById('movieGenres');
    const movieExtra = document.getElementById('movieExtra');

    movieTitle.textContent = movie.title;
    movieOverview.textContent = movie.overview;

    movieGenres.innerHTML = '';
    movie.genres.forEach(genre => {
        const genreItem = document.createElement('li');
        genreItem.classList.add('list-inline-item', 'badge', 'bg-secondary', 'me-1');
        genreItem.textContent = genre;
        movieGenres.appendChild(genreItem);
    });

    movieExtra.innerHTML = `
        <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="movieExtraButton" data-bs-toggle="dropdown" aria-expanded="false">
                Más información
            </button>
            <ul class="dropdown-menu" aria-labelledby="movieExtraButton">
                <li><strong>Año de lanzamiento:</strong> ${new Date(movie.release_date).getFullYear()}</li>
                <li><strong>Duración:</strong> ${movie.runtime} minutos</li>
                <li><strong>Presupuesto:</strong> $${movie.budget ? movie.budget.toLocaleString() : 'No disponible'}</li>
                <li><strong>Ganancias:</strong> $${movie.revenue ? movie.revenue.toLocaleString() : 'No disponible'}</li>
            </ul>
        </div>
    `;

    movieDetails.classList.remove('d-none');
}

function hideMovieDetails() {
    document.getElementById('movieDetails').classList.add('d-none');
}
