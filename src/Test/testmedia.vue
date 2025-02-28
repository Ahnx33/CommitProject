<template>
    <div style="margin: 45px; position: relative;">

        <!-- Search and Filter Dropdown in the same row -->
        <div class="search-filter-container d-flex justify-content-between align-items-center mt-4">
            <!-- Search Bar on the Left -->
            <div class="search-container">
                <input type="text" v-model="searchQuery" class="search-input"
                    :placeholder="$t('message.Catalog_Searchbar')" />
            </div>
        </div>

        <!-- Cards Section -->
        <div class="cards row mt-4 p-4">
            <div class="col-12 col-sm-6 col-lg-4" v-for="screenplay in screenplays" :key="screenplay.id">
                <AppLink :to="{ name: 'screenplay.show', params: { screenPlayId: screenplay.id } }">
                    <ScreenplayCard :screenplay="screenplay"></ScreenplayCard>
                </AppLink>
            </div>
        </div>

        <div id="loading" v-if="loading">
            <SyncLoader></SyncLoader>
        </div>
        <div id="loadMoreTrigger" v-if="totalPages > currentPage" @click="loadMoreResults"></div>
    </div>
</template>

<script>
import LeftSideBar from '@/components/LeftSideBar.vue';
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
        LeftSideBar,
        SyncLoader
    },
    data() {
        return {
            searchQuery: '',
            loading: false,
            searchResults: [],
            totalPages: 0,
            currentPage: 1
        };
    },
    watch: {
        searchQuery: async function (newQuery) {
            if (newQuery.length > 2) { // Avoid excessive API calls
                this.currentPage = 1;
                await this.fetchSearchResults();
            } else {
                this.searchResults = [];
            }
        }
    },
    computed: {
        screenplays() {
            return this.searchQuery.length > 2 ? this.searchResults : data.getListOfType(this.mediatype);
        }
    },
    methods: {
        async fetchSearchResults() {
            this.loading = true;
            let results = [];
            if (this.mediatype === 'film' || this.mediatype === 'all') {
                const filmPages = await data.gethSearchPages(data.filmSearchCatalog, this.searchQuery);
                this.totalPages = Math.max(this.totalPages, filmPages);
                results.push(...await data.getSearchResults(data.filmSearchCatalog, this.searchQuery, this.currentPage));
            }
            if (this.mediatype === 'tv' || this.mediatype === 'all') {
                const tvPages = await data.gethSearchPages(data.tvSearchCatalog, this.searchQuery);
                this.totalPages = Math.max(this.totalPages, tvPages);
                results.push(...await data.getSearchResults(data.tvSearchCatalog, this.searchQuery, this.currentPage));
            }
            this.searchResults = results;
            this.loading = false;
        },
        async loadMoreResults() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                let newResults = [];
                if (this.mediatype === 'film' || this.mediatype === 'all') {
                    newResults.push(...await data.getSearchResults(data.filmSearchCatalog, this.searchQuery, this.currentPage));
                }
                if (this.mediatype === 'tv' || this.mediatype === 'all') {
                    newResults.push(...await data.getSearchResults(data.tvSearchCatalog, this.searchQuery, this.currentPage));
                }
                this.searchResults.push(...newResults);
            }
        }
    },
    mounted() {
        this.setupObserver();
    },
    beforeDestroy() {
        this.cleanupObserver();
    }
};
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
    flex: 1;
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

.loading {
    opacity: 0;
    text-align: center;
    font-size: 18px;
    color: #555;
    margin-top: 20px;
}
</style>
