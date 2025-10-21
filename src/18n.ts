import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from './locales/en';
import tk from "./locales/tk";
import ru from "./locales/ru";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      tk: { translation: tk },
      ru: { translation: ru },
    },
    lng: "tk", // <-- Varsayılan dil Türkmen!
    fallbackLng: "tk", // <-- Geri dönüş dili de Türkmen!
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;