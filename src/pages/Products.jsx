import React, { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import "./Products.css";
import { catalogs } from "../data/catalogs";
import logo from "../img/RE-Schraub Logo frei-1772x1128-429w.png";
import {
    loadCatalogExcelData,
    detectArticlesInText,
    searchArticles,
} from "../data/articleLoader";
import PageFlyTitle from "../components/PageFlyTitle";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

const TURN_MS = 560;
const LANDING_OPEN_MS = 2180;
const LANDING_OPEN_ANIMATION_MS = 2040;
const NOTES_KEY = "catalog_notes_v1";
const ARTICLES_KEY = "catalog_selected_articles_v1";
const CONTACT_KEY = "catalog_selected_contact_v1";

const demoContacts = [
    {
        id: "c1",
        name: "Max Berger",
        region: "Recklinghausen",
        role: "Außendienst",
        phone: "+49 157 00000001",
    },
    {
        id: "c2",
        name: "Sophie Klein",
        region: "Bochum",
        role: "Projektberatung",
        phone: "+49 157 00000002",
    },
    {
        id: "c3",
        name: "Tobias Neumann",
        region: "Essen",
        role: "Montage & Gewerbekunden",
        phone: "+49 157 00000003",
    },
];

function EmptyPage() {
    return <div className="minimal-catalog-empty-page" />;
}

function NotesOutlineIcon() {
    return (
        <svg viewBox="0 0 24 24" className="notes-outline-icon" aria-hidden="true">
            <path
                d="M7 3.75h7.5L19.25 8.5V19A1.25 1.25 0 0 1 18 20.25H7A1.25 1.25 0 0 1 5.75 19V5A1.25 1.25 0 0 1 7 3.75Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
            />
            <path
                d="M14.5 3.75V8.5h4.75"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
            />
            <path
                d="M8.5 11h7M8.5 14h7M8.5 17h4.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
            />
        </svg>
    );
}

function CatalogViewerFlyTitle({ title, direction = "right" }) {
    const [displayTitle, setDisplayTitle] = useState(title);
    const [phase, setPhase] = useState(direction === "right" ? "enter-left" : "enter-right");

    useEffect(() => {
        if (!title || title === displayTitle) return;

        const exitPhase = direction === "right" ? "exit-right" : "exit-left";
        const enterPhase = direction === "right" ? "enter-left" : "enter-right";

        setPhase(exitPhase);

        const switchTimer = window.setTimeout(() => {
            setDisplayTitle(title);
            setPhase(enterPhase);

            window.setTimeout(() => {
                setPhase("visible");
            }, 40);
        }, 420);

        return () => window.clearTimeout(switchTimer);
    }, [title, direction, displayTitle]);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setPhase("visible");
        }, 40);

        return () => window.clearTimeout(timer);
    }, []);

    return (
        <div className={`catalog-viewer-fly-title catalog-viewer-fly-title--${phase}`}>
            <h2>{displayTitle}</h2>
        </div>
    );
}

function LandingPreviewPage({
                                pageNumber,
                                src,
                                pdfFile,
                                onCachePage,
                                fallbackClassName = "",
                            }) {
    const liveRef = useRef(null);

    const cacheLivePage = () => {
        if (!onCachePage) return;

        const canvas = liveRef.current?.querySelector("canvas");
        if (!canvas) return;

        try {
            onCachePage(pageNumber, canvas.toDataURL("image/png"));
        } catch {
            onCachePage(pageNumber);
        }
    };

    if (src) {
        return (
            <img
                src={src}
                alt={`Katalog Seite ${pageNumber}`}
                className="landing-page-preview"
                draggable={false}
                decoding="async"
                loading="eager"
            />
        );
    }

    /*
       Important: this is NOT a separate visual layer. It is only a live fallback
       inside the exact same page shell. As soon as the canvas is rendered, it is
       cached as PNG and the same shell switches to the prerendered image.
    */
    return (
        <div className={`landing-page-live-doc ${fallbackClassName}`} ref={liveRef}>
            <Document file={pdfFile} loading={null} error={null}>
                <Page
                    pageNumber={pageNumber}
                    height={940}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    devicePixelRatio={
                        typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 1.35) : 1
                    }
                    onRenderSuccess={cacheLivePage}
                />
            </Document>
        </div>
    );
}

function LandingPagePreRenderer({ pdfFile, pages = [1, 2], pageImages, onCachePage }) {
    const probeRefs = useRef({});

    const cacheProbePage = (pageNumber) => {
        if (!onCachePage || pageImages?.[pageNumber]) return;

        const canvas = probeRefs.current[pageNumber]?.querySelector("canvas");
        if (!canvas) return;

        try {
            onCachePage(pageNumber, canvas.toDataURL("image/png"));
        } catch {
            onCachePage(pageNumber);
        }
    };

    return (
        <div className="landing-prerender-cache" aria-hidden="true">
            <Document file={pdfFile} loading={null} error={null}>
                {pages.map((pageNumber) =>
                    pageImages?.[pageNumber] ? null : (
                        <div
                            key={`landing-probe-${pageNumber}`}
                            className="landing-prerender-probe"
                            ref={(node) => {
                                probeRefs.current[pageNumber] = node;
                            }}
                        >
                            <Page
                                pageNumber={pageNumber}
                                height={940}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                devicePixelRatio={
                                    typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 1.35) : 1
                                }
                                onRenderSuccess={() => cacheProbePage(pageNumber)}
                            />
                        </div>
                    )
                )}
            </Document>
        </div>
    );
}

function CachedLeaf({
                        pageNumber,
                        className = "",
                        pageImages,
                        pageProps,
                        onRenderSuccess,
                    }) {
    const leafRef = useRef(null);

    if (!pageNumber) return <EmptyPage />;

    const src = pageImages[pageNumber];

    const cacheVisiblePage = () => {
        if (!onRenderSuccess) return;

        const canvas = leafRef.current?.querySelector("canvas");
        if (!canvas) {
            onRenderSuccess(pageNumber);
            return;
        }

        try {
            onRenderSuccess(pageNumber, canvas.toDataURL("image/png"));
        } catch {
            onRenderSuccess(pageNumber);
        }
    };

    return (
        <div className={className} ref={leafRef}>
            {src ? (
                <img
                    src={src}
                    alt={`Seite ${pageNumber}`}
                    className="pdf-leaf-image"
                    draggable={false}
                />
            ) : (
                <div className="pdf-visible-page" data-page={pageNumber}>
                    <Page
                        pageNumber={pageNumber}
                        {...pageProps}
                        onRenderSuccess={cacheVisiblePage}
                    />
                </div>
            )}
        </div>
    );
}

export default function Products() {
    const [selectedCatalogId, setSelectedCatalogId] = useState(catalogs[0].id);
    const [numPages, setNumPages] = useState(null);
    const [activeGroup, setActiveGroup] = useState(null);
    const [currentSpreadStart, setCurrentSpreadStart] = useState(1);
    const [pageHeight, setPageHeight] = useState(760);
    const [turnState, setTurnState] = useState(null);

    const [pageImages, setPageImages] = useState({});
    const [preparedPages, setPreparedPages] = useState([]);
    const [initialReady, setInitialReady] = useState(false);

    const [contactModalOpen, setContactModalOpen] = useState(false);
    const [selectedContactId, setSelectedContactId] = useState(null);
    const [selectedArticles, setSelectedArticles] = useState([]);
    const [notes, setNotes] = useState("");
    const [toast, setToast] = useState("");

    const [excelReady, setExcelReady] = useState(false);
    const [allArticles, setAllArticles] = useState([]);
    const [articleSearch, setArticleSearch] = useState("");
    const [articleSearchResults, setArticleSearchResults] = useState([]);
    const [selectionPrompt, setSelectionPrompt] = useState(null);

    const [noteWidgetOpen, setNoteWidgetOpen] = useState(false);

    const [catalogMagnifier, setCatalogMagnifier] = useState({
        visible: false,
        src: "",
        x: 0,
        y: 0,
        bgX: 50,
        bgY: 50,
        pageNumber: null,
    });

    const [catalogLandingDone, setCatalogLandingDone] = useState(false);
    const [catalogLandingCharged, setCatalogLandingCharged] = useState(false);
    const [catalogOpening, setCatalogOpening] = useState(false);
    const [landingPagesFallbackVisible, setLandingPagesFallbackVisible] = useState(false);

    const pageRootRef = useRef(null);
    const viewerRef = useRef(null);
    const landingSpreadRef = useRef(null);
    const viewerSpreadRef = useRef(null);
    const wheelLockRef = useRef(false);
    const turnTimerRef = useRef(null);
    const toastTimerRef = useRef(null);
    const landingCloseTimerRef = useRef(null);
    const landingTitleRef = useRef(null);
    const landingLetterRefs = useRef([]);
    const landingWriterFrameRef = useRef(null);

    const [landingWriter, setLandingWriter] = useState({
        x: 0,
        y: 0,
        angle: -18,
        visible: false,
    });
    const [landingWriterFinished, setLandingWriterFinished] = useState(false);
    const [landingWrittenIndex, setLandingWrittenIndex] = useState(-1);

    const selectedCatalog = useMemo(
        () => catalogs.find((c) => c.id === selectedCatalogId) ?? catalogs[0],
        [selectedCatalogId]
    );

    const selectedContact = useMemo(
        () => demoContacts.find((c) => c.id === selectedContactId) ?? null,
        [selectedContactId]
    );

    const landingGroups = useMemo(
        () => (selectedCatalog.groups ?? []).slice(0, 6),
        [selectedCatalog]
    );

    const landingTitleLetters = useMemo(() => "Re-Schraub".split(""), []);
    const landingLeftPreview = pageImages[1] ?? null;
    const landingRightPreview = pageImages[2] ?? null;
    const landingPagesReady = Boolean(landingLeftPreview && landingRightPreview);
    const landingPagesVisible = landingWriterFinished || landingPagesFallbackVisible;
    const landingSceneClass = catalogOpening ? "phase-opening" : landingPagesVisible ? "phase-ready" : "phase-intro";

    useEffect(() => {
        if (catalogLandingDone) return;

        const timer = window.setTimeout(() => setCatalogLandingCharged(true), 280);
        return () => window.clearTimeout(timer);
    }, [catalogLandingDone]);

    useEffect(() => {
        if (catalogLandingDone || catalogOpening) return;

        if (landingWriterFinished) {
            setLandingPagesFallbackVisible(true);
            return;
        }

        setLandingPagesFallbackVisible(false);

        const fallbackTimer = window.setTimeout(() => {
            setLandingPagesFallbackVisible(true);
        }, 7600);

        return () => window.clearTimeout(fallbackTimer);
    }, [catalogLandingDone, catalogOpening, landingWriterFinished, selectedCatalogId]);

    useEffect(() => {
        const body = document.body;
        const root = document.documentElement;
        const shouldCollapseNav = !catalogLandingDone;

        body.classList.toggle("products-navbar-collapsed", shouldCollapseNav);
        root.classList.toggle("products-navbar-collapsed", shouldCollapseNav);

        return () => {
            body.classList.remove("products-navbar-collapsed");
            root.classList.remove("products-navbar-collapsed");
        };
    }, [catalogLandingDone, catalogOpening]);

    const syncLandingHandoffMetrics = () => {
        const root = pageRootRef.current;
        const landingSpread = landingSpreadRef.current;
        const viewerSpread = viewerSpreadRef.current;
        const viewer = viewerRef.current;
        const targetNode = viewerSpread || viewer;

        if (!root || !landingSpread || !targetNode) return;

        const landingRect = landingSpread.getBoundingClientRect();
        const targetRect = targetNode.getBoundingClientRect();
        const viewerRect = viewer?.getBoundingClientRect?.() ?? targetRect;

        if (!landingRect.width || !landingRect.height || !targetRect.width || !targetRect.height) return;

        const landingCenterX = landingRect.left + landingRect.width / 2;
        const landingCenterY = landingRect.top + landingRect.height / 2;
        const targetCenterX = targetRect.left + targetRect.width / 2;
        const targetCenterY = targetRect.top + targetRect.height / 2;

        const scaleX = targetRect.width / landingRect.width;
        const scaleY = targetRect.height / landingRect.height;
        const targetScale = Math.max(0.62, Math.min(1.04, Math.min(scaleX, scaleY)));
        const targetGap = Math.max(72, Math.min(132, targetRect.width * 0.085));
        const pageDrift = Math.max(34, Math.min(78, targetGap * 0.5));

        root.style.setProperty("--catalog-handoff-duration", `${LANDING_OPEN_ANIMATION_MS}ms`);
        const handoffX = targetCenterX - landingCenterX;
        const handoffY = targetCenterY - landingCenterY;

        root.style.setProperty("--catalog-landing-to-viewer-x", `${handoffX}px`);
        root.style.setProperty("--catalog-landing-to-viewer-y", `${handoffY}px`);
        root.style.setProperty("--catalog-landing-to-viewer-scale", targetScale.toFixed(4));

        /* Compatibility for older transition CSS blocks. */
        root.style.setProperty("--catalog-viewer-center-shift-x", `${handoffX}px`);
        root.style.setProperty("--catalog-viewer-center-shift-y", `${handoffY}px`);
        root.style.setProperty("--catalog-viewer-scale", targetScale.toFixed(4));
        root.style.setProperty("--catalog-viewer-gap", `${targetGap.toFixed(1)}px`);
        root.style.setProperty("--catalog-viewer-page-drift", `${pageDrift.toFixed(1)}px`);
        root.style.setProperty("--catalog-viewer-rot-y", "21deg");
        root.style.setProperty("--catalog-viewer-rot-z", "2.1deg");
        root.style.setProperty("--catalog-viewer-width", `${viewerRect.width}px`);
        root.style.setProperty("--catalog-viewer-height", `${viewerRect.height}px`);
    };

    const previousSpreadStartRef = useRef(currentSpreadStart);
    const [viewerTitleDirection, setViewerTitleDirection] = useState("right");

    const enterCatalog = () => {
        if (catalogLandingDone || catalogOpening || !landingWriterFinished) return;

        syncLandingHandoffMetrics();
        setCatalogOpening(true);

        if (landingCloseTimerRef.current) {
            window.clearTimeout(landingCloseTimerRef.current);
        }

        landingCloseTimerRef.current = window.setTimeout(() => {
            setCatalogLandingDone(true);
            setCatalogOpening(false);
        }, LANDING_OPEN_MS);
    };

    const getLetterTracePoints = (letter, rect) => {
        const w = rect.width;
        const h = rect.height;
        const p = (x, y, hold = 1) => ({
            x: rect.left + w * x,
            y: rect.top + h * y,
            hold,
        });

        switch (letter) {
            case "R":
                return [
                    p(0.18, 0.88), p(0.18, 0.14), p(0.62, 0.14), p(0.78, 0.28),
                    p(0.72, 0.44), p(0.20, 0.47), p(0.58, 0.52), p(0.82, 0.88),
                ];
            case "E":
                return [
                    p(0.78, 0.14), p(0.18, 0.14), p(0.18, 0.50), p(0.68, 0.50),
                    p(0.18, 0.50), p(0.18, 0.88), p(0.80, 0.88),
                ];
            case "-":
                return [];
            case "S":
                return [
                    p(0.78, 0.18), p(0.38, 0.12), p(0.18, 0.30), p(0.35, 0.47),
                    p(0.72, 0.52), p(0.82, 0.72), p(0.54, 0.90), p(0.18, 0.78),
                ];
            case "C":
                return [
                    p(0.78, 0.20), p(0.46, 0.12), p(0.18, 0.32), p(0.16, 0.62),
                    p(0.42, 0.88), p(0.78, 0.78),
                ];
            case "H":
                return [
                    p(0.18, 0.14), p(0.18, 0.88), p(0.18, 0.52), p(0.82, 0.52),
                    p(0.82, 0.14), p(0.82, 0.88),
                ];
            case "A":
                return [
                    p(0.14, 0.88), p(0.50, 0.12), p(0.86, 0.88), p(0.68, 0.55),
                    p(0.32, 0.55),
                ];
            case "U":
                return [
                    p(0.18, 0.14), p(0.18, 0.66), p(0.34, 0.88), p(0.66, 0.88),
                    p(0.82, 0.66), p(0.82, 0.14),
                ];
            case "B":
                return [
                    p(0.18, 0.88), p(0.18, 0.14), p(0.62, 0.14), p(0.78, 0.30),
                    p(0.62, 0.48), p(0.18, 0.48), p(0.66, 0.48), p(0.84, 0.68),
                    p(0.64, 0.88), p(0.18, 0.88),
                ];
            default:
                return [p(0.20, 0.80), p(0.80, 0.20)];
        }
    };

    useEffect(() => {
        if (catalogLandingDone || !catalogLandingCharged) return;

        const titleNode = landingTitleRef.current;
        const titleWidth = titleNode?.getBoundingClientRect?.().width ?? 420;
        const revealDelay = 92;
        const startDelay = 260;
        const timers = [];

        setLandingWriterFinished(false);
        setLandingWrittenIndex(-1);
        setLandingWriter({
            x: Math.max(22, titleWidth * 0.03),
            y: 0,
            angle: -10,
            visible: true,
        });

        landingTitleLetters.forEach((_, index) => {
            timers.push(
                window.setTimeout(() => {
                    setLandingWrittenIndex(index);
                }, startDelay + index * revealDelay)
            );
        });

        timers.push(
            window.setTimeout(() => {
                setLandingWrittenIndex(landingTitleLetters.length - 1);
                setLandingWriter({
                    x: titleWidth - Math.max(28, titleWidth * 0.04),
                    y: 0,
                    angle: 0,
                    visible: true,
                });
                setLandingWriterFinished(true);
            }, startDelay + landingTitleLetters.length * revealDelay + 240)
        );

        return () => {
            timers.forEach((timer) => window.clearTimeout(timer));
        };
    }, [catalogLandingCharged, catalogLandingDone, landingTitleLetters]);

    const showToast = (message) => {
        setToast(message);
        if (toastTimerRef.current) {
            window.clearTimeout(toastTimerRef.current);
        }
        toastTimerRef.current = window.setTimeout(() => setToast(""), 1800);
    };

    const forwardWidgetWheelToViewer = (event) => {
        if (!viewerRef.current) return;

        event.preventDefault();
        event.stopPropagation();

        const wheelEvent = new WheelEvent("wheel", {
            deltaX: event.deltaX,
            deltaY: event.deltaY,
            clientX: event.clientX,
            clientY: event.clientY,
            bubbles: true,
            cancelable: true,
        });

        viewerRef.current.dispatchEvent(wheelEvent);
    };

    const tryDetectArticlesFromText = (text) => {
        if (!excelReady || !text?.trim()) return;

        const matches = detectArticlesInText(text, allArticles);
        if (!matches.length) return;

        setSelectionPrompt(matches.slice(0, 8));
    };

    const addDetectedArticle = (article) => {
        setSelectedArticles((prev) => {
            const articleId = article.eanCode || article.id || article.uid;
            if (prev.some((item) => (item.eanCode || item.id) === articleId)) return prev;

            return [
                ...prev,
                {
                    id: article.id || article.uid,
                    label: article.articleName,
                    articleName: article.articleName,
                    eanCode: article.eanCode,
                    brutoVk: article.brutoVk,
                    nettoEk: article.nettoEk,
                    rabatt: article.rabatt,
                    priceUnit: article.priceUnit,
                    nettoGe: article.nettoGe,
                    catalogId: selectedCatalog.id,
                    catalogTitle: selectedCatalog.title,
                },
            ];
        });

        showToast(`Artikel hinzugefügt: ${article.articleName}`);
    };

    const removeArticleFromSelection = (id) => {
        setSelectedArticles((prev) => prev.filter((item) => item.id !== id));
    };

    const clearAllSelectedArticles = () => {
        setSelectedArticles([]);
        showToast("Artikelliste geleert");
    };

    const openQuickArticleAdd = () => {
        setContactModalOpen(true);
        setArticleSearch("");
        setArticleSearchResults([]);
        showToast("Artikelsuche geöffnet");
    };

    const prepareMessage = () => {
        const header = selectedContact
            ? `Ansprechpartner: ${selectedContact.name} (${selectedContact.role}, ${selectedContact.region})`
            : "Ansprechpartner: Noch nicht ausgewählt";

        const articleLines = selectedArticles.length
            ? selectedArticles.map((item) => `- ${item.label} (${item.eanCode || item.id})`).join("\n")
            : "- Noch keine Artikel ausgewählt";

        const body = `${header}

Katalog: ${selectedCatalog.title}

Artikel:
${articleLines}

Notizen:
${notes || "- Keine Notizen"}`;

        navigator.clipboard?.writeText(body).then(
            () => showToast("Nachricht in Zwischenablage kopiert"),
            () => showToast("Nachricht vorbereitet")
        );
    };

    useEffect(() => {
        let mounted = true;

        async function bootExcel() {
            try {
                const data = await loadCatalogExcelData();
                if (!mounted) return;

                setAllArticles(data.articles);
                setExcelReady(true);
            } catch (error) {
                console.error("Excel loading failed:", error);
            }
        }

        bootExcel();

        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        if (!articleSearch.trim()) {
            setArticleSearchResults([]);
            return;
        }

        setArticleSearchResults(searchArticles(articleSearch, allArticles, 16));
    }, [articleSearch, allArticles]);

    useEffect(() => {
        try {
            const storedNotes = localStorage.getItem(NOTES_KEY);
            const storedArticles = localStorage.getItem(ARTICLES_KEY);
            const storedContact = localStorage.getItem(CONTACT_KEY);

            if (storedNotes) setNotes(storedNotes);
            if (storedArticles) setSelectedArticles(JSON.parse(storedArticles));
            if (storedContact) setSelectedContactId(storedContact);
        } catch (err) {
            console.warn("LocalStorage load failed", err);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(NOTES_KEY, notes);
        } catch {}
    }, [notes]);

    useEffect(() => {
        try {
            localStorage.setItem(ARTICLES_KEY, JSON.stringify(selectedArticles));
        } catch {}
    }, [selectedArticles]);

    useEffect(() => {
        try {
            if (selectedContactId) localStorage.setItem(CONTACT_KEY, selectedContactId);
        } catch {}
    }, [selectedContactId]);

    useEffect(() => {
        setNumPages(null);
        setCurrentSpreadStart(1);
        setActiveGroup(selectedCatalog.groups?.[0]?.key ?? null);
        setTurnState(null);
        setCatalogOpening(false);
        setLandingPagesFallbackVisible(false);
        setLandingWrittenIndex(-1);
        setLandingWriterFinished(false);
        setLandingWriter((prev) => ({ ...prev, visible: false }));
        setPageImages({});
        setPreparedPages([]);
        setInitialReady(false);

        if (turnTimerRef.current) {
            window.clearTimeout(turnTimerRef.current);
        }
    }, [selectedCatalog]);

    useEffect(() => {
        const updateHeight = () => {
            if (!viewerRef.current) return;
            const rect = viewerRef.current.getBoundingClientRect();
            const nextHeight = Math.max(420, Math.floor(rect.height - 12));
            setPageHeight(nextHeight);
        };

        updateHeight();
        window.addEventListener("resize", updateHeight);
        return () => window.removeEventListener("resize", updateHeight);
    }, []);

    useEffect(() => {
        return () => {
            if (turnTimerRef.current) window.clearTimeout(turnTimerRef.current);
            if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
            if (landingCloseTimerRef.current) {
                window.clearTimeout(landingCloseTimerRef.current);
            }
            if (landingWriterFrameRef.current) {
                window.cancelAnimationFrame(landingWriterFrameRef.current);
            }
        };
    }, []);

    const handleLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const normalizeSpreadStart = (page) => {
        if (!numPages) {
            return page <= 1 ? 1 : page % 2 === 0 ? page - 1 : page;
        }

        let safe = Math.max(1, Math.min(page, numPages));

        if (safe > 1 && safe % 2 === 0) safe -= 1;
        if (safe === numPages && numPages % 2 === 0) safe = Math.max(1, numPages - 1);

        return safe;
    };

    const getSpreadPages = (start) => {
        const left = start;
        const right = numPages && start + 1 <= numPages ? start + 1 : null;
        return { left, right };
    };

    const syncActiveGroupFromPage = (page) => {
        let current = null;
        for (const group of selectedCatalog.groups) {
            if (page >= group.page) current = group.key;
        }
        setActiveGroup(current);
    };

    const ensurePrepared = (pages) => {
        const validPages = pages.filter(Boolean);
        setPreparedPages((prev) => {
            const next = new Set(prev);
            validPages.forEach((p) => next.add(p));
            return [...next].sort((a, b) => a - b);
        });
    };

    const isSpreadReady = (spread) => {
        return [spread.left, spread.right].filter(Boolean).every((p) => !!pageImages[p]);
    };

    useEffect(() => {
        if (!numPages) return;
        const first = getSpreadPages(1);
        ensurePrepared([first.left, first.right]);
    }, [numPages]);

    useEffect(() => {
        if (!numPages) return;

        const spread = getSpreadPages(currentSpreadStart);
        ensurePrepared([
            spread.left,
            spread.right,
            currentSpreadStart + 2 <= numPages ? currentSpreadStart + 2 : null,
            currentSpreadStart + 3 <= numPages ? currentSpreadStart + 3 : null,
            currentSpreadStart - 2 >= 1 ? currentSpreadStart - 2 : null,
            currentSpreadStart - 1 >= 1 ? currentSpreadStart - 1 : null,
        ]);
    }, [currentSpreadStart, numPages]);

    useEffect(() => {
        if (!numPages) return;
        const first = getSpreadPages(1);
        if (isSpreadReady(first)) setInitialReady(true);
    }, [pageImages, numPages]);

    const rememberRenderedPage = (pageNumber, directSrc = null) => {
        const canvas =
            directSrc
                ? null
                : document.querySelector(`.pdf-render-probe[data-page="${pageNumber}"] canvas`) ||
                document.querySelector(`.pdf-visible-page[data-page="${pageNumber}"] canvas`);

        const src = directSrc || (canvas ? canvas.toDataURL("image/png") : null);
        if (!src) return;

        setPageImages((prev) => {
            if (prev[pageNumber]) return prev;
            return { ...prev, [pageNumber]: src };
        });
    };

    const startTurn = (safe, direction) => {
        setTurnState({
            direction,
            fromStart: currentSpreadStart,
            toStart: safe,
        });

        syncActiveGroupFromPage(safe);

        turnTimerRef.current = window.setTimeout(() => {
            setCurrentSpreadStart(safe);
            setTurnState(null);
        }, TURN_MS);
    };

    const goToSpread = (page, forcedDirection = "") => {
        const safe = normalizeSpreadStart(page);
        if (!numPages || turnState) return;

        if (safe === currentSpreadStart) {
            syncActiveGroupFromPage(safe);
            return;
        }

        const direction = forcedDirection || (safe > currentSpreadStart ? "next" : "prev");
        const targetSpread = getSpreadPages(safe);

        ensurePrepared([targetSpread.left, targetSpread.right]);

        if (isSpreadReady(targetSpread)) {
            startTurn(safe, direction);
            return;
        }

        const waitStart = performance.now();
        const maxWait = 450;

        const checkReady = () => {
            if (isSpreadReady(targetSpread)) {
                startTurn(safe, direction);
                return;
            }

            if (performance.now() - waitStart >= maxWait) {
                startTurn(safe, direction);
                return;
            }

            requestAnimationFrame(checkReady);
        };

        requestAnimationFrame(checkReady);
    };

    const nextSpread = () => {
        if (!numPages || turnState) return;
        goToSpread(currentSpreadStart + 2, "next");
    };

    const prevSpread = () => {
        if (!numPages || turnState) return;
        goToSpread(currentSpreadStart - 2, "prev");
    };

    useEffect(() => {
        const el = viewerRef.current;
        if (!el) return;

        const onWheel = (event) => {
            event.preventDefault();
            if (!numPages || wheelLockRef.current || turnState || !initialReady) return;

            wheelLockRef.current = true;

            if (event.deltaY > 0) nextSpread();
            else if (event.deltaY < 0) prevSpread();

            window.setTimeout(() => {
                wheelLockRef.current = false;
            }, TURN_MS + 40);
        };

        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, [currentSpreadStart, numPages, turnState, initialReady, pageImages]);

    const closeCatalogMagnifier = () => {
        setCatalogMagnifier((current) =>
            current.visible
                ? { ...current, visible: false }
                : current
        );
    };

    const updateCatalogMagnifier = (event, pageNumber) => {
        if (!pageNumber || turnState) {
            closeCatalogMagnifier();
            return;
        }

        const card = event.currentTarget;
        const visualTarget =
            card.querySelector(".pdf-leaf-image") ||
            card.querySelector(".pdf-visible-page canvas") ||
            card.querySelector("canvas") ||
            card.querySelector("img");

        if (!visualTarget) {
            closeCatalogMagnifier();
            return;
        }

        const visualRect = visualTarget.getBoundingClientRect();

        if (!visualRect.width || !visualRect.height) {
            closeCatalogMagnifier();
            return;
        }

        const insideVisual =
            event.clientX >= visualRect.left &&
            event.clientX <= visualRect.right &&
            event.clientY >= visualRect.top &&
            event.clientY <= visualRect.bottom;

        if (!insideVisual) {
            closeCatalogMagnifier();
            return;
        }

        let src = pageImages[pageNumber];

        if (!src && visualTarget.tagName?.toLowerCase?.() === "canvas") {
            try {
                src = visualTarget.toDataURL("image/png");
            } catch {
                src = "";
            }
        }

        if (!src) {
            closeCatalogMagnifier();
            return;
        }

        const relativeX = Math.min(Math.max(event.clientX - visualRect.left, 0), visualRect.width);
        const relativeY = Math.min(Math.max(event.clientY - visualRect.top, 0), visualRect.height);

        const bgX = (relativeX / visualRect.width) * 100;
        const bgY = (relativeY / visualRect.height) * 100;

        const viewerRect = viewerRef.current?.getBoundingClientRect?.();
        const magnifierWidth = 390;
        const magnifierHeight = 280;
        const padding = 14;

        let x = event.clientX + 30;
        let y = event.clientY - magnifierHeight / 2;

        if (viewerRect) {
            if (x + magnifierWidth > viewerRect.right - padding) {
                x = event.clientX - magnifierWidth - 30;
            }

            x = Math.max(viewerRect.left + padding, Math.min(x, viewerRect.right - magnifierWidth - padding));
            y = Math.max(viewerRect.top + padding, Math.min(y, viewerRect.bottom - magnifierHeight - padding));
        }

        setCatalogMagnifier({
            visible: true,
            src,
            x,
            y,
            bgX,
            bgY,
            pageNumber,
        });
    };

    const viewerTitle = useMemo(() => {
        const group = selectedCatalog.groups?.find((item) => item.key === activeGroup);

        if (group?.label) return group.label;

        return selectedCatalog.title || "Re-Schraub Katalog";
    }, [selectedCatalog, activeGroup]);

    const visibleStart = turnState ? turnState.fromStart : currentSpreadStart;
    const visibleSpread = getSpreadPages(visibleStart);
    const incomingSpread = turnState ? getSpreadPages(turnState.toStart) : null;

    useEffect(() => {
        closeCatalogMagnifier();
    }, [currentSpreadStart, selectedCatalogId, turnState]);

    const pageProps = {
        height: pageHeight,
        renderTextLayer: false,
        renderAnnotationLayer: false,
        devicePixelRatio:
            typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 1.35) : 1,
    };

    return (
        <div
            ref={pageRootRef}

            className={`minimal-catalog-page ${catalogLandingDone ? "catalog-is-open" : "catalog-landing-active"}`}

            style={{ "--catalog-handoff-duration": `${LANDING_OPEN_ANIMATION_MS}ms` }}
        >

            {!catalogLandingDone && (
                <PageFlyTitle
                    path="/products"
                    title="Re-Schraub"
                    className="products-landing-fly-title"
                />
            )}
            {!catalogLandingDone && (
                <section

                    className={`products-landing-layer products-landing-layer--whitecinema products-landing-layer--fullscreen-pages ${landingSceneClass} ${catalogLandingCharged ? "is-charged" : ""} ${landingPagesReady ? "is-pages-ready" : ""} ${landingWriterFinished ? "is-title-finished" : ""} ${landingPagesVisible || catalogOpening ? "is-pages-visible" : ""} ${catalogOpening ? "is-opening" : ""}`}
                >
                    <LandingPagePreRenderer
                        pdfFile={selectedCatalog.pdf}
                        pages={[1, 2]}
                        pageImages={pageImages}
                        onCachePage={rememberRenderedPage}
                    />

                    <div className="landing-white-atmosphere" aria-hidden="true">
                        <span className="landing-white-ring ring-a" />
                        <span className="landing-white-ring ring-b" />
                        <span className="landing-white-ring ring-c" />
                    </div>

                    <div className="landing-writing-stage landing-brand-bar" aria-hidden="true">
                        <div className="landing-system-kicker">Re-Schraub Katalog</div>

                        <div className="landing-title-write" ref={landingTitleRef}>
                            <span className="landing-writing-line" />

                            {landingTitleLetters.map((letter, index) => (
                                <span
                                    key={`${letter}-${index}`}
                                    ref={(node) => {
                                        landingLetterRefs.current[index] = node;
                                    }}
                                    className={`landing-write-letter ${letter === "-" ? "is-hyphen" : ""} ${
                                        index <= landingWrittenIndex ? "is-written" : ""
                                    } ${index === landingWrittenIndex ? "is-active" : ""}`}
                                >
                                    {letter}
                                </span>
                            ))}

                            <img
                                src={logo}
                                alt=""
                                className={`landing-write-screw ${landingWriter.visible ? "is-live" : ""} ${
                                    landingWriterFinished ? "is-finished" : ""
                                }`}
                                style={{
                                    "--writer-x": `${landingWriter.x}px`,
                                    "--writer-y": `${landingWriter.y}px`,
                                    "--writer-rot": `${landingWriter.angle}deg`,
                                }}
                                draggable={false}
                            />
                        </div>

                    </div>

                    <div className="landing-white-spread" ref={landingSpreadRef} aria-hidden="true">
                        <div className="landing-page-shell left">
                            <LandingPreviewPage
                                pageNumber={1}
                                src={landingLeftPreview}
                                pdfFile={selectedCatalog.pdf}
                                onCachePage={rememberRenderedPage}
                                fallbackClassName="landing-page-fallback--left"
                            />
                            <span className="landing-page-cinema-mask" />
                        </div>

                        <div className="landing-center-seam">
                            <span className="landing-center-glow" />
                        </div>

                        <div className="landing-page-shell right">
                            <LandingPreviewPage
                                pageNumber={2}
                                src={landingRightPreview}
                                pdfFile={selectedCatalog.pdf}
                                onCachePage={rememberRenderedPage}
                                fallbackClassName="landing-page-fallback--right"
                            />
                            <span className="landing-page-cinema-mask" />
                        </div>
                    </div>

                    <div className="landing-copy-block landing-copy-block--clean">
                        <p>
                            Katalog öffnen, Seiten ruhig prüfen und Artikel direkt für Anfrage oder Notiz vorbereiten.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="products-landing-primary white-catalog-open-button"
                        onClick={enterCatalog}
                        disabled={!landingWriterFinished}
                    >
                        {landingWriterFinished ? "Katalog öffnen" : "Logo wird gezeichnet"}
                        <span>›</span>
                    </button>
                </section>
            )}

            <div
                className={`minimal-catalog-shell ${
                    !catalogLandingDone ? "is-behind-landing" : ""
                } ${catalogOpening ? "is-viewer-building" : ""}`}
                aria-hidden={!catalogLandingDone}
            >
                <aside className="minimal-catalog-sidebar">
                    <div className="minimal-catalog-sidebar-section">
                        <div className="minimal-catalog-section-label">Kataloge</div>

                        <div className="minimal-catalog-list">
                            {catalogs.map((catalog) => (
                                <button
                                    key={catalog.id}
                                    type="button"
                                    className={`minimal-catalog-link ${
                                        selectedCatalog.id === catalog.id ? "active" : ""
                                    }`}
                                    onClick={() => {
                                        if (turnState) return;
                                        setSelectedCatalogId(catalog.id);
                                    }}
                                >
                                    {catalog.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="minimal-catalog-sidebar-section">
                        <div className="minimal-catalog-section-label">Inhaltsverzeichnis</div>

                        <div className="minimal-catalog-group-list">
                            {selectedCatalog.groups.map((group) => (
                                <button
                                    key={group.key}
                                    type="button"
                                    className={`minimal-catalog-group-link ${
                                        activeGroup === group.key ? "active" : ""
                                    }`}
                                    onClick={() =>
                                        goToSpread(
                                            group.page,
                                            group.page > currentSpreadStart ? "next" : "prev"
                                        )
                                    }
                                    disabled={!initialReady}
                                >
                                    <span className="minimal-catalog-group-main">
                                        <span className="minimal-catalog-group-name">
                                            {group.label}
                                        </span>

                                        {activeGroup === group.key && (
                                            <img
                                                src={logo}
                                                alt="RE-Schraub Logo"
                                                className="minimal-catalog-group-logo"
                                            />
                                        )}
                                    </span>

                                    <span className="minimal-catalog-group-page">
                                        Seite {group.page}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                <main className="minimal-catalog-main">
                    <div className="minimal-catalog-viewer-with-bar">
                        {catalogLandingDone && (
                            <CatalogViewerFlyTitle
                                title={viewerTitle}
                                direction={viewerTitleDirection}
                            />
                        )}
                        <div className="minimal-catalog-viewer" ref={viewerRef}>
                            {!initialReady && (
                                <div className="minimal-catalog-initial-loader">
                                    Lade Katalogseiten …
                                </div>
                            )}

                            <div className="minimal-catalog-page-indicator">
                                Seiten {turnState ? turnState.toStart : visibleSpread.left}
                                {(turnState ? incomingSpread?.right : visibleSpread.right)
                                    ? `–${turnState ? incomingSpread.right : visibleSpread.right}`
                                    : ""}{" "}
                                / {numPages || "—"}
                            </div>

                            <Document
                                key={selectedCatalog.id}
                                file={selectedCatalog.pdf}
                                onLoadSuccess={handleLoadSuccess}
                                onLoadError={(err) => console.error("PDF Load Error:", err.message)}
                                loading={<div className="minimal-catalog-loading">Lade PDF …</div>}
                            >
                                <div className="pdf-render-cache" aria-hidden="true">
                                    {preparedPages.map((page) =>
                                        pageImages[page] ? null : (
                                            <div
                                                key={`probe-${page}`}
                                                className="pdf-render-probe"
                                                data-page={page}
                                            >
                                                <Page
                                                    pageNumber={page}
                                                    {...pageProps}
                                                    onRenderSuccess={() => rememberRenderedPage(page)}
                                                />
                                            </div>
                                        )
                                    )}
                                </div>

                                {!turnState && (
                                    <div className="minimal-catalog-spread-stage" ref={viewerSpreadRef}>
                                        <div
                                            className="minimal-catalog-page-card left"
                                            onMouseEnter={(event) => updateCatalogMagnifier(event, visibleSpread.left)}
                                            onMouseMove={(event) => updateCatalogMagnifier(event, visibleSpread.left)}
                                            onMouseLeave={closeCatalogMagnifier}
                                        >
                                            <CachedLeaf
                                                pageNumber={visibleSpread.left}
                                                className="pdf-leaf left"
                                                pageImages={pageImages}
                                                pageProps={pageProps}
                                                onRenderSuccess={rememberRenderedPage}
                                            />
                                        </div>

                                        <div className="minimal-catalog-page-divider" />

                                        <div
                                            className="minimal-catalog-page-card right"
                                            onMouseEnter={(event) => updateCatalogMagnifier(event, visibleSpread.right)}
                                            onMouseMove={(event) => updateCatalogMagnifier(event, visibleSpread.right)}
                                            onMouseLeave={closeCatalogMagnifier}
                                        >
                                            <CachedLeaf
                                                pageNumber={visibleSpread.right}
                                                className="pdf-leaf right"
                                                pageImages={pageImages}
                                                pageProps={pageProps}
                                                onRenderSuccess={rememberRenderedPage}
                                            />
                                        </div>
                                    </div>
                                )}

                                {catalogMagnifier.visible && catalogMagnifier.src && !turnState && (
                                    <div
                                        className="catalog-hover-magnifier catalog-hover-magnifier--precision"
                                        style={{
                                            left: `${catalogMagnifier.x}px`,
                                            top: `${catalogMagnifier.y}px`,
                                            backgroundImage: `url(${catalogMagnifier.src})`,
                                            backgroundPosition: `${catalogMagnifier.bgX}% ${catalogMagnifier.bgY}%`,
                                        }}
                                        aria-hidden="true"
                                    >
                                        <span className="catalog-hover-magnifier-crosshair" />
                                        <span className="catalog-hover-magnifier-label">
                                            Seite {catalogMagnifier.pageNumber}
                                        </span>
                                    </div>
                                )}

                                {initialReady && turnState && incomingSpread && (
                                    <div className={`book-turn-stage ${turnState.direction}`}>
                                        <div className="book-grid-layer z1">
                                            <div className="book-slot left">
                                                <CachedLeaf
                                                    pageNumber={visibleSpread.left}
                                                    className="pdf-leaf left"
                                                    pageImages={pageImages}
                                                    pageProps={pageProps}
                                                    onRenderSuccess={rememberRenderedPage}
                                                />
                                            </div>

                                            <div className="minimal-catalog-page-divider book-divider" />

                                            <div className="book-slot right">
                                                <CachedLeaf
                                                    pageNumber={incomingSpread.right}
                                                    className="pdf-leaf right"
                                                    pageImages={pageImages}
                                                    pageProps={pageProps}
                                                    onRenderSuccess={rememberRenderedPage}
                                                />
                                            </div>
                                        </div>

                                        <div className="book-grid-layer z2">
                                            <div className="book-slot spacer" />
                                            <div className="book-slot spacer divider-space" />
                                            <div className="book-slot right">
                                                <div className="clip-box close-old-right">
                                                    <CachedLeaf
                                                        pageNumber={visibleSpread.right}
                                                        className="pdf-leaf right"
                                                        pageImages={pageImages}
                                                        pageProps={pageProps}
                                                        onRenderSuccess={rememberRenderedPage}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="book-grid-layer z3">
                                            <div className="book-slot spacer" />
                                            <div className="book-slot spacer divider-space" />
                                            <div className="book-slot right">
                                                <div className="clip-box preview-new-left">
                                                    <CachedLeaf
                                                        pageNumber={incomingSpread.left}
                                                        className="pdf-leaf right"
                                                        pageImages={pageImages}
                                                        pageProps={pageProps}
                                                        onRenderSuccess={rememberRenderedPage}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="book-grid-layer z4">
                                            <div className="book-slot left">
                                                <div className="clip-box reveal-new-left">
                                                    <CachedLeaf
                                                        pageNumber={incomingSpread.left}
                                                        className="pdf-leaf left"
                                                        pageImages={pageImages}
                                                        pageProps={pageProps}
                                                        onRenderSuccess={rememberRenderedPage}
                                                    />
                                                </div>
                                            </div>

                                            <div className="book-slot spacer divider-space" />
                                            <div className="book-slot spacer" />
                                        </div>

                                        <div className="book-center-shadow" />
                                    </div>
                                )}
                            </Document>

                            <button
                                type="button"
                                className="catalog-note-toggle"
                                onClick={() => setNoteWidgetOpen((prev) => !prev)}
                                aria-label="Notizblock öffnen"
                            >
                                <NotesOutlineIcon />
                            </button>

                            {noteWidgetOpen && (
                                <div className="floating-note-layer">
                                    <div
                                        className="floating-note-widget"
                                        onWheel={forwardWidgetWheelToViewer}
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="floating-note-header">
                                            <span>Notizblock</span>

                                            <div className="floating-note-header-actions">
                                                <button
                                                    type="button"
                                                    className="floating-note-btn"
                                                    onClick={openQuickArticleAdd}
                                                >
                                                    Artikel suchen
                                                </button>

                                                <button
                                                    type="button"
                                                    className="floating-note-close"
                                                    onClick={() => setNoteWidgetOpen(false)}
                                                    aria-label="Schließen"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </div>

                                        <div className="floating-note-body">
                                            <div className="floating-note-meta">
                                                {selectedArticles.length} Artikel verknüpft
                                            </div>

                                            <textarea
                                                className="floating-note-textarea"
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                onBlur={(e) => tryDetectArticlesFromText(e.target.value)}
                                                placeholder="Kurze Notizen, Fundstellen, Artikel sammeln …"
                                                onWheel={forwardWidgetWheelToViewer}
                                            />

                                            <div className="floating-note-actions">
                                                <button
                                                    type="button"
                                                    className="floating-note-btn"
                                                    onClick={openQuickArticleAdd}
                                                >
                                                    Artikel suchen
                                                </button>

                                                <button
                                                    type="button"
                                                    className="floating-note-btn ghost"
                                                    onClick={() => setNoteWidgetOpen(false)}
                                                >
                                                    Einklappen
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="minimal-catalog-nav minimal-catalog-nav--center">
                                <button
                                    type="button"
                                    className="minimal-catalog-nav-btn minimal-catalog-nav-btn--center"
                                    onClick={prevSpread}
                                    disabled={!initialReady || visibleSpread.left <= 1 || !!turnState}
                                    aria-label="Vorherige Seiten"
                                >
                                    ‹
                                </button>

                                <div className="minimal-catalog-center-screw" aria-hidden="true">
                                    <img src={logo} alt="" className="minimal-catalog-center-screw-image" />
                                </div>

                                <button
                                    type="button"
                                    className="minimal-catalog-nav-btn minimal-catalog-nav-btn--center"
                                    onClick={nextSpread}
                                    disabled={
                                        !initialReady ||
                                        !numPages ||
                                        visibleSpread.left >= numPages - 1 ||
                                        !!turnState
                                    }
                                    aria-label="Nächste Seiten"
                                >
                                    ›
                                </button>
                            </div>

                            {toast && <div className="catalog-toast">{toast}</div>}
                        </div>

                    </div>
                </main>
            </div>

            {contactModalOpen && (
                <div
                    className="catalog-modal-backdrop"
                    onClick={() => setContactModalOpen(false)}
                >
                    <div
                        className="catalog-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="catalog-modal-left">
                            <div className="catalog-modal-title">Kontakt auswählen</div>

                            <div className="contact-list">
                                {demoContacts.map((contact) => {
                                    const initials = contact.name
                                        .split(" ")
                                        .map((part) => part[0])
                                        .join("")
                                        .slice(0, 2);

                                    return (
                                        <button
                                            key={contact.id}
                                            type="button"
                                            className={`contact-card ${
                                                selectedContactId === contact.id ? "active" : ""
                                            }`}
                                            onClick={() => setSelectedContactId(contact.id)}
                                        >
                                            <div className="contact-avatar">{initials}</div>

                                            <div className="contact-copy">
                                                <div className="contact-name">{contact.name}</div>
                                                <div className="contact-meta">
                                                    {contact.role} · {contact.region}
                                                </div>
                                                <div className="contact-phone">{contact.phone}</div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="catalog-modal-right">
                            <div className="catalog-modal-title">Produkte & Notizen</div>

                            <div className="catalog-summary-box">
                                <div className="catalog-summary-line">
                                    <span>Katalog</span>
                                    <strong>{selectedCatalog.title}</strong>
                                </div>
                                <div className="catalog-summary-line">
                                    <span>Kontakt</span>
                                    <strong>
                                        {selectedContact
                                            ? selectedContact.name
                                            : "Noch nicht ausgewählt"}
                                    </strong>
                                </div>
                            </div>

                            <div className="catalog-article-search-box">
                                <input
                                    type="text"
                                    className="catalog-article-search-input"
                                    value={articleSearch}
                                    onChange={(e) => setArticleSearch(e.target.value)}
                                    placeholder="Artikelname oder ID / EAN suchen …"
                                />

                                <div className="catalog-article-search-results">
                                    {!excelReady ? (
                                        <div className="empty-info">Artikeldaten werden geladen …</div>
                                    ) : articleSearch.trim() === "" ? (
                                        <div className="empty-info">
                                            Suche nach Artikelname, EAN-Code oder ID.
                                        </div>
                                    ) : articleSearchResults.length === 0 ? (
                                        <div className="empty-info">Keine passenden Artikel gefunden.</div>
                                    ) : (
                                        articleSearchResults.map((article) => (
                                            <button
                                                key={article.uid}
                                                type="button"
                                                className="catalog-article-result"
                                                onClick={() => addDetectedArticle(article)}
                                            >
                                                <div className="catalog-article-result-copy">
                                                    <div className="catalog-article-result-title">
                                                        {article.articleName}
                                                    </div>
                                                    <div className="catalog-article-result-meta">
                                                        {article.eanCode
                                                            ? `EAN: ${article.eanCode}`
                                                            : `ID: ${article.id}`}
                                                    </div>
                                                </div>

                                                <span className="catalog-article-result-add">+</span>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="selected-products-box">
                                {selectedArticles.length === 0 ? (
                                    <div className="empty-info">
                                        Noch keine Artikel ausgewählt.
                                    </div>
                                ) : (
                                    selectedArticles.map((item) => (
                                        <div key={item.id} className="selected-product-row">
                                            <div className="selected-product-copy">
                                                <div className="selected-product-name">
                                                    {item.label}
                                                </div>
                                                <div className="selected-product-meta">
                                                    {item.eanCode || item.id}
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                className="remove-product-btn"
                                                onClick={() => removeArticleFromSelection(item.id)}
                                            >
                                                Entfernen
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="catalog-modal-actions-inline">
                                <button
                                    type="button"
                                    className="catalog-small-btn"
                                    onClick={openQuickArticleAdd}
                                >
                                    Artikelsuche offen lassen
                                </button>

                                <button
                                    type="button"
                                    className="catalog-small-btn ghost"
                                    onClick={clearAllSelectedArticles}
                                >
                                    Liste leeren
                                </button>
                            </div>

                            <textarea
                                className="catalog-notes-area"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                onBlur={(e) => tryDetectArticlesFromText(e.target.value)}
                                placeholder="Notizen für Anfrage, Rückruf, Angebot oder Produktwunsch …"
                            />

                            <div className="catalog-modal-actions-inline">
                                <button
                                    type="button"
                                    className="catalog-send-btn"
                                    onClick={prepareMessage}
                                >
                                    Nachricht vorbereiten
                                </button>

                                <button
                                    type="button"
                                    className="catalog-small-btn ghost"
                                    onClick={() => {
                                        setContactModalOpen(false);
                                        setNoteWidgetOpen(true);
                                    }}
                                >
                                    Zum kleinen Notizblock
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {selectionPrompt?.length ? (
                <div className="catalog-selection-prompt">
                    <div className="catalog-selection-prompt-title">
                        Erkannte Artikel übernehmen?
                    </div>

                    <div className="catalog-selection-prompt-list">
                        {selectionPrompt.map((article) => (
                            <button
                                key={article.uid}
                                type="button"
                                className="catalog-selection-chip"
                                onClick={() => addDetectedArticle(article)}
                            >
                                {article.articleName}
                            </button>
                        ))}
                    </div>

                    <button
                        type="button"
                        className="catalog-small-btn ghost"
                        onClick={() => setSelectionPrompt(null)}
                    >
                        Schließen
                    </button>
                </div>
            ) : null}
        </div>
    );
}