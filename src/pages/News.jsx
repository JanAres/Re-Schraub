// src/pages/News.jsx
import React, { useState, useContext } from "react";
import "../News.css";
import { Language } from "../context/LanguageContext";

function News() {
    const { t } = useContext(Language);
    const newsItems = t("news.items") || [];
    const totalItems = newsItems.length;

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

    if (totalItems === 0) {
        return (
            <>
                <div className="full-width-banner" />
                <div className="news-page">
                    <h1 className="news-title">{t("news.title")}</h1>
                    <p>{t("news.noItems")}</p>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="full-width-banner" />

            <div className="news-page">
                <h1 className="news-title">{t("news.title")}</h1>

                <div className="news-container">
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
                            <img
                                src={newsItems[currentIndex].img}
                                alt={newsItems[currentIndex].title}
                                className={isRotating ? "rotate" : ""}
                            />
                        </div>
                    </div>
                </div>

                <div className="button-container">
                    <button onClick={handlePrev}>
                        <svg viewBox="0 0 24 24">
                            <path d="M15.41 16.58L10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
                        </svg>
                        {t("news.prev")}
                    </button>
                    <button onClick={handleNext}>
                        {t("news.next")}
                        <svg viewBox="0 0 24 24">
                            <path d="M8.59 16.58L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
                        </svg>
                    </button>
                </div>
            </div>
        </>
    );
}

export default News;
