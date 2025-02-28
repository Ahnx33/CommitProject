<template>

    <!-- Sidebar -->
    <div class="sidebar scrollable-bar-hidden">
        <AppLink
            :to="{ name: 'media.show', params: { id: -1, genre: 'all', mediatype: $route.params.mediatype || 'all' } }"
            :key="'allGenres'">{{ $t('message.All_Genres') }}</AppLink>
        <AppLink v-for="genre in genres" :key="genre.name"
            :to="{ name: 'media.show', params: { id: genre.id, genre: genre.name, mediatype: $route.params.mediatype || 'all' } }">
            {{ genre.name }}</AppLink>
    </div>

</template>

<script>
import data from '@/data';

export default {
    computed: {
        genres() {
            return data.state.allGenres
        }
    },
    watch: {
        // Watch for route changes including genre ID
        '$route.params.id': {
            immediate: true,

            async handler(newGenreId) {
                // Check if the current and previous route has an id parameter
                const hasIdParam = (route) => route && route.params && route.params.id !== undefined;

                if (hasIdParam(this.$route) && hasIdParam(this.$route)) {
                    // If both "from" and "to" have an id param, handle accordingly
                    if (newGenreId === -1) {
                        // Handle "All Genres" - reset to trending
                        await this.reload_language();
                    } else {
                        // Fetch movies/TV shows for the selected genre
                        await this.fetchGenreMedia(newGenreId);
                    }
                } else {
                    console.log("Either current or previous route does not have an ID parameter.");
                }
            }
        }
    },

    methods: {
        async fetchGenreMedia(genreId) {
            let mediaType = this.$route.params.mediatype || 'all';
            const queryParams = {
                with_genres: genreId,
                language: data.getLangUrl()
            };

            // Reset existing data
            data.state.filmsCatalog = [];
            data.state.tvSeriesCatalog = [];

            if (
                !data.state.filmGenresList.some(genre => genre.id == genreId) ||
                !data.state.tvGenresList.some(genre => genre.id == genreId)
            ) {
                console.log('hey!');

                mediaType = 'all';
            }

            if (mediaType === 'film' || mediaType === 'all') {
                const films = await data.fetchData(
                    `${data.baseURL}/discover/movie`,
                    queryParams
                );
                if (films?.results) {
                    data.state.filmsCatalog = films.results;
                    data.state.LoadedFilms = 1
                }
            }

            if (mediaType === 'tv' || mediaType === 'all') {
                const tvShows = await data.fetchData(
                    `${data.baseURL}/discover/tv`,
                    queryParams
                );
                if (tvShows?.results) {
                    data.state.tvSeriesCatalog = tvShows.results;
                    data.state.LoadedTvs = 1
                }
            }
        }
    }
}
</script>

<style>
.sidebar {
    height: 100vh;
    width: 250px;
    position: fixed;
    left: 0;
    background-color: #333333c9;
    padding: 20px 0;

    a {
        display: block;
        color: white;
        padding: 15px;
        border-right: 3px solid rgba(71, 69, 69, 0.507);
        text-decoration: none;
        opacity: 0.5;
    }

    a:hover {
        background-color: #575757;
        opacity: 0.7;
    }

    .custom-router-link-active {
        border-right: 2px solid white;
        opacity: 1;
    }

}

/* Page content */
.content {
    margin-left: 250px;
    position: relative;
}

@media only screen and (max-width: 768px) {
    .sidebar {
        display: none;
    }

    .content {
        margin: 0;
    }
}
</style>