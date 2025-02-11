/* eslint-disable import/no-named-as-default-member */
import i18n from 'i18next';

import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n.use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        // resources: {
        //     en: {
        //         translation: {
        //             test123: 'Hello this is a test message.',
        //         },
        //     },
        // },
        debug: Boolean(process.env.debug),
        lng: 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
