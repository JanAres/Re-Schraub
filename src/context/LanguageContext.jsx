// src/context/LanguageContext.jsx
// src/context/LanguageContext.jsx
import { createContext, useState } from "react";
import translations from "../translations";

export const Language = createContext({
    language: "de",
    toggleLanguage: () => {},
    t: (key) => key
});

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState("de");

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === "de" ? "en" : "de"));
    };

    const t = (key) => {
        // Splittet "news.items" in ["news","items"]
        const parts = key.split(".");
        let text = translations[language];

        for (let p of parts) {
            if (text && typeof text === "object" && p in text) {
                text = text[p];
            } else {
                text = null;
                break;
            }
        }

        // Wenn text == null, Key nicht gefunden → gebe den Key zurück.
        // Ansonsten, egal ob String, Array oder Objekt: gib text zurück.
        if (text === null) {
            return key;
        }
        return text;
    };

    return (
        <Language.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </Language.Provider>
    );
};
