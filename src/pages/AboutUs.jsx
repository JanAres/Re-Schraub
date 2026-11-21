import React, { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import useIsMobile from "../components/useIsMobile";
import useHeroBrandDock from "../hooks/useHeroBrandDock";
import AnimatedLineIcon from "../components/AnimatedLineIcon";
import "../AboutUs.css";

import logo from "../img/RE-Schraub Logo frei-1772x1128-429w.png";

const getStoredPageEnterDirection = () => {
    if (typeof window === "undefined") return "from-left";

    const stored = window.sessionStorage.getItem("page-title-enter-direction");
    return stored === "from-right" ? "from-right" : "from-left";
};

const GROUP_SHOWCASE = [
    {
        key: "roof",
        label: "Dach, Wand & Fassade",
        useCases: [
            { label: "Dachmontage", icon: "roof" },
            { label: "Fassadenprofil", icon: "facade" },
            { label: "Außenwand-Befestigung", icon: "wallFix" },
            { label: "Blechanschluss", icon: "sheet" },
            { label: "Wetterschutz", icon: "shield" },
        ],
    },
    {
        key: "anchor",
        label: "Dübel",
        useCases: [
            { label: "Beton", icon: "anchorBolt" },
            { label: "Hohlwand", icon: "hollowWall" },
            { label: "Rahmen", icon: "frameFix" },
            { label: "Leichte Lasten", icon: "lightFix" },
            { label: "Rohr-/Kabelhalter", icon: "cableFix" },
        ],
    },
    {
        key: "garden",
        label: "Garten & Landschaftsbau",
        useCases: [
            { label: "Zaunbau", icon: "fence" },
            { label: "Pergola", icon: "pergola" },
            { label: "Pflasterkante", icon: "paving" },
            { label: "Außenholzbau", icon: "outdoorWood" },
            { label: "Beeteinfassung", icon: "edging" },
        ],
    },
    {
        key: "terrace",
        label: "Terrassen Zubehör",
        useCases: [
            { label: "Dielenmontage", icon: "deckBoard" },
            { label: "Abstandhalter", icon: "spacer" },
            { label: "Unterkonstruktion", icon: "subframe" },
            { label: "Clip-System", icon: "clipFix" },
            { label: "Stelzlager", icon: "pedestal" },
        ],
    },
    {
        key: "nails",
        label: "Nägel & Stifte",
        useCases: [
            { label: "Holzleisten", icon: "nail" },
            { label: "Schnellfixierung", icon: "pin" },
            { label: "Beschilderung", icon: "signPin" },
            { label: "Feinmontage", icon: "trim" },
            { label: "Leichtbau", icon: "lightFasten" },
        ],
    },
    {
        key: "standard",
        label: "Normteile",
        useCases: [
            { label: "Schraubverbindung", icon: "bolt" },
            { label: "Mutter", icon: "nut" },
            { label: "Scheibe", icon: "washer" },
            { label: "Gewinde", icon: "thread" },
            { label: "Normkomponente", icon: "standardPart" },
        ],
    },
    {
        key: "chipboard",
        label: "Spanplattenschrauben",
        useCases: [
            { label: "Möbelbau", icon: "cabinet" },
            { label: "Holzwerkstoff", icon: "woodPanel" },
            { label: "Beschläge", icon: "hinge" },
            { label: "Regalsystem", icon: "shelf" },
            { label: "Holz-Holz", icon: "woodJoin" },
        ],
    },
    {
        key: "tools",
        label: "Werkzeugzubehör",
        useCases: [
            { label: "Bit", icon: "bit" },
            { label: "Bohrer", icon: "drill" },
            { label: "Senker", icon: "countersink" },
            { label: "Stecknuss", icon: "socket" },
            { label: "Sägeblatt", icon: "saw" },
        ],
    },
    {
        key: "drywall",
        label: "Trockenbau",
        useCases: [
            { label: "Gipskarton", icon: "drywall" },
            { label: "Profil", icon: "profile" },
            { label: "Abhängung", icon: "hanger" },
            { label: "Fuge", icon: "joint" },
            { label: "Akustikwand", icon: "acoustic" },
        ],
    },
];

const HERO_SCREW_ICONS = [
    "/img/aboutus-screws/02-screw_black_universal.png",
    "/img/aboutus-screws/03-screw_dark_spengler.png",
    "/img/aboutus-screws/04-screw_copper_din7995.png",
    "/img/aboutus-screws/10-screw_black_drill.png",
    "/img/aboutus-screws/11-screw_black_hex.png",
    "/img/aboutus-screws/13-screw_facade_light.png",
    "/img/aboutus-screws/17-screw_gold_long.png",
    "/img/aboutus-screws/21-screw_sheet_purple.png",
    "/img/aboutus-screws/22-screw_black_short.png",
    "/img/aboutus-screws/23-screw_black_long.png",
    "/img/aboutus-screws/25-screw_masonry.png",
    "/img/aboutus-screws/26-screw_refix_copper.png",
    "/img/aboutus-screws/28-screw_nailpin.png",
    "/img/aboutus-screws/29-dowel_nylon.png",
    "/img/aboutus-screws/33-screw_preassembled.png",
    "/img/aboutus-screws/39-steel_anchor.png",
    "/img/aboutus-screws/43-post_screw_blue.png",
    "/img/aboutus-screws/45-fitting_screw.png",
    "/img/aboutus-screws/46-angleconnector_silver.png",
    "/img/aboutus-screws/49-cap_screw_copper.png",
];



function AnimatedStoryText({ text = "", delay = 0 }) {
    const chars = Array.from(text);

    return (
        <p className="story-letter-text" style={{ "--story-text-delay": `${delay}ms` }}>
            {chars.map((char, index) => (
                <span
                    key={`${char}-${index}`}
                    className={char === " " ? "story-letter story-letter--space" : "story-letter"}
                    style={{ "--letter-index": index }}
                >
                    {char === " " ? "\u00A0" : char}
                </span>
            ))}
        </p>
    );
}

function AboutUs({ footer = null, companyCard = null }) {
    const location = useLocation();
    const experienceRef = useRef(null);
    const storyRef = useRef(null);
    const brandRef = useRef(null);
    const isMobile = useIsMobile(900);
    const [reducedMotion, setReducedMotion] = useState(() =>
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
    const { dockBrand } = useHeroBrandDock({ experienceRef, brandRef, isMobile, reducedMotion });

    useEffect(() => {
        const query = window.matchMedia("(prefers-reduced-motion: reduce)");
        const update = () => setReducedMotion(query.matches);
        query.addEventListener("change", update);
        return () => query.removeEventListener("change", update);
    }, []);

    const brand = useMemo(() => Array.from("RE-Schraub"), []);

    const screwRows = useMemo(
        () => [
            HERO_SCREW_ICONS.slice(0, 10),
            HERO_SCREW_ICONS.slice(10),
        ],
        []
    );

    const [visibleLetters, setVisibleLetters] = useState(0);
    const [brandGlow, setBrandGlow] = useState(false);
    const [brandBlue, setBrandBlue] = useState(false);
    const [heroScrewDropped, setHeroScrewDropped] = useState(false);

    const [visibleGroups, setVisibleGroups] = useState(0);
    const [visibleGroupSlide, setVisibleGroupSlide] = useState(0);
    const [groupSlideAnimating, setGroupSlideAnimating] = useState(false);
    const [groupIconIndices, setGroupIconIndices] = useState(() =>
        GROUP_SHOWCASE.map(() => 0)
    );

    const [showScrollButton, setShowScrollButton] = useState(false);
    const [chargeScrollButton, setChargeScrollButton] = useState(false);

    const [storyStarted, setStoryStarted] = useState(false);
    const [storyTitleVisible, setStoryTitleVisible] = useState(false);
    const [storyPulse, setStoryPulse] = useState(false);
    const [storyTitleText, setStoryTitleText] = useState("RE-Schraub");
    const [storyTitlePhase, setStoryTitlePhase] = useState("idle");

    const storyTitleTimersRef = useRef([]);
    const lastScrollTopRef = useRef(0);
    const pageEnterDirectionRef = useRef(getStoredPageEnterDirection());

    const heroInfoItems = [
        {
            id: 1,
            title: "Unser Anspruch",
            text:
                "Qualität, Flexibilität und Kundennähe stehen bei uns im Mittelpunkt. Wir entwickeln unsere Schrauben mit Blick auf die Anforderungen der Praxis",
        },
        {
            id: 2,
            title: "Innovation & Weiterentwicklung",
            text:
                "Mit modernen Fertigungsmethoden, umfangreichem Lagerbestand und einer partnerschaftlichen Zusammenarbeit mit dem Fachhandel schaffen wir täglich Lösungen, die halten, was sie versprechen.",
        },
        {
            id: 3,
            title: "Ihre Ansprechpartner",
            text:
                "Unser engagiertes Team steht Ihnen bei allen Fragen zur Seite – ob telefonisch, per E-Mail, direkt vor Ort oder über unser Formular.",
        },
    ];

    const HEADLINE_FLY_DURATION_MS = 620;
    const TEXT_START_AFTER_HEADLINE_MS = 360;
    const LETTER_STEP_MS = 14;
    const BLOCK_GAP_MS = 360;

    const blockStartDelays = heroInfoItems.reduce((acc, item, index) => {
        if (index === 0) {
            acc.push(0);
            return acc;
        }

        const prevItem = heroInfoItems[index - 1];
        const prevStart = acc[index - 1];
        const prevDuration =
            HEADLINE_FLY_DURATION_MS +
            TEXT_START_AFTER_HEADLINE_MS +
            prevItem.text.length * LETTER_STEP_MS +
            BLOCK_GAP_MS;

        acc.push(prevStart + prevDuration);
        return acc;
    }, []);


    const groupSlides = useMemo(() => {
        const chunkSize = 3;
        const slides = [];

        for (let i = 0; i < GROUP_SHOWCASE.length; i += chunkSize) {
            slides.push(GROUP_SHOWCASE.slice(i, i + chunkSize));
        }

        return slides;
    }, []);

    const renderGroupRevealText = (text, groupIndex) => {
        return (
            <span className="hero-group-name-text" aria-label={text}>
                {Array.from(text).map((char, index) => (
                    <span
                        key={`${groupIndex}-${index}-${char}`}
                        className={`hero-group-letter ${
                            visibleGroups > groupIndex ? "is-visible" : ""
                        } ${char === " " ? "is-space" : ""}`}
                        style={{ transitionDelay: `${index * 0.014}s` }}
                    >
                        {char === " " ? "\u00A0" : char}
                    </span>
                ))}
            </span>
        );
    };

    useEffect(() => {
        let cancelled = false;
        const timers = [];

        const buildDuration = 2250;
        const brandStart = 260;
        const brandStep = 170;
        const totalBrandDuration = brandStart + brand.length * brandStep;
        const screwDropTime = Math.max(buildDuration, totalBrandDuration) + 860;

        brand.forEach((_, index) => {
            timers.push(
                setTimeout(() => {
                    if (!cancelled) setVisibleLetters(index + 1);
                }, brandStart + index * brandStep)
            );
        });

        GROUP_SHOWCASE.forEach((_, index) => {
            timers.push(
                setTimeout(() => {
                    if (!cancelled) setVisibleGroups(index + 1);
                }, 420 + index * 180)
            );
        });

        timers.push(
            setTimeout(
                () => !cancelled && setBrandGlow(true),
                Math.max(buildDuration, totalBrandDuration) + 120
            )
        );

        timers.push(
            setTimeout(() => {
                if (!cancelled) {
                    setBrandGlow(false);
                    setBrandBlue(true);
                }
            }, Math.max(buildDuration, totalBrandDuration) + 760)
        );

        timers.push(
            setTimeout(() => !cancelled && setHeroScrewDropped(true), screwDropTime)
        );

        timers.push(
            setTimeout(() => !cancelled && setBrandGlow(true), screwDropTime + 820)
        );

        timers.push(
            setTimeout(() => !cancelled && setBrandGlow(false), screwDropTime + 1380)
        );

        timers.push(
            setTimeout(
                () => !cancelled && setShowScrollButton(true),
                Math.max(buildDuration, totalBrandDuration) + 1000
            )
        );

        timers.push(
            setTimeout(
                () => !cancelled && setChargeScrollButton(true),
                Math.max(buildDuration, totalBrandDuration) + 1200
            )
        );

        return () => {
            cancelled = true;
            timers.forEach(clearTimeout);
        };
    }, [brand]);

    useEffect(() => {
        const interval = setInterval(() => {
            setGroupSlideAnimating(true);

            setTimeout(() => {
                setVisibleGroupSlide((prev) => (prev + 1) % groupSlides.length);
                setGroupSlideAnimating(false);
            }, 260);
        }, 2000);

        return () => clearInterval(interval);
    }, [groupSlides.length]);

    useEffect(() => {
        const interval = setInterval(() => {
            setGroupIconIndices((prev) =>
                prev.map((value, index) => {
                    const length = GROUP_SHOWCASE[index]?.useCases?.length || 1;
                    return (value + 1) % length;
                })
            );
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        pageEnterDirectionRef.current = getStoredPageEnterDirection();
    }, [location.pathname]);

    const clearStoryTitleTimers = () => {
        storyTitleTimersRef.current.forEach(window.clearTimeout);
        storyTitleTimersRef.current = [];
    };

    const showStoryTitle = (text, enterDirection = "from-left") => {
        clearStoryTitleTimers();
        setStoryTitleText(text);
        setStoryTitlePhase(enterDirection === "from-right" ? "enter-right" : "enter-left");

        storyTitleTimersRef.current.push(
            window.setTimeout(() => setStoryTitlePhase("visible"), 40)
        );
    };

    const swapStoryTitle = (nextText, navDirection = "next") => {
        clearStoryTitleTimers();

        const isNext = navDirection === "next";
        setStoryTitlePhase(isNext ? "exit-right" : "exit-left");

        storyTitleTimersRef.current.push(
            window.setTimeout(() => {
                setStoryTitleText(nextText);
                setStoryTitlePhase(isNext ? "enter-left" : "enter-right");
            }, 460)
        );

        storyTitleTimersRef.current.push(
            window.setTimeout(() => setStoryTitlePhase("visible"), 520)
        );
    };

    useEffect(() => {
        const rootNode = experienceRef.current;
        const storyNode = storyRef.current;

        if (!rootNode || !storyNode) return;

        let timers = [];
        let isStoryRunning = false;

        const resetStory = () => {
            timers.forEach(clearTimeout);
            timers = [];
            isStoryRunning = false;
            clearStoryTitleTimers();

            setStoryStarted(false);
            setStoryTitleVisible(false);
            setStoryPulse(false);
            setStoryTitleText("RE-Schraub");
            setStoryTitlePhase("idle");
        };

        const startStory = (direction = "next") => {
            if (isStoryRunning) return;
            isStoryRunning = true;

            setStoryStarted(true);
            showStoryTitle("RE-Schraub", direction === "prev" ? "from-right" : pageEnterDirectionRef.current);
            timers.push(setTimeout(() => swapStoryTitle("Über Uns", direction), 860));
            timers.push(setTimeout(() => setStoryTitleVisible(true), 1400));
            timers.push(setTimeout(() => setStoryPulse(true), 3400));
        };

        const checkStoryVisibility = () => {
            const rootRect = rootNode.getBoundingClientRect();
            const storyRect = storyNode.getBoundingClientRect();
            const containerTop = isMobile ? 56 : rootRect.top;
            const containerBottom = isMobile ? window.innerHeight : rootRect.bottom;
            const visiblePx = Math.min(containerBottom, storyRect.bottom) - Math.max(containerTop, storyRect.top);
            const visibleRatio = Math.max(0, visiblePx) / Math.max(1, Math.min(storyRect.height, containerBottom - containerTop));

            const currentScrollTop = isMobile ? window.scrollY : rootNode.scrollTop;
            const direction = currentScrollTop >= lastScrollTopRef.current ? "next" : "prev";
            lastScrollTopRef.current = currentScrollTop;

            if (visibleRatio >= 0.42) {
                startStory(direction);
            } else if (visibleRatio <= 0.15) {
                resetStory();
            }
        };

        checkStoryVisibility();

        const scroller = isMobile ? window : rootNode;
        scroller.addEventListener("scroll", checkStoryVisibility, { passive: true });
        window.addEventListener("resize", checkStoryVisibility);

        return () => {
            scroller.removeEventListener("scroll", checkStoryVisibility);
            window.removeEventListener("resize", checkStoryVisibility);
            timers.forEach(clearTimeout);
            clearStoryTitleTimers();
        };
    }, [isMobile]);

    const scrollToStory = () => {
        if (dockBrand()) return;
        const rootNode = experienceRef.current;
        const storyNode = storyRef.current;

        if (!rootNode || !storyNode) return;

        if (isMobile) {
            const navbarHeight = document.querySelector(".navbar")?.getBoundingClientRect().height || 56;
            window.scrollTo({ top: storyNode.getBoundingClientRect().top + window.scrollY - navbarHeight, behavior: reducedMotion ? "auto" : "smooth" });
        } else {
            rootNode.scrollTo({ top: storyNode.getBoundingClientRect().top - rootNode.getBoundingClientRect().top + rootNode.scrollTop, behavior: reducedMotion ? "auto" : "smooth" });
        }
    };

    return (
        <div ref={experienceRef} className="about-experience">

            <section className="about-screen hero-screen">
                <div className="hero-center">
                    <div className={`hero-falling-screw ${heroScrewDropped ? "is-dropped" : ""}`}>
                        <img src={logo} alt="" className="hero-falling-screw-image" />
                    </div>

                    <h1
                        ref={brandRef}
                        className={`hero-brand ${brandGlow ? "is-glow" : ""} ${
                            brandBlue ? "is-blue" : ""
                        }`}
                    >
                        {brand.map((letter, index) => (
                            <span
                                key={`${letter}-${index}`}
                                className={`hero-letter ${visibleLetters > index ? "is-visible" : ""}`}
                            >
                                {letter}
                            </span>
                        ))}
                    </h1>

                    <div className="about-screw-showcase" aria-label="Produkt-Schrauben-Showcase">
                        {screwRows.map((row, rowIndex) => {
                            const repeatedRow = [...row, ...row];

                            return (
                                <div
                                    key={`screw-row-${rowIndex}`}
                                    className={`about-screw-marquee about-screw-marquee--${rowIndex + 1}`}
                                >
                                    <div className="about-screw-marquee-fade about-screw-marquee-fade--left" />
                                    <div className="about-screw-marquee-fade about-screw-marquee-fade--right" />

                                    <div className="about-screw-track">
                                        {repeatedRow.map((src, index) => (
                                            <div
                                                key={`${rowIndex}-${index}-${src}`}
                                                className="about-screw-item"
                                                style={{
                                                    ["--screw-tilt"]: `${((index % 5) - 2) * 5}deg`,
                                                    ["--screw-float-delay"]: `${(index % 7) * 0.22}s`,
                                                    ["--screw-scale"]: `${0.88 + (index % 4) * 0.08}`,
                                                }}
                                            >
                                                <img src={src} alt="RE-Schraub Produkt" className="about-screw-image" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>


                    <button
                        type="button"
                        className={`scroll-outline-button ${
                            showScrollButton ? "is-visible" : ""
                        } ${chargeScrollButton ? "is-charged" : ""}`}
                        onClick={scrollToStory}
                        aria-label="Titel verkleinern und anschließend weiterlesen"
                    >
                        <span className="scroll-circle">
                            <span className="scroll-arrow" />
                        </span>
                    </button>
                </div>
            </section>

            <section className="about-screen story-screen" ref={storyRef}>
                <div
                    className={`story-stage ${storyStarted ? "is-started" : ""} ${
                        storyPulse ? "is-pulsed" : ""
                    }`}
                >
                    <div className="story-top-zone">
                        <div className="story-horizontal-trail"/>
                        <div className="story-vertical-trail"/>

                        <div className="story-runner">
                            <img src={logo} alt="" className="story-runner-logo"/>
                        </div>

                        <div
                            className={`story-title-wrap story-title-motion story-title-motion--${storyTitlePhase}`}
                            aria-live="polite"
                        >
                            <h2 className="story-title">{storyTitleText}</h2>
                        </div>

                        <div className={`story-info-row ${storyTitleVisible ? "is-visible" : ""}`}>
                            {heroInfoItems.map((item, index) => (
                                <div key={item.id} className="story-info-item">
                                    <h3
                                        className="story-info-headline story-info-headline--static"
                                        data-text={item.title}
                                        style={{ "--headline-delay": `${blockStartDelays[index]}ms` }}
                                    >
                                        {item.title}
                                    </h3>

                                    <div className="story-info-text is-open story-info-text--always-open">
                                        <AnimatedStoryText text={item.text} delay={blockStartDelays[index] + TEXT_START_AFTER_HEADLINE_MS} />

                                        {item.id === 3 && (
                                            <NavLink
                                                to="/contact"
                                                className="story-info-contact-link"
                                                style={{
                                                    "--contact-link-delay": `${
                                                        blockStartDelays[index] +
                                                        TEXT_START_AFTER_HEADLINE_MS +
                                                        item.text.length * LETTER_STEP_MS +
                                                        180
                                                    }ms`,
                                                }}
                                            >
                                                Kontakt
                                            </NavLink>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            {companyCard}
            {footer}
        </div>
    );
}

export default AboutUs;