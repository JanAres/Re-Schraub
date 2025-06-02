import React, { useContext } from "react";
import "../AboutUs.css";
import { Language } from "../context/LanguageContext";
import {NavLink} from "react-router-dom";

function AboutUs() {
    const { t } = useContext(Language);

    return (
        <>
            {/* Full‐Width Banner */}
            <div className="full-width-banner"></div>

            <div className="about">
                <div className="about-container">

                    {/* Intro‐Abschnitt (zentriert) */}
                    <section className="intro-section">
                        <h1>{t("about.title")}</h1>
                        <p>{t("about.section1")}</p>
                        <p>{t("about.section2")}</p>
                    </section>


                    <div className="image-gallery">
                        <div className="gallery-item">
                            <img src="/img/thumbnail_Bild Terrassofix - vorgebohrt.jpg" alt="Galeriebild 1"/>
                        </div>
                        <div className="gallery-item">
                            <img src="/img/thumbnail_Bild Distanzstern.jpg" alt="Galeriebild 2"/>
                        </div>
                        <div className="gallery-item">
                            <img src="/img/thumbnail_5.jpg" alt="Galeriebild 3"/>
                        </div>
                        <div className="gallery-item">
                            <img src="/img/thumbnail_Betonschrauben für Stelzlager_1.png" alt="Galeriebild 4"/>
                        </div>
                        <div className="gallery-item">
                            <img src="/img/thumbnail_20211008_154847.jpg" alt="Galeriebild 5"/>
                        </div>
                    </div>


                    {/* Flex‐Container für die drei Abschnitte nebeneinander */}
                    <div className="sections-row">
                        {/* Abschnitt 1: Unser Anspruch */}
                        <section className="about-section">
                            <h2>{t("about.section3Title")}</h2>
                            <p>{t("about.section3")}</p>
                        </section>

                        {/* Abschnitt 2: Innovation & Weiterentwicklung */}
                        <section className="about-section">
                            <h2>{t("about.section4Title")}</h2>
                            <p>{t("about.section4")}</p>
                        </section>

                        {/* Abschnitt 3: Ihre Ansprechpartner */}
                        <section className="about-section">
                            <h2>{t("about.section5Title")}</h2>
                            <p>{t("about.section5")}
                                <NavLink to="/contact">{t("nav.contact")}</NavLink></p>



                        </section>


                    </div>

                    {/* Galerie mit 6 Bildern unter den drei Abschnitten */}


                </div>
            </div>
        </>
    );
}

export default AboutUs;
