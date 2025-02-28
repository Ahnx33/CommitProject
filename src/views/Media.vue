<template>
    <div style="margin: 45px; position: relative;">

        <!-- Search and Filter Dropdown in the same row -->
        <div class="search-filter-container d-flex justify-content-between align-items-center mt-4">
            <!-- Search Bar on the Left -->
            <div class="search-container">
                <input type="text" v-model="searchQuery" class="search-input"
                    :placeholder="$t('message.Catalog_Searchbar')" />
            </div>

            <!-- Filter -->
            <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="filterDropdown"
                    data-bs-toggle="dropdown" aria-expanded="false">
                    {{ $t('message.Filter') }}
                </button>
                <ul class="dropdown-menu" aria-labelledby="filterDropdown">
                    <li v-for="option in filterOptions" :key="option.mediatype">
                        <AppLink class="dropdown-item" :to="option.route">
                            {{ $t(option.label) }}
                        </AppLink>
                    </li>
                </ul>
            </div>
            <!-- Sort -->

            <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="sortDropdown"
                    data-bs-toggle="dropdown" aria-expanded="false">
                    {{ $t('message.Sort') }}
                </button>
                <ul class="dropdown-menu" aria-labelledby="sortDropdown">
                    <li v-for="sort in sortOptions" :key="sort.value">
                        <a @click.prevent="updateSort(sort.value)" class="dropdown-item"
                            :class="{ 'active': selectedSort === sort.value }">
                            {{ $t(sort.label) }}
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        <!-- Cards Section -->
        <div class="cards row mt-4 p-4">
            <div class="col-12 col-md-6 col-lg-4 col-xl-3" v-for="screenplay in filteredScreenplays"
                :key="screenplay.id">
                <AppLink
                    :to="{ name: 'screenplay.show', params: { screenPlayId: screenplay.id, mediatype: screenplay?.title ? 'movie' : 'tv' }, hash: searchQuery.length > 2 ? `#${searchQuery}` : '' }">
                    <ScreenplayCard :screenplay="screenplay"></ScreenplayCard>
                </AppLink>
            </div>
        </div>

        <div id="loading" v-if="loading">
            <SyncLoader></SyncLoader>
        </div>
        <div v-if="!loading && filteredScreenplays.length === 0" class="no-results">
            {{ $t('message.No_Results') }}
        </div>
        <div id="loadMoreTrigger"></div>
    </div>
</template>

<script>
import ScreenplayCard from '@/components/ScreenplayCard.vue';
import SyncLoader from '@/components/SyncLoader.vue';
import data from '@/data';

export default {
    props: {
        id: { type: Number, required: true },
        mediatype: { type: String, required: true },
    },
    components: {
        ScreenplayCard,
        SyncLoader
    },
    data() {
        return {
            image: data.imagePath,
            observer: null,
            searchQuery: '',
            loading: true,
            totalFilmPages: 0,
            totalTvPages: 0,
            currentFilmPage: 1,
            currentTvPage: 1,
            isFetching: false,
            filterOptions: [
                { mediatype: 'all', label: 'message.All_Genres', route: this.getRoute('all') },
                { mediatype: 'film', label: 'message.Films', route: this.getRoute('film') },
                { mediatype: 'tv', label: 'message.TV_Series', route: this.getRoute('tv') }
            ],
            sortOptions: [
                { value: 'popularity.desc', label: 'message.Sort_Popularity' },
                { value: 'release_date.desc', label: 'message.Sort_ReleaseDate' },
                { value: 'vote_average.desc', label: 'message.Sort_Rating' }
            ],
            selectedSort: 'popularity.desc',
            minVotesRequired: 100,
            averageRating: 6.0
        }
    },
    watch: {
        searchQuery: async function (newQuery, oldQuery) {
            if (newQuery.length > 2) {
                // Reset pagination and clear previous results when search query changes
                this.currentFilmPage = 1;
                this.currentTvPage = 1;

                // Clear previous search results
                data.state.searchReults = [];

                // Fetch new search results
                this.loading = true;
                await this.fetchSearchResults();
                this.loading = false;
            } else if (oldQuery.length > 2 && newQuery.length <= 2) {
                // Clear search results when query is deleted/shortened
                data.state.searchReults = [];

                // Reset the observer for infinite scroll
                this.cleanupObserver();
                this.setupObserver();
            }
        },
        mediatype() {
            this.cleanupObserver();
            this.setupObserver();
        }
    },
    methods: {
        getRoute(mediatype) {
            return { name: 'media.show', params: { id: this.$route.params.id, genre: this.$route.params.genre, mediatype } };
        },

        debounce(func, delay) {
            let timer;
            return function (...args) {
                clearTimeout(timer);
                timer = setTimeout(() => func.apply(this, args), delay);
            };
        },

        setupObserver() {
            if (data.hasReachedMaxPages(this.mediatype)) {
                this.loading = false;
                return;
            }

            const loadMoreTrigger = document.getElementById('loadMoreTrigger');
            if (!loadMoreTrigger) return;

            this.observer = new IntersectionObserver(
                this.debounce(async (entries) => {
                    if (entries[0].isIntersecting && !this.isFetching) {
                        this.isFetching = true;
                        try {
                            if (this.searchQuery.length > 2) {
                                await this.loadMoreResults();
                            } else {
                                await data.setLoaded(this.mediatype);
                            }
                        } finally {
                            this.isFetching = false;
                        }
                    }
                }, 300), // Debounce delay of 300ms
                { threshold: 0. }
            );

            this.observer.observe(loadMoreTrigger);
        },
        cleanupObserver() {
            if (this.observer) {
                this.observer.disconnect();
            }
        },
        async fetchSearchResults() {
            try {
                // Get total pages first
                if (this.mediatype === 'film' || this.mediatype === 'all') {
                    this.totalFilmPages = await data.gethSearchPages(data.filmSearchCatalog, this.searchQuery);
                }
                if (this.mediatype === 'tv' || this.mediatype === 'all') {
                    this.totalTvPages = await data.gethSearchPages(data.tvSearchCatalog, this.searchQuery);
                }

                // Then get the first page results
                if (this.mediatype === 'film' || this.mediatype === 'all') {
                    await data.getSearchResults(data.filmSearchCatalog, this.searchQuery, 1);
                }
                if (this.mediatype === 'tv' || this.mediatype === 'all') {
                    await data.getSearchResults(data.tvSearchCatalog, this.searchQuery, 1);
                }
            } catch (error) {
                console.error("Error fetching search results:", error);
            }
        },
        async loadMoreResults() {
            this.loading = true;
            try {
                const promises = [];

                if ((this.mediatype === 'film' || this.mediatype === 'all') && this.currentFilmPage < this.totalFilmPages) {
                    this.currentFilmPage++;
                    promises.push(data.getSearchResults(data.filmSearchCatalog, this.searchQuery, this.currentFilmPage));
                }

                if ((this.mediatype === 'tv' || this.mediatype === 'all') && this.currentTvPage < this.totalTvPages) {
                    this.currentTvPage++;
                    promises.push(data.getSearchResults(data.tvSearchCatalog, this.searchQuery, this.currentTvPage));
                }

                if (promises.length > 0) {
                    await Promise.all(promises);
                }
            } catch (error) {
                console.error("Error loading more results:", error);
            } finally {
                this.loading = false;
            }
        },
        updateSort(sortValue) {
            this.selectedSort = sortValue;
        },
        weightedRating(votes, rating, globalAverage = this.averageRating, min = this.minVotesRequired) {
            return (votes * rating + min * globalAverage) / (votes + min);
        }
    },
    computed: {
        screenplays() {
            return this.searchQuery.length > 2 ? data.state.searchReults : data.getListOfType(this.mediatype);
        },
        genre_list() {
            if (this.id === -1) return this.screenplays;
            return this.screenplays.filter(screenplay =>
                screenplay.genre_ids && screenplay.genre_ids.includes(this.id)
            );
        },
        filteredScreenplays() {
            let screenplays = this.genre_list;

            // If not using API search, filter by the search query locally
            if (this.searchQuery.length <= 2) {
                screenplays = screenplays.filter(screenplay => {
                    const title = screenplay.title || screenplay.name || '';
                    return title.toLowerCase().includes(this.searchQuery.toLowerCase());
                });
            }

            // Apply sorting
            switch (this.selectedSort) {
                case 'popularity.desc':
                    return [...screenplays].sort((a, b) => b.popularity - a.popularity);

                case 'release_date.desc':
                    return [...screenplays].sort((a, b) => {
                        const dateA = a.release_date || a.first_air_date || '';
                        const dateB = b.release_date || b.first_air_date || '';
                        return dateA && dateB ? new Date(dateB) - new Date(dateA) : 0;
                    });

                case 'vote_average.desc':
                    return [...screenplays].sort((a, b) =>
                        this.weightedRating(b.vote_count || 0, b.vote_average || 0) -
                        this.weightedRating(a.vote_count || 0, a.vote_average || 0)
                    );

                default:
                    return screenplays;
            }
        },
        genres() {
            return data.state.allGenres;
        },
    },
    mounted() {
        this.setupObserver();
        if (this.$route.hash) {
            this.searchQuery = this.$route.hash.slice(1)
        }
    },
    beforeDestroy() {
        this.cleanupObserver();
    }
}
</script>

<style scoped>
/* Align search and filter dropdown in the same row */
.search-filter-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
}

/* Ensure search bar takes up available space */
.search-container {
    flex: auto;
}

/* Search Input Styling */
.search-input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #14aa78;
    border-radius: 5px;
}

.search-input::placeholder {
    color: #646b69;
}

/* Adjust Dropdown Button */
.dropdown .btn {
    background-color: #14aa78;
    color: white;
    width: 100px;
    transition: 0.3s;
}

.dropdown .btn:hover {
    scale: 1.1;
}

.dropdown-menu {
    min-width: 180px;

    .dropdown-item {
        color: black;
    }

    .custom-router-link-active {
        background-color: #14aa78;
        color: aliceblue;
    }
}

.dropdown-item.active {
    background-color: #14aa78;
    color: white !important;
}

/* Style Dropdown Links */

.dropdown-toggle::after {
    border: none;
}

.loading {
    opacity: 0;
    text-align: center;
    font-size: 18px;
    color: #555;
    margin-top: 20px;
}

.no-results {
    text-align: center;
    margin: 40px 0;
    font-size: 18px;
}
</style>