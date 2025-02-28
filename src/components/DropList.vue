<template>
    <ul class="dropdown-menu scrollable-bar-hidden">
        <li>
            <AppLink :to="{ name: 'media.show', params: { id: -1, genre: 'all', mediatype: 'all' } }" :key="'allGenres'"
                key="catalog-all">{{ $t('message.All_Genres') }}
            </AppLink>
        </li>
        <li>
            <hr class="dropdown-divider">
        </li>
        <li v-for="genre in list">
            <AppLink :to="{ name: 'media.show', params: { id: genre.id, genre: genre.name, mediatype: 'all' } }"
                :key="genre.id">{{
                    genre.name
                }}</AppLink>
        </li>
    </ul>
</template>

<script>

export default {
    props: {
        list: { type: Array, required: true }
    }
}
</script>

<style scoped>
.dropdown-menu {
    max-height: 20rem;
}
</style>