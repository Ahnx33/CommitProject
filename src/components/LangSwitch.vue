<template>
    <div class="me-4" id="lang-switcher">
        <select name="lang_select" id="lang_select" @change="changeLang($event.target.value)">
            <option value="">O</option>
            <option value="en">English</option>
            <option value="it">Italiano</option>
            <option value="cn">简体中文</option>
        </select>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import data from '@/data';

const { locale } = useI18n();
const changeLang = (lang) => {
    if (lang) {
        locale.value = lang;
        localStorage.setItem('lang', lang);
        data.reload_language();
    }
};
</script>

<style scoped>
#lang-switcher {
    border: 2px solid white;
    border-radius: 50%;
    transition: 0.42s;
}

#lang_select {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #14aa78;
}
</style>