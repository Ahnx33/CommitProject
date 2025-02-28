<template>
    <div class="card" :id="id">
        <div class="image-container">
            <img v-if="screenplay.backdrop_path" :src="`${imagePath + screenplay.backdrop_path}`"
                :alt="screenplay.title || screenplay.name" @load="onImageLoaded" @error="onImageError"
                @mouseenter="triggerEvent" @mouseleave="endEvent" v-show="imageLoaded" />
            <div class="skeleton skeleton-image" v-if="!imageLoaded && screenplay.backdrop_path"></div>
            <div class="skeleton skeleton-image" v-if="!screenplay.backdrop_path"></div>
        </div>

        <span>{{ screenplay.title || screenplay.name }}</span>
        <div class="card_text">
            <p>{{ screenplay.overview ? (screenplay.overview.slice(0, 150) + '...') : $t('message.No_Overview') }}</p>
            <div class="row">
                <div class="col-6">{{ $t('message.Rating') }}: {{ screenplay.vote_average ?
                    screenplay.vote_average.toFixed(2) : 'N/A' }}</div>
                <div class="col-6">{{ $t('message.Genre') }}: {{ getGenre(screenplay.genre_ids &&
                    screenplay.genre_ids[0]) }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent, ref, computed, onBeforeUnmount } from 'vue';
import data from '@/data';
import { useI18n } from 'vue-i18n';

export default defineComponent({
    props: {
        screenplayId: {
            type: [Number, String],
            required: true
        },
        mediaType: {
            type: String,
            default: 'film',
            validator: (value) => ['film', 'tv', 'all'].includes(value)
        }
    },
    async setup(props) {
        const { t } = useI18n();

        const screenplay = ref(null);
        const imagePath = data.imagePath;
        const imageLoaded = ref(false);
        const timeout = ref(null);
        const error = ref(null);
        const id = computed(() => props.screenplayId);

        try {
            // Determine the endpoint based on media type
            const endpoint = props.mediaType === 'tv'
                ? `${data.baseURL}/tv/${props.screenplayId}`
                : `${data.baseURL}/movie/${props.screenplayId}`;

            // Fetch detailed information for the screenplay
            const detailsResponse = await data.fetchData(endpoint, {
                language: data.getLangUrl()
            });

            if (detailsResponse) {
                screenplay.value = detailsResponse;
            } else {
                // If we couldn't fetch details, look in the existing catalogs
                const catalogs = props.mediaType === 'tv'
                    ? data.state.tvSeriesCatalog
                    : props.mediaType === 'film'
                        ? data.state.filmsCatalog
                        : [...data.state.filmsCatalog, ...data.state.tvSeriesCatalog];

                const existingItem = catalogs.find(item => item.id == props.screenplayId);
                if (existingItem) {
                    screenplay.value = existingItem;
                } else {
                    throw new Error('Screenplay not found');
                }
            }
        } catch (err) {
            error.value = err.message || 'Failed to fetch screenplay data';
            console.error('API Error:', err);

            // Create minimal screenplay object with ID to avoid template errors
            screenplay.value = {
                id: props.screenplayId,
                title: t('message.Error_Loading'),
                overview: error.value
            };
        }

        const onImageLoaded = () => {
            imageLoaded.value = true;
        };

        const onImageError = () => {
            imageLoaded.value = false;
        };

        const triggerEvent = () => {
            timeout.value = setTimeout(() => {
                const element = document.getElementById(props.screenplayId);
                if (element) {
                    element.classList.add('overview');
                    document.querySelector('body')?.classList.add('card-overlay-body');
                }
            }, 700);
        };

        const endEvent = () => {
            const element = document.getElementById(props.screenplayId);
            if (element) {
                element.classList.remove('overview');
                document.querySelector('body')?.classList.remove('card-overlay-body');
            }
            clearTimeout(timeout.value);
        };

        const getGenre = (genreId) => {
            if (!genreId) return 'None';
            return data.state.allGenres.find(genre => genre.id === genreId)?.name || 'None';
        };

        onBeforeUnmount(() => {
            if (timeout.value) {
                clearTimeout(timeout.value);
            }
        });

        // Need to wait a bit to simulate async loading for Suspense to work
        await new Promise(resolve => setTimeout(resolve, 100));

        return {
            screenplay: computed(() => screenplay.value),
            imagePath,
            imageLoaded,
            triggerEvent,
            endEvent,
            getGenre,
            id,
            error: computed(() => error.value),
            onImageLoaded,
            onImageError
        };
    }
});
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

.image-container {
    position: relative;
    width: 100%;
    min-height: 150px;
}

.card img {
    border-radius: 5px;
    width: 100%;
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
</style>