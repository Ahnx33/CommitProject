import { reactive, computed } from 'vue';
import i18n from '@/assets/i18n/i18n.js';

const getLangUrl = () => {
    const currentLang = i18n.global.locale;
    return i18n.global.messages[currentLang]?.langUrl || 'en-US';
};

const baseURL = 'https://api.themoviedb.org/3';
const API_Key = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNDVlNjUyODg1NmNjMGJjYzJkODY5NTBhNTQ4ZDllZSIsIm5iZiI6MTczOTQ1MjI5Ni43OTEwMDAxLCJzdWIiOiI2N2FkZWY4OGE1OGNlYWQzOGQ5ZjUwYjciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.5CntQrKFcQdtkrjf7F_FQ5X5_E3lavQW5x6amqjAuoY';
const imagePath = 'https://image.tmdb.org/t/p/original';
const filmSearchCatalog = baseURL + '/search/movie';
const tvSearchCatalog = baseURL + '/search/tv';

const state = reactive({
    filmsCatalog: [],
    tvSeriesCatalog: [],
    filmGenresList: [],
    tvGenresList: [],
    searchReults: [],
    allGenres: computed(() => {
        const allGenresObj = {};
        [...state.filmGenresList, ...state.tvGenresList].forEach(genre => {
            allGenresObj[genre.id] = { id: genre.id, name: genre.name };
        });
        return Object.values(allGenresObj).sort((a, b) => a.name.localeCompare(b.name));
    }),
    LoadedFilms: 1,
    LoadedTvs: 1,
    initialScreenplays: []
});

const fetchData = async (url, queryParams = {}) => {
    try {
        const queryString = new URLSearchParams(queryParams).toString();
        const fullUrl = `${url}?${queryString}`;
        const response = await fetch(fullUrl, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${API_Key}`
            }
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
};

const preLoadPages = async (url, pages = 1) => {
    let results = [];
    for (let i = 1; i <= pages; i++) {
        const data = await fetchData(url, {
            page: i,
            language: getLangUrl()
        });
        if (data?.results) {
            results.push(...data.results);
        }
    }
    return results;
};

const fetchMoreData = async (url, page, array) => {
    const newScreenplays = (await fetchData(url, {
        page,
        language: getLangUrl()
    }))?.results || [];

    // Deduplication logic
    const existingIds = new Set(array.map(item => item.id));
    const unique = newScreenplays.filter(item => !existingIds.has(item.id));
    array.push(...unique);
};

let initialized = false

const init = async () => {
    if (!initialized) {
        initialized = true
        state.filmsCatalog = await preLoadPages(`${baseURL}/trending/movie/week`, state.LoadedFilms);
        state.tvSeriesCatalog = await preLoadPages(`${baseURL}/trending/tv/week`, state.LoadedTvs);
        state.filmGenresList = (await fetchData(`${baseURL}/genre/movie/list`, {
            language: getLangUrl()
        }))?.genres || [];
        state.tvGenresList = (await fetchData(`${baseURL}/genre/tv/list`, {
            language: getLangUrl()
        }))?.genres || [];
        state.initialScreenplays = [state.filmsCatalog, state.tvSeriesCatalog]
        console.log('Initial');
        console.log(state.initialScreenplays);
        console.log('Genres');
        console.log(state.filmGenresList, state.tvGenresList);
    }
};

const getListOfType = (type) => {
    if (type === 'film') return state.filmsCatalog;
    if (type === 'tv') return state.tvSeriesCatalog;
    console.log([...state.filmsCatalog, ...state.tvSeriesCatalog]);

    return [...state.filmsCatalog, ...state.tvSeriesCatalog];
};

const setLoaded = async (typeName) => {

    if (typeName === 'all') {
        await Promise.all([
            fetchMoreData(`${baseURL}/trending/movie/week`, state.LoadedFilms, state.filmsCatalog),
            fetchMoreData(`${baseURL}/trending/tv/week`, state.LoadedTvs, state.tvSeriesCatalog)
        ]);
        state.LoadedFilms++;
        state.LoadedTvs++;
    }
    if (typeName === 'film') {
        fetchMoreData(`${baseURL}/trending/movie/week`, state.LoadedFilms, state.filmsCatalog);
        state.LoadedFilms++;
        console.log('pages: ' + state.LoadedFilms);
        console.log('hello');

        return;
    }
    if (typeName === 'tv') {
        fetchMoreData(`${baseURL}/trending/tv/week`, state.LoadedTvs, state.tvSeriesCatalog);
        state.LoadedTvs++;
    }
};

const getLoaded = (type) => {
    if (type === 'film') return [state.LoadedFilms];
    if (type === 'tv') return [state.LoadedTvs];
    return [state.LoadedTvs, state.LoadedFilms];
};

const reload_language = async () => {
    state.filmsCatalog = await preLoadPages(`${baseURL}/trending/movie/week`, state.LoadedFilms);
    state.tvSeriesCatalog = await preLoadPages(`${baseURL}/trending/tv/week`, state.LoadedTvs);
    state.filmGenresList = (await fetchData(`${baseURL}/genre/movie/list`, {
        language: getLangUrl()
    }))?.genres || [];
    state.tvGenresList = (await fetchData(`${baseURL}/genre/tv/list`, {
        language: getLangUrl()
    }))?.genres || [];
};

const gethSearchPages = async (url, key, page = '1') => {
    const data = await fetchData(url, {
        query: key,
        page: page,
        language: getLangUrl()
    });
    return data?.total_pages || 0;
};

const getSearchResults = async (url, key, page = '1') => {
    const data = await fetchData(url, {
        query: key,
        page: page,
        language: getLangUrl()
    });

    if (data?.results) {
        // Deduplicate results
        const newResults = data.results.filter(result =>
            !state.searchReults.some(existing => existing.id === result.id)
        );

        state.searchReults.push(...newResults);
    }
    return data?.results || [];
};

const hasReachedMaxPages = (type) => {
    const MAX_PAGES = 500;
    if (type === 'film') return state.LoadedFilms >= MAX_PAGES;
    if (type === 'tv') return state.LoadedTvs >= MAX_PAGES;
    return state.LoadedFilms >= MAX_PAGES && state.LoadedTvs >= MAX_PAGES;
};

export default {
    baseURL,
    getLangUrl,
    state,
    imagePath,
    filmSearchCatalog,
    tvSearchCatalog,
    fetchData,
    getListOfType,
    setLoaded,
    getLoaded,
    reload_language,
    gethSearchPages,
    getSearchResults,
    hasReachedMaxPages,
    init
};