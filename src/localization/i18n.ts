import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ru from './locales/ru.json';
import de from './locales/de.json';

// don't want to use this?
// have a look at the Quick start guide 
// for passing in lng and translations on init

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: 'en',
    debug: true,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    supportedLngs: ['en', 'ru', 'de'],
    resources: {
      en: {
        translation: en,
      },
      ru: {
        translation: ru,
      },
      de: {
        translation: de,
      },
    },
    });


export default i18n;