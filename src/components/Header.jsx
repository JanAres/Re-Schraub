import React, { useEffect, useState, useContext } from "react";
import logo from "../img/RE-Schraub Logo frei-1772x1128-429w.png";
import Navbar from "./Navbar";
import "../Header.css";
import { Language } from "../context/LanguageContext";

function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [showTopBar, setShowTopBar] = useState(false);
    const { language, toggleLanguage, t } = useContext(Language);

    useEffect(() => {
        let lastScrollY = window.scrollY;
        const handleScroll = () => {
            const currentY = window.scrollY;
            setScrolled(currentY > 80);

            const scrollingUp = currentY < lastScrollY;
            const nearTop = currentY < 200;
            setShowTopBar(scrollingUp && !nearTop);

            lastScrollY = currentY;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            {showTopBar && (
                <div className="top-action-bar">
                    <button>{t("contact.topicJobs") /* z.B. „Bewerber“ */}</button>
                    <button>{t("nav.contact") /* „Kontakt“ */}</button>
                    <button>{t("info.company") /* „Standort“ (als Platzhalter) */}</button>
                </div>
            )}

            <header className={`header ${scrolled ? "scrolled" : ""}`}>
                <div className="branding">
                    <img src={logo} alt="RE-Schraub Logo" className="logo" />
                    <h1 className="company-title">RE-Schraub GmbH</h1>
                </div>

                {/* Language‐Toggle oben rechts */}
                <div className="header-actions">
                    <button className="lang-toggle" onClick={toggleLanguage}>
                        {language === "de" ? "EN" : "DE"}
                    </button>
                </div>

                <Navbar />
            </header>
        </>
    );
}

export default Header;