import React, { useEffect, useState, useContext } from "react";
import logo from "../img/RE-Schraub Logo frei-1772x1128-429w.png";
import Navbar from "./Navbar";
import "../Header.css";
import { Language } from "../context/LanguageContext";

function Header() {
    const [compact, setCompact] = useState(false);
    const [showTopBar, setShowTopBar] = useState(false);
    const { language, toggleLanguage, t } = useContext(Language);

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentY = window.scrollY;
            const scrollingUp = currentY < lastScrollY;
            const nearTop = currentY < 160;

            setCompact(currentY > 70);
            setShowTopBar(scrollingUp && !nearTop);

            lastScrollY = currentY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            {showTopBar && (
                <div className="top-action-bar">
                    <button>{t("contact.topicJobs")}</button>
                    <button>{t("nav.contact")}</button>
                    <button>{t("info.company")}</button>
                </div>
            )}

            <header className="header">
                <div className="header-top">

                    <div className="branding">
                        <img src={logo} alt="RE-Schraub Logo" className="logo"/>
                        <h1 className="company-title">RE-Schraub GmbH</h1>
                    </div>

                    <div className="header-actions">
                        <button className="lang-toggle" onClick={toggleLanguage}>
                            {language === "de" ? "EN" : "DE"}
                        </button>
                    </div>

                </div>

                <Navbar/>
            </header>
        </>
    );
}

export default Header;