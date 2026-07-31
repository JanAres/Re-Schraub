import React, { useContext } from "react";
import "../location.css";
import { Language } from "../context/LanguageContext";
import PageFlyTitle from "../components/PageFlyTitle";

const downloads = [
    {
        title: "Terrassofix/Fassadofix",
        subtitle:
            "Technische Informationen für Terrasse, Fassade und sichere Befestigungssysteme im Außenbereich.",
        image: "/img/Screenshot 2025-06-05 at 09-27-15 EH_ReSchraub_2025_L.pdf.png",
        href: "/pdf/EH_ReSchraub_2025_L.pdf",
        meta: "Spezialkatalog",
    },
    {
        title: "RE-Schraub Katalog",
        subtitle:
            "Der Produktkatalog 2025 als Grundlage für Auswahl, Planung und Einkauf.",
        image: "/img/Screenshot 2025-06-05 at 12-07-24 RE-Schraub Katalog ohne Preise.pdf.png",
        href: "/pdf/Katalog_ReSchraub_2025_FINAL_oPreise_HiRes.pdf",
        meta: "Produktkatalog",
    },
];

function Impressum() {
    const { t } = useContext(Language);
    const pageTitle = t("download.title") || "Downloads";

    return (
        <main className="downloads-page" aria-labelledby="downloads-title">
            <PageFlyTitle path="/impressum" title={pageTitle} />

            <section className="downloads-hero">
                <h1 id="downloads-title">{pageTitle}</h1>
            </section>

            <section className="download-card-grid" aria-label="Download-Kataloge">
                {downloads.map((item) => (
                    <article className="download-card" key={item.title}>
                        <a
                            className="download-preview"
                            href={item.href}
                            download
                            aria-label={`${item.title} herunterladen`}
                        >
                            <img
                                src={item.image}
                                alt={`${item.title} Vorschau`}
                                loading="lazy"
                            />
                            <span className="download-corner-badge">PDF</span>
                        </a>

                        <div className="download-card-body">
                            <span className="download-meta">{item.meta}</span>

                            <h2>{item.title}</h2>

                            <p>{item.subtitle}</p>

                            <a href={item.href} download className="download-button">
                                <span>PDF herunterladen</span>

                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M12 3v11.2m0 0 4.4-4.4M12 14.2 7.6 9.8M5 20h14" />
                                </svg>
                            </a>
                        </div>
                    </article>
                ))}
            </section>
        </main>
    );
}

export default Impressum;