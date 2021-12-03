import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationFR from "./fr.json";
import translationEN from "./en.json";

const resources = {
  en: { translation: translationEN },
  fr: { translation: translationFR }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: ["en", "fr"],
    fallbackLng: "fr",
  }).then();

export default i18n;
