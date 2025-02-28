import { createI18n } from 'vue-i18n';
import languages from '@/assets/i18n/languages'

const i18n = createI18n({
    locale: localStorage.getItem('lang') || 'en',
    fallbackLocale: 'en',
    messages: {
        en: { message: languages.en, langUrl: 'en-US' },
        it: { message: languages.it, langUrl: 'it-IT' },
        cn: { message: languages.cn, langUrl: 'zh-ZH' },
    },
});

export default i18n;