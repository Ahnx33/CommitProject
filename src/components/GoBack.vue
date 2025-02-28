<template>
    <span class="go-back">
        <button @click="$router.back()">{{ $t('message.Return') }}</button>
    </span>
</template>

<style scoped>
/* position */
.go-back {
    display: block;
    position: absolute;
    right: 5%;
    top: 3vh;
}
</style>