<template>
    <section v-if="!loading" class="screenplayShow"
        :style="{ '--bg-image': `url(${image + screenplay?.backdrop_path})` }">
        <GoBack></GoBack>
        <h1 class="mt-2">{{ screenplay?.original_title || screenplay?.original_name }} ({{ mediatype.toUpperCase() }})
        </h1>
        <div class="row m-4" style="margin-bottom: 200px;">
            <div class="col-4">
                <img v-if="screenplay?.poster_path" :src="image + screenplay.poster_path"
                    :alt="screenplay?.title || screenplay?.name" class="mx-auto">
            </div>
            <div class="col-8" id="content">
                <h2 class="text">{{ screenplay?.title || screenplay?.name }}
                    ({{ $t('message.Language') }}: {{ screenplay?.original_language?.toUpperCase() }}, {{
                        screenplay?.release_date || screenplay.first_air_date }})
                </h2>

                <h5 id="popularity" class="text">
                    <span>- {{ $t('message.Popularity') }}: {{ screenplay?.popularity }}</span>
                </h5>

                <h5 class="text">{{ $t('message.Genre', screenplay?.genres?.length) }}:
                    <span v-for="genre in screenplay?.genres" :key="genre.id">
                        - {{ genre.name }}
                    </span>
                </h5>

                <p class="text scrollable-bar-hidden">{{ screenplay?.overview }}</p>

                <div v-if="screenplay?.vote_average">
                    <span style="font-size: 20px; margin-right: 20px;">{{ $t('message.Rating') + ': ' +
                        screenplay.vote_average.toFixed(2)
                        }}</span>
                    <StarRating :rating="screenplay.vote_average / 2" style="display: inline;" />
                </div>

                <div id="play">
                    <AppLink :to="screenplay?.homepage">
                        <img src="../../public/images/streaming.png" alt="play">
                    </AppLink>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
            <SyncLoader />
        </div>

        <!-- Error State -->
        <div v-if="error" class="alert alert-danger m-4">
            {{ $t('message.Error_Loading') }}: {{ error }}
        </div>

        <!-- Review Component -->
        <Review v-if="screenplay && !loading" :screenPlayId="screenPlayId"
            :mediatype="mediatype === 'movie' ? 'movie' : 'tv'" />
    </section>
</template>

<script>
import GoBack from '@/components/GoBack.vue';
import StarRating from '@/components/StarRating.vue';
import data from '@/data';
import SyncLoader from '@/components/SyncLoader.vue';
import Review from '@/components/Review.vue';

export default {
    components: {
        GoBack,
        StarRating,
        SyncLoader,
        Review
    },
    props: {
        screenPlayId: { type: Number, required: true },
        mediatype: { type: String, required: true }
    },
    data() {
        return {
            image: data.imagePath,
            genres: data.state.allGenres,
            screenplay: null,
            loading: false,
            error: null
        }
    },
    created() {
        this.fetchScreenplay();
    },
    methods: {
        async fetchScreenplay() {
            this.loading = true;
            this.error = null;

            try {
                const endpoint = this.mediatype === 'movie' ? 'movie' : 'tv';
                const response = await fetch(
                    `${data.baseURL}/${endpoint}/${this.screenPlayId}?` +
                    `api_key=d45e6528856cc0bcc2d86950a548d9ee&` +
                    `language=${data.getLangUrl()}`
                );

                if (!response.ok) throw new Error('Failed to fetch');

                const result = await response.json();

                // Normalize data structure
                this.screenplay = {
                    ...result,
                };

            } catch (error) {
                this.error = error.message;
                console.error('Fetch error:', error);
            } finally {
                this.loading = false;
            }
        }
    },
    beforeRouteLeave(to, from) {
        to.hash = from.hash
    }
}
</script>

<style scoped>
.screenplayShow {
    padding: 8vh;
    min-height: 100vh;
    color: aliceblue;
}

.screenplayShow::before {
    content: "";
    position: fixed;
    top: 0%;
    left: 0%;
    width: 100%;
    height: 100%;
    background-image: var(--bg-image);
    background-size: cover;
    background-position: center;
    opacity: 0.4;
    z-index: -1;
}

.col-4 img {
    width: 305px;
    box-shadow: -5px 0 20px rgb(255, 255, 255);
    border: 2px solid white;
    border-radius: 2rem;
    box-sizing: border-box;
    margin-bottom: 2vh;
}

.row #content {
    margin: auto;
    text-align: justify;
    padding: 0 5vh;
    position: relative;
}

.row #content .text {
    margin: 25px auto;
    max-height: 20vh;
}

#play {
    width: 55px;
    height: 55px;
    position: absolute;
    right: 20px;
    bottom: -5px;
    background-color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    transition: 0.4s;
    box-shadow: 0 0 10px white;

    img {
        width: 55px;
        height: 55px;
    }
}

#play:hover {
    scale: 1.1;
    background-color: rgb(124, 235, 198);
}
</style>