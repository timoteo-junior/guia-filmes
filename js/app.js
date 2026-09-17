
const API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZDU3MTM3MDg1MDk3NzBiZmQ3ZGE4M2ZkMmQwMGVhYSIsIm5iZiI6MTc4OTYxNjA4MS45ODg5OTk4LCJzdWIiOiI2YWFiNWZkMWZmMzRhYjA1MTIwMTdhYzYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.JOZPJMbBeytG2byVKeMnZN_2_NOXWWjkkShRiW2MAYY'; 
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const moviesContainer = document.getElementById('movies-container');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

const fetchOptions = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_TOKEN}`
    }
};

//função p/ buscar os filmes
async function getMovies(url) {
    try {
        const response = await fetch(url, fetchOptions);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        
        const data = await response.json();
        renderMovies(data.results);
        
    } catch (error) {
        console.error('Falha ao buscar filmes:', error);
        moviesContainer.innerHTML = '<p>Erro ao carregar os filmes. Tente novamente mais tarde.</p>';
    }
}
//função de renderizar os filmes (nome, poster)
function renderMovies(movies) {
    moviesContainer.innerHTML = ''; // Limpa o container
    
    if (movies.length === 0) {
         moviesContainer.innerHTML = '<p>Nenhum filme encontrado.</p>';
         return;
    }

    movies.forEach(movie => {
        // Ignora filmes sem pôster para não quebrar o layout
        if (!movie.poster_path) return;

        // Cria o elemento <article>
        const movieEl = document.createElement('article');
        movieEl.classList.add('movie-card');

        // Note o loading="lazy" na imagem! Crucial para o Lighthouse (Performance)
        movieEl.innerHTML = `
            <img 
                src="${IMG_BASE_URL + movie.poster_path}" 
                alt="Pôster do filme ${movie.title}"
                loading="lazy"
            >
            <div class="movie-info">
                <h2>${movie.title}</h2>
                <span class="rating">⭐ ${movie.vote_average.toFixed(1)}</span>
            </div>
        `;

        moviesContainer.appendChild(movieEl);
    });
}

//Inicia o projeto com os filmes que estão em alta
const trendingUrl = `${BASE_URL}/trending/movie/week?language=pt-BR`;
getMovies(trendingUrl);

//busca de filmes :)))
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm) {
        const searchUrl = `${BASE_URL}/search/movie?query=${encodeURIComponent(searchTerm)}&language=pt-BR`;
        getMovies(searchUrl);
    } else {
        getMovies(trendingUrl);
    }
});