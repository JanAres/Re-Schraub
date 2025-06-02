// src/components/ScrollToTop.jsx
import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useLayoutEffect(() => {
        // 1) Falls das Fenster selbst (window) scrollt:
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0; // manche Browser nutzen html.scrollTop
        document.body.scrollTop = 0;            // manche nutzen body.scrollTop

        // 2) Finde alle Elemente, die overflowY == "auto" oder "scroll" haben
        //    und denen auch wirklich Inhalt zum Scrollen fehlt/hat:
        const scrollableElements = Array.from(document.querySelectorAll("*")).filter((el) => {
            const style = getComputedStyle(el);
            return (
                (style.overflowY === "auto" || style.overflowY === "scroll") &&
                el.scrollHeight > el.clientHeight
            );
        });

        // 3) Setze für jedes gefundene Element scrollTop = 0
        scrollableElements.forEach((el) => {
            el.scrollTop = 0;
        });

        // Debug-Log (kann man später rausnehmen):
        console.log(
            "ScrollToTop: Fenster +",
            scrollableElements.length,
            "scrollbare Container auf 0 gesetzt →",
            pathname
        );
    }, [pathname]);

    return null;
}
