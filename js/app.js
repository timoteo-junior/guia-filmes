
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
    moviesContainer.innerHTML = '';
    
    if (movies.length === 0) {
         moviesContainer.innerHTML = '<p>Nenhum filme encontrado.</p>';
         return;
    }

    movies.forEach(movie => {
        if (!movie.poster_path) return;

        const movieEl = document.createElement('article');
        movieEl.classList.add('movie-card');

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

const voiceBtn = document.getElementById('voice-btn');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;

    voiceBtn.addEventListener('click', () => {
        recognition.start();
        voiceBtn.textContent = '🔴 Escutando...';
    });

    // Quando reconhece a voz
    recognition.addEventListener('result', (event) => {
        const transcript = event.results[0][0].transcript;
        searchInput.value = transcript; 

        const searchUrl = `${BASE_URL}/search/movie?query=${encodeURIComponent(transcript)}&language=pt-BR`;
        getMovies(searchUrl);
    });

    recognition.addEventListener('end', () => {
        voiceBtn.textContent = '🎤';
    });

    recognition.addEventListener('error', (event) => {
        console.error('Erro no reconhecimento de voz:', event.error);
        alert('Não foi possível reconhecer a voz. Tente novamente.');
    });
} else {

    voiceBtn.style.display = 'none'; 
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registrado com sucesso:', registration.scope);
      })
      .catch(error => {
        console.log('Falha ao registrar o Service Worker:', error);
      });
  });
}