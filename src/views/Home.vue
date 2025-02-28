<template>
    <!-- mettere caroucel al posto di immagini e mettere alt -->
    <div class="home navigation-font">
        <FirstEnter></FirstEnter>
        <div id="trending" class="row container-fluid">
            <div class="col-5">
                <TrendingCard :to-display="films"></TrendingCard>
            </div>
            <div class="col-2">
                <h2>{{ $t('message.Trending') }}</h2>
            </div>
            <div class="col-5">
                <TrendingCard :to-display="tvs"></TrendingCard>
            </div>
        </div>
        <div id="genres-show" class="container">
            <h1 class="text-center" id="genres-show-header">{{ $t('message.Genre', 2) }}</h1>
            <div v-for="genre in genres">
                <!-- Component swiper che riceve l'array(da usare anche per i trending) -->
                <div v-if="genreToDisplay(genre.id).length > 4" class="my-5">
                    <h2>{{ genre.name }}</h2>
                    <SwiperHome :genre="genreToDisplay(genre.id)" :genre-id="genre.id"
                        :slides-to-load="genreToDisplay(genre.id).length / 2" class="home-genres-swiper">
                    </SwiperHome>
                </div>
            </div>
        </div>
    </div>
</template>



<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import data from '@/data';
import SwiperHome from '@/components/SwiperHome.vue';
import TrendingCard from '@/components/TrendingCard.vue';
import FirstEnter from '@/components/FirstEnter.vue';

// Reactive State
const films = ref(data.state.initialScreenplays[0] || []);
const tvs = ref(data.state.initialScreenplays[1] || []);
const genres = computed(() => data.state.allGenres);
const all = ref([...data.state.initialScreenplays[0], ...data.state.initialScreenplays[1]] || []);

// Function to filter genres
const genreToDisplay = (id) => {
    return all.value.filter(screenplay => screenplay.genre_ids?.slice(0, 2).includes(id));
};

// Navbar Scroll Effect
const handleScroll = () => {
    let navbar = document.querySelector(".navbar");
    if (document.documentElement.scrollTop > 0) {
        navbar.classList.remove('navbar-home');
        navbar.classList.add('navbar-home-active');
    } else {
        navbar.classList.add('navbar-home');
        navbar.classList.remove('navbar-home-active');
    }
};

// Lifecycle Hooks
onMounted(() => {
    nextTick(() => {
        let navbar = document.querySelector(".navbar");
        navbar?.classList.add('fixed-top');
        navbar?.classList.remove('sticky-top');
        navbar?.classList.add('navbar-home');
        window.addEventListener('scroll', handleScroll);
    });
});

onBeforeUnmount(() => {
    let navbar = document.querySelector(".navbar");
    navbar?.classList.remove('fixed-top', 'navbar-home', 'navbar-home-active');
    navbar?.classList.add('sticky-top');
    window.removeEventListener('scroll', handleScroll);
});
</script>



<style scoped>
.home {
    --image-width: 100%;
    --image-heigth: calc(100vw / 1.778);

    h2 {
        text-shadow: 2px 0 #fff, -2px 0 #fff, 0 2px #fff, 0 -2px #fff,
            2px 2px #fff, -2px -2px #fff, 2px -2px #fff, -2px 2px #fff;
    }
}

#first-enter {
    width: var(--image-width);
    height: var(--image-heigth);
}

#trending {
    padding: 2rem;
    position: relative;
}

#trending img {
    width: 90%;
    margin: 2vh auto;
}

#genres-show {
    text-align: left;
    padding: 20px;
    background-color: rgba(70, 70, 70, 0.6);
    border-radius: 50px;
    border: 5px solid rgb(158, 157, 157);
}

#genres-show-header {
    color: #fff;
    text-shadow: 3px 0 #1E88E5, -3px 0 #1E88E5, 0 3px #1E88E5, 0 -3px #1E88E5,
        3px 3px #1E88E5, -3px -3px #1E88E5, 3px -3px #1E88E5, -3px 3px #1E88E5;
}

.home img.backdrop {
    height: 400px;
    width: 400*1.8px;
}

.home img.poster {
    width: 400px;
    height: 400*1.5px;
}
</style>