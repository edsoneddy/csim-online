import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import es from './locales/es.json';

// Add a new language by adding its code here, dropping a `locales/<code>.json`
// file next to en.json/es.json, and registering it in the `resources` map below.
// See docs/i18n.md.
export const SUPPORTED_LANGUAGES = ['en', 'es'];
const DEFAULT_LANGUAGE = 'en';
const LANGUAGE_STORAGE_KEY = 'csim_language';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES,
    // Collapses browser locales like es-AR/es-MX to their base code (es) for
    // both detection and resource lookup.
    load: 'languageOnly',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      // The detector caches whatever it detects verbatim (e.g. "es-AR"),
      // ahead of `load: 'languageOnly'`. Normalize to the base code so the
      // cached value is always one of SUPPORTED_LANGUAGES.
      convertDetectedLanguage: (lng) => lng.split('-')[0],
    },
    interpolation: {
      escapeValue: false, // React already escapes interpolated values
    },
    // No backend/async resource loading (everything above is bundled), so
    // init can run synchronously and finish before the app's first render.
    initImmediate: false,
  });

const syncHtmlLang = (lng) => {
  document.documentElement.lang = lng;
};

syncHtmlLang(i18n.resolvedLanguage || i18n.language);
i18n.on('languageChanged', syncHtmlLang);

// A few plain (non-component) utility modules -- src/utils/results.jsx,
// src/utils/editor.js -- format small leaf strings and can't call the
// useTranslation hook. They call i18n.t() directly on this instance instead.
export default i18n;
