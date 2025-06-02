// src/pages/Home.jsx
import React, { useContext, useState, useEffect } from "react";
import "../Home.css"; // Assuming your styles are defined here
import { Language } from "../context/LanguageContext";

function Home() {
    const { t } = useContext(Language);

    // List of images with relevant sources and alt text
    const images = [
        { src: "/img/thumbnail_5.jpg", alt: "Box 1" },
        {
            src: "/img/Screenshot 2025-06-02 at 13-06-57 ReSchraub_Fassadofix_Aufkleber_Eimer_FINAL - ReSchraub_Fassadofix_Aufkleber_Eimer_FINAL.pdf.png",
            alt: "Box 2",
        },
        { src: "/img/thumbnail_20211008_154847.jpg", alt: "Box 3" },
        { src: "/img/thumbnail_Betonschrauben für Stelzlager_1.png", alt: "Box 4" },
    ];

    // State to track the current image index
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        // Set the interval for updating the image index every 5 seconds (5000 ms)
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000);

        // Cleanup the interval when the component unmounts
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <>
            <div className="full-width-banner">
                <div className="head-row">
                    <h3>{t("home.welcome")}</h3>
                </div>
            </div>

            <div className="home-container">
                <div className="textt-box">
                    <p className="Subtitle">{t("home.subtitle")}</p>
                </div>

                <div className="wood-box-container">
                    <div className="box-row">

                        <div className="box">
                            <img
                                src={images[currentImageIndex].src}
                                alt={images[currentImageIndex].alt}
                                className="box-img"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;