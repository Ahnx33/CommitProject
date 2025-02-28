<template>
    <!-- Change into fixed-top for the trasparent home (and change body padding) -->
    <nav class="navbar navbar-expand-lg sticky-top navigation-font">
        <div class="container-fluid">
            <AppLink class="navbar-brand" :to="{ name: 'Home' }">
                <img src="../../public/images/logo-96.png" alt="logo" width="60">
                StreamHive
            </AppLink>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
                aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavDropdown">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <AppLink class="nav-link" :to="{ name: 'Home' }">{{ $t('message.Home') }}</AppLink>
                    </li>
                    <li class="nav-item dropdown" v-if="$route.path == '/'">
                        <div class="btn-group">
                            <AppLink :to="{ name: 'media.show', params: { id: -1, genre: 'all', mediatype: 'all' } }"
                                :key="'allGenres'" class="nav-link">{{ $t('message.All_Genres') }}</AppLink>
                            <button type="button" class="btn dropdown-toggle dropdown-toggle-split"
                                data-bs-toggle="dropdown" aria-expanded="false">
                            </button>
                            <DropList :list="AllGenres"></DropList>
                        </div>


                    </li>
                    <li class="nav-item">
                        <AppLink :to="{ name: 'media.show', params: { id: -1, genre: 'all', mediatype: 'film' } }"
                            class="nav-link" key="films">{{ $t('message.Films') }}</AppLink>
                    </li>
                    <li class="nav-item">
                        <AppLink :to="{ name: 'media.show', params: { id: -1, genre: 'all', mediatype: 'tv' } }"
                            class="nav-link" key="tv">{{ $t('message.TV_Series') }}</AppLink>
                    </li>
                </ul>
            </div>
        </div>
        <LangSwitch></LangSwitch>
    </nav>
</template>

<script setup>


</script>

<script>
import data from '@/data';
import DropList from './DropList.vue';
import LangSwitch from './LangSwitch.vue';

export default {
    components: {
        DropList,
        LangSwitch
    },
    computed: {
        AllGenres() {
            return data.state.allGenres
        }
    }

}
</script>

<style lang="css">
.navbar {
    background-color: rgba(255, 255, 255, 0.6);
    transition: 0.4s;
    z-index: 2;
    ;

    a,
    button {
        color: #1E88E5;
        transition: 0.5s;
    }

    a:hover,
    button:hover {
        color: #19ca8f;
    }

    .nav-item {
        font-size: 20px;
    }

    .nav-item .custom-router-link-active {
        color: #19ca8f;
        text-shadow: 1px 0 #fff, -1px 0 #fff, 0 1px #fff, 0 -1px #fff,
            1px 1px #fff, -1px -1px #fff, 1px -1px #fff, -1px 1px #fff;
    }

    .navbar-brand {
        font-size: 35px;
    }

    .navbar-brand.custom-router-link-active {
        color: #1E88E5;
    }
}

.navbar-home {
    background-color: transparent;

    .navbar-brand {
        font-size: 60px;
        margin-left: 20px;
        text-shadow: 2px 0 #fff, -2px 0 #fff, 0 2px #fff, 0 -2px #fff,
            1px 1px #fff, -1px -1px #fff, 1px -1px #fff, -1px 1px #fff;
    }

    .navbar-toggler,
    .navbar-collapse {
        opacity: 0;
        font-size: 20px;
        transition: 0.4s;
    }

    #lang-switcher {
        opacity: 0;
    }
}

.navbar-home-active {
    background-color: rgba(255, 255, 255, 0.1);
}
</style>