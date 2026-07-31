// src/pages/News.jsx
import React, { useState, useContext, useEffect, useRef } from "react";
import "../News.css";
import { Language } from "../context/LanguageContext";

function News() {
    const { t } = useContext(Language);
    const newsItems = t("news.items") || [];
    const totalItems = newsItems.length;
    const file = "/pdf/EH_ReSchraub_2025_L.pdf";

    // Für die News-Karte (linke Spalte)
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRotating, setIsRotating] = useState(false);

    const handleNext = () => {
        if (totalItems === 0) return;
        setIsRotating(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % totalItems);
            setIsRotating(false);
        }, 500);
    };

    const handlePrev = () => {
        if (totalItems === 0) return;
        setIsRotating(true);
        setTimeout(() => {
            setCurrentIndex((prev) =>
                prev === 0 ? totalItems - 1 : prev - 1
            );
            setIsRotating(false);
        }, 500);
    };

    // === Rechter Bereich: DIN A4-Box mit 3-Bild-Carousel ===

    // Hier werden die drei Bilder definiert (z. B. relative Pfade in /public/img/)
    const carouselImages = [
        "./img/Screenshot 2025-06-05 at 09-27-10 EH_ReSchraub_2025_L.pdf.png",
        "./img/Screenshot 2025-06-05 at 09-27-15 EH_ReSchraub_2025_L.pdf.png",
        "./img/Screenshot 2025-06-05 at 09-27-20 EH_ReSchraub_2025_L.pdf.png",
    ];

    // State: aktuelles Bild-Index (0, 1 oder 2)
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [isFlipping, setIsFlipping] = useState(false);
    const flipIntervalRef = useRef(null);

    // Intervall starten, um alle 10 Sekunden das Bild zu wechseln
    useEffect(() => {
        // Falls noch kein Intervall gesetzt ist, legen wir eines an
        if (!flipIntervalRef.current) {
            flipIntervalRef.current = setInterval(() => {
                // Flip-Animation kurz antriggern
                setIsFlipping(true);
                setTimeout(() => {
                    setCarouselIndex((prev) => (prev + 1) % carouselImages.length);
                    setIsFlipping(false);
                }, 300); // 600 ms dauert die Flip-Animation
            }, 6000); // alle 10 Sekunden umblättern
        }
        // Aufräumen, wenn die Komponente unmountet
        return () => {
            if (flipIntervalRef.current) {
                clearInterval(flipIntervalRef.current);
                flipIntervalRef.current = null;
            }
        };
    }, [carouselImages.length]);

    // Wenn keine News-Items vorhanden sind, nur Titel und Hinweis anzeigen
    if (totalItems === 0) {
        return (
            <>
                <div className="news-page">
                    <h1 className="news-title">{t("news.title")}</h1>
                    <p>{t("news.noItems")}</p>
                </div>
            </>
        );
    }

    return (
        <>

            <div className="news-page">
                <h1 className="news-title">{t("news.title")}</h1>

                <div className="news-container">
                    {/* ===========    Linke Spalte: Haupt-News-Karte    =========== */}
                    <div className="news-main">
                        <div className="news-card">
                            <div className="news-text">
                                <h2>{newsItems[currentIndex].title}</h2>
                                <p>{newsItems[currentIndex].desc}</p>
                                <ul className="desc-points">
                                    {newsItems[currentIndex].points.map((point, idx) => (
                                        <li key={idx}>{point}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="news-img-box">
                                {/* Download-Link hinter dem Bild */}
                                <a
                                    href={newsItems[currentIndex].downloadLink} // URL zur herunterladbaren Datei
                                    download={newsItems[currentIndex].downloadFileName} // Dateiname für den Download
                                >
                                    <img
                                        src={newsItems[currentIndex].img}
                                        alt={newsItems[currentIndex].title}
                                        className={isRotating ? "rotate" : ""}
                                    />
                                </a>
                            </div>
                        </div>

                        <div className="button-container">
                            <button onClick={handlePrev}>
                                <svg viewBox="0 0 24 24">
                                    <path d="M15.41 16.58L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/>
                                </svg>
                                {t("news.prev")}
                            </button>
                            <button onClick={handleNext}>
                                {t("news.next")}
                                <svg viewBox="0 0 24 24">
                                    <path d="M8.59 16.58L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* ===========    Rechte Spalte: DIN A4-Box mit 3-Seiten-Carousel    =========== */}
                    <div className="news-gallery">
                        <div className={`a4-box ${isFlipping ? "flip" : ""}`}>
                            <img
                                src={carouselImages[carouselIndex]}
                                alt={`Seite ${carouselIndex + 1}`}
                            />
                        </div>
                        <div className="download-container">
                            <a href={file} download className="download-link">
                                {t("news.download")}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default News;
