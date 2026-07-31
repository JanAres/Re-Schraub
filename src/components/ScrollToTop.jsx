// src/components/ScrollToTop.jsx
import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useLayoutEffect(() => {

        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;


        const scrollableElements = Array.from(document.querySelectorAll("*")).filter((el) => {
            const style = getComputedStyle(el);
            return (
                (style.overflowY === "auto" || style.overflowY === "scroll") &&
                el.scrollHeight > el.clientHeight
            );
        });


        scrollableElements.forEach((el) => {
            el.scrollTop = 0;
        });


        console.log(
            "ScrollToTop: Fenster +",
            scrollableElements.length,
            "scrollbare Container auf 0 gesetzt →",
            pathname
        );
    }, [pathname]);

    return null;
}
