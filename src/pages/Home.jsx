import React, { useContext, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "../Home.css";
import { Language } from "../context/LanguageContext";
import useIsMobile from "../components/useIsMobile";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

function Home() {
    const { t } = useContext(Language);
    const isMobile = useIsMobile(768);

    const catalogFile = "/pdf/Katalog_ReSchraub_2025_FINAL_oPreise_HiRes.pdf";

    const images = [
        {
            src: "/img/thumbnail_20211002_165408.jpg",
            alt: "Box 1",
            catalogPage: 12,
        },
        {
            src: "/img/Screenshot 2025-06-02 at 13-06-57 ReSchraub_Fassadofix_Aufkleber_Eimer_FINAL - ReSchraub_Fassadofix_Aufkleber_Eimer_FINAL.pdf.png",
            alt: "Box 2",
            catalogPage: 20,
        },
        {
            src: "/img/Screenshot 2025-06-02 at 13-07-12 ReSchraub_Fassadofix_Aufkleber_Eimer_FINAL - ReSchraub_Fassadofix_Aufkleber_Eimer_FINAL.pdf.png",
            alt: "Box 3",
            catalogPage: 24,
        },
        {
            src: "/img/Screenshot 2025-06-05 at 09-18-24 EH_ReSchraub_2025_L.pdf.png",
            alt: "Box 4",
            catalogPage: 28,
        },
    ];

    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(null);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const prevPage = () => setPageNumber((p) => Math.max(p - 1, 1));
    const nextPage = () => setPageNumber((p) => Math.min(p + 1, numPages || 1));

    const handleImageClick = (index) => {
        setSelectedImageIndex(index);
        setPageNumber(images[index].catalogPage || 1);
    };

    if (isMobile) {
        return (
            <div className="home-mobile-wrapper">
                <h3 className="home-mobile-title">{t("home.welcome")}</h3>

                <div className="home-mobile-text">
                    <p>{t("home.subtitle")}</p>
                    <p>{t("subtitle2")}</p>
                </div>

                <div className="home-image-grid">
                    {images.map((image, i) => (
                        <button
                            key={i}
                            type="button"
                            className={`home-image-card ${selectedImageIndex === i ? "active" : ""}`}
                            onClick={() => handleImageClick(i)}
                        >
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="home-grid-img"
                            />
                        </button>
                    ))}
                </div>

                {selectedImageIndex !== null && (
                    <div className="home-catalog-panel">
                        <div className="pdf-wrapper">
                            <Document
                                file={catalogFile}
                                onLoadSuccess={onDocumentLoadSuccess}
                                onLoadError={(err) => console.error("PDF Load Error:", err.message)}
                            >
                                <Page
                                    pageNumber={pageNumber}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                    width={320}
                                />
                            </Document>
                        </div>

                        <div className="pdf-nav-buttons">
                            <button
                                className="nav-button"
                                onClick={prevPage}
                                disabled={pageNumber <= 1}
                            >
                                ‹ Prev
                            </button>
                            <button
                                className="nav-button"
                                onClick={nextPage}
                                disabled={pageNumber >= (numPages || 1)}
                            >
                                Next ›
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <>
            <div className="full-width-banner">
                <div className="head-row">
                    <h3>{t("home.welcome")}</h3>
                </div>
            </div>

            <div className="home-container home-container-with-catalog">
                <div className="home-left-column">
                    <div className="textt-box">
                        <p className="Subtitle">{t("home.subtitle")}</p>
                        <p className="Subtitle2">{t("subtitle2")}</p>
                    </div>

                    <div className="wood-box-container">
                        <div className="box-row box-row-grid">
                            {images.map((image, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    className={`box image-button ${selectedImageIndex === i ? "selected" : ""}`}
                                    onClick={() => handleImageClick(i)}
                                >
                                    <img
                                        src={image.src}
                                        alt={image.alt}
                                        className="box-img interactive-box-img"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {selectedImageIndex !== null && (
                    <div className="catalog-side-panel">
                        <h3 className="catalog-side-title">Katalog</h3>

                        <div className="pdf-wrapper">
                            <Document
                                file={catalogFile}
                                onLoadSuccess={onDocumentLoadSuccess}
                                onLoadError={(err) => console.error("PDF Load Error:", err.message)}
                            >
                                <Page
                                    pageNumber={pageNumber}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                    width={380}
                                />
                            </Document>
                        </div>

                        <div className="pdf-nav-buttons">
                            <button
                                className="nav-button"
                                onClick={prevPage}
                                disabled={pageNumber <= 1}
                            >
                                ‹ Prev
                            </button>
                            <button
                                className="nav-button"
                                onClick={nextPage}
                                disabled={pageNumber >= (numPages || 1)}
                            >
                                Next ›
                            </button>
                        </div>

                        <p className="page-indicator">
                            Seite {pageNumber} / {numPages || "—"}
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}

export default Home;