// src/pages/Products.jsx
import React, { useState, useContext } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "./Products.css";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { Language } from "../context/LanguageContext";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

function Products() {
    const { t } = useContext(Language);

    const file = "/pdf/RE-Schraub Katalog ohne Preise.pdf";
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [isPdfVisible, setIsPdfVisible] = useState(false);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    function onDocumentLoadError(error) {
        console.error("PDF Load Error:", error.message);
    }

    const nextPage = () => {
        if (pageNumber < numPages) {
            setPageNumber(pageNumber + 1);
        }
    };

    const prevPage = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    };

    const handleOptionClick = (targetPage) => {
        setPageNumber(targetPage);
        setIsPdfVisible(true);
    };

    // Seiten-Indikator‐Text mit Platzhaltern ersetzen
    const pageIndicatorText = t("products.pageIndicator")
        .replace("{{current}}", pageNumber)
        .replace("{{total}}", numPages || 0);

    return (
        <>
            <div className="full-width-banner"></div>
            <div className="product">
                <div className="products-layout">
                    <main className="product-content">
                        <h1 id="catalog">{t("products.title")}</h1>

                        <div className="produkt-buttons">
                            <button onClick={() => handleOptionClick(12)}>
                                {t("products.categories.roof")}
                            </button>
                            <button onClick={() => handleOptionClick(20)}>
                                {t("products.categories.anchor")}
                            </button>
                            <button onClick={() => handleOptionClick(24)}>
                                {t("products.categories.garden")}
                            </button>
                            <button onClick={() => handleOptionClick(28)}>
                                {t("products.categories.terrace")}
                            </button>
                            <button onClick={() => handleOptionClick(40)}>
                                {t("products.categories.nails")}
                            </button>
                            <button onClick={() => handleOptionClick(44)}>
                                {t("products.categories.standard")}
                            </button>
                            <button onClick={() => handleOptionClick(48)}>
                                {t("products.categories.chipboard")}
                            </button>
                            <button onClick={() => handleOptionClick(55)}>
                                {t("products.categories.tools")}
                            </button>
                            <button onClick={() => handleOptionClick(61)}>
                                {t("products.categories.drywall")}
                            </button>
                        </div>

                        {isPdfVisible && (
                            <>
                                <div className="pdf-viewer">
                                    <button
                                        onClick={prevPage}
                                        disabled={pageNumber <= 1}
                                        className="nav-button"
                                    >
                                        {t("products.prev")}
                                    </button>

                                    <div className="pdf-wrapper">
                                        <Document
                                            file={file}
                                            onLoadSuccess={onDocumentLoadSuccess}
                                            onLoadError={onDocumentLoadError}
                                        >
                                            <Page
                                                pageNumber={pageNumber}
                                                renderTextLayer={false}
                                                renderAnnotationLayer={false}
                                            />
                                        </Document>
                                    </div>

                                    <button
                                        onClick={nextPage}
                                        disabled={pageNumber >= numPages}
                                        className="nav-button"
                                    >
                                        {t("products.next")}
                                    </button>
                                </div>
                                <p className="page-indicator">{pageIndicatorText}</p>
                            </>
                        )}
                    </main>
                </div>
            </div>
        </>
    );
}

export default Products;
