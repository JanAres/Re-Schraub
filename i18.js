// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Wenn du Browser‐Spracherkennung nutzen willst:
import LanguageDetector from "i18next-browser-languagedetector";

// Lade deine JSON‐Dateien
import translationEN from "./locales/en.json";
import translationDE from "./locales/de.json";

i18n
    // falls du Browser-Detection nutzt, um die Sprache automatisch zu erkennen:
    .use(LanguageDetector)
    // bindet i18next an React
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: translationEN },
            de: { translation: translationDE }
        },
        fallbackLng: "de",         // wenn weder en noch de erkannt wird, nimm “de”
        debug: false,              // setze auf true für Console‐Logs beim Entwickeln
        interpolation: {
            escapeValue: false      // React-HTML‐escaping geschieht automatisch
        },
        detection: {
            // optional: falls du LanguageDetector verwendest, hier kannst du konfigurieren,
            // z.B. order: ["querystring","cookie","localStorage","navigator","htmlTag","path","subdomain"],
            // caches: ["localStorage"]
        }
    });

export default i18n;
