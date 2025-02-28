<template>
    <div class="card" :id="screenplay?.id">
        <div v-if="loading" class="skeleton-loader">
            <div class="skeleton skeleton-image"></div>
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-row"></div>
        </div>

        <template v-else>
            <img :src="`${image + screenplay.backdrop_path}`" :alt="screenplay.title || screenplay.name"
                v-if="screenplay.backdrop_path" @mouseenter="triggerEvent" @mouseleave="endEvent">
            <div class="skeleton skeleton-image" v-else></div>

            <span>{{ screenplay.title || screenplay.name }}</span>
            <div class="card_text">
                <p>{{ (screenplay.overview).slice(0, 150) + '...' }}</p>
                <div class="row">
                    <div class="col-6">{{ $t('message.Rating') }}: {{ screenplay.vote_average.toFixed(2) }}</div>
                    <div class="col-6">{{ $t('message.Genre') }}: {{ getGenre(screenplay.genre_ids[0]) }}</div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import data from '@/data';

export default {
    props: {
        screenplay: { type: Object, required: true }
    },
    data() {
        return {
            image: data.imagePath,
            loading: true
        }
    },
    methods: {
        triggerEvent() {
            this.timeout = setTimeout(() => {
                document.getElementById(this.id).classList.add('overview');
                document.querySelector('body').classList.add('card-overlay-body');
            }, 700);
        },
        endEvent() {
            document.getElementById(this.id).classList.remove('overview');
            document.querySelector('body').classList.remove('card-overlay-body');
            clearTimeout(this.timeout);
        },
        getGenre(genreId) {
            return this.genres.find(genre => genre.id === genreId)?.name || 'None';
        }
    },
    computed: {
        genres() {
            return data.state.allGenres
        },

        id() {
            return this.screenplay?.id;
        }
    },
    mounted() {
        setTimeout(() => {
            this.loading = false;
        }, 300); // Simulate API loading time
    }
}
</script>

<style scoped>
.card {
    transition: 0.5s;
    margin: 1rem;
    padding: 0.2rem;
    background-color: #79baf391;
    color: aliceblue;
    position: relative;
    text-align: center;
    box-shadow: 0px 4px 15px rgb(150, 149, 149);
}

.card img {
    border-radius: 5px;
}

.card:hover {
    scale: 1.1;
    transition: 0.5s;
    box-shadow: 2px 4px 30px rgb(150, 149, 149);
}

.overview:hover {
    scale: 1.3;
    z-index: 4;
    opacity: 1;
    box-shadow: none;
}

.card .card_text {
    position: absolute;
    text-align: justify;
    font-size: 15px;
    top: 100%;
    left: 0;
    border-radius: 5px;
    width: 100%;
    background-color: #304a61;
    padding: 10px;
    display: none;
    margin: auto 0;
}

.overview:hover .card_text {
    display: block;
    box-shadow: 5px 4px 20px rgb(46, 44, 42);
}

/* Skeleton Loader Styles */
.skeleton-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.skeleton {
    background: #ddd;
    border-radius: 4px;
}

.skeleton-image {
    width: 100%;
    height: 150px;
}

.skeleton-title {
    width: 80%;
    height: 20px;
}

.skeleton-text {
    width: 90%;
    height: 15px;
}

.skeleton-row {
    width: 100%;
    height: 15px;
}
</style>
