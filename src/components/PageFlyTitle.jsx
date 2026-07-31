import React, { useEffect, useState } from "react";
import "./PageFlyTitle.css";
import { getPageTitleDirection, normalizePagePath } from "../utils/pageTitleMotion";

export default function PageFlyTitle({
                                         path,
                                         title,
                                         className = "",
                                     }) {
    const currentPath = normalizePagePath(path || window.location.pathname);
    const [phase, setPhase] = useState("enter-left");

    useEffect(() => {
        const storedFrom = normalizePagePath(
            window.sessionStorage.getItem("page-title-from-path") || ""
        );

        const storedTo = normalizePagePath(
            window.sessionStorage.getItem("page-title-to-path") || ""
        );

        const storedDirection = window.sessionStorage.getItem("page-title-direction");

        let direction = "right";

        if (storedTo === currentPath && storedDirection) {
            direction = storedDirection;
        } else if (storedFrom && storedFrom !== currentPath) {
            direction = getPageTitleDirection(storedFrom, currentPath);
        }

        const enterPhase = direction === "right" ? "enter-left" : "enter-right";

        setPhase(enterPhase);

        const visibleTimer = window.setTimeout(() => {
            setPhase("visible");
        }, 40);

        const handleExit = (event) => {
            const nextPath = normalizePagePath(event.detail?.to || "");
            const exitDirection =
                event.detail?.direction || getPageTitleDirection(currentPath, nextPath);

            setPhase(exitDirection === "right" ? "exit-right" : "exit-left");
        };

        window.addEventListener("page-title-flyout", handleExit);

        return () => {
            window.clearTimeout(visibleTimer);
            window.removeEventListener("page-title-flyout", handleExit);
        };
    }, [currentPath]);

    if (!title) return null;

    return (
        <div className={`page-fly-title ${className} page-fly-title--${phase}`}>
            <h1 className="page-fly-title__text">{title}</h1>
        </div>
    );
}