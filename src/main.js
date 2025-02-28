import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import AppLink from './components/AppLink.vue'
import router from '@/router'
import i18n from './assets/i18n/i18n.js'

if (!localStorage.getItem('lang')) {
    localStorage.setItem('lang', 'en')
}

createApp(App).component('AppLink', AppLink).use(router).use(i18n).mount('#app')