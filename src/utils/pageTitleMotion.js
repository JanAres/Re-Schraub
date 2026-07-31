// src/utils/pageTitleMotion.js

export const PAGE_TITLE_EXIT_MS = 520;

export const PAGE_TITLE_ROUTES = [
    "/about-us",
    "/products",
    "/newsletter",
    "/contact",
    "/impressum",
];

export const normalizePagePath = (path) => {
    if (!path || typeof path !== "string") return "/";

    const cleanPath = path
        .split("?")[0]
        .split("#")[0]
        .replace(/\/$/, "");

    return cleanPath || "/";
};

export const getPageTitleDirection = (fromPath, toPath) => {
    const from = PAGE_TITLE_ROUTES.indexOf(normalizePagePath(fromPath));
    const to = PAGE_TITLE_ROUTES.indexOf(normalizePagePath(toPath));

    if (from === -1 || to === -1 || from === to) {
        return "right";
    }

    return to > from ? "right" : "left";
};

export const triggerPageTitleFlyout = (to) => {
    if (typeof window === "undefined") return;

    const from = normalizePagePath(window.location.pathname);
    const target = normalizePagePath(to);
    const direction = getPageTitleDirection(from, target);

    // Wichtig für die nächste Page: sie weiß dadurch, von wo wir kommen.
    window.sessionStorage.setItem("page-title-from-path", from);
    window.sessionStorage.setItem("page-title-to-path", target);
    window.sessionStorage.setItem("page-title-direction", direction);

    window.dispatchEvent(
        new CustomEvent("page-title-flyout", {
            detail: {
                from,
                to: target,
                direction,
            },
        })
    );
};

export const flyTitleAndNavigate = (to, navigate, options = {}) => {
    const target = normalizePagePath(to);
    const delay = Number.isFinite(options.delay)
        ? options.delay
        : PAGE_TITLE_EXIT_MS;

    if (typeof navigate !== "function") {
        if (typeof window !== "undefined") {
            triggerPageTitleFlyout(target);

            window.setTimeout(() => {
                window.location.href = target;
            }, delay);
        }

        return;
    }

    triggerPageTitleFlyout(target);

    window.setTimeout(() => {
        navigate(target);
    }, delay);
};

export default flyTitleAndNavigate;