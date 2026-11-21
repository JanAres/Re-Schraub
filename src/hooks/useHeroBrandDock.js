import { useCallback, useLayoutEffect, useRef, useState } from "react";

const WHEEL_GESTURE_GAP_MS = 180;

// One short intro gesture belongs to the brand. Subsequent gestures use the
// page's existing scroller; no body overflow lock or permanent scroll hijack.
export function createHeroBrandDockController({ root, brand, navbar, isMobile, reducedMotion, initialPhase = "hero", onPhase = () => {} }) {
    const target = navbar?.querySelector(".navbar-hero-brand__text");
    if (!root || !brand || !target) return null;

    let phase = initialPhase;
    let flight = null;
    let animation = null;
    let destination = null;
    let disposed = false;
    let lastWheelAt = -Infinity;
    let wheelConsumed = false;
    let settleUntil = 0;
    let touchY = null;
    let touchEligible = false;
    let touchConsumed = false;
    const blockedKeys = new Set();
    const now = () => window.performance.now();
    const scrollTop = () => isMobile ? window.scrollY : root.scrollTop;
    const atTop = () => scrollTop() <= 2;
    const scrollToTop = () => {
        if (isMobile) window.scrollTo({ top: 0, behavior: "auto" });
        else root.scrollTop = 0;
    };
    const setPhase = (next) => {
        phase = next;
        root.dataset.brandDockState = next;
        navbar.dataset.brandDockState = next;
        if (next !== "hero") root.dataset.brandDockStarted = "true";
        onPhase(next);
    };
    const removeFlight = () => {
        if (animation) {
            animation.onfinish = null;
            animation.cancel();
            animation = null;
        }
        flight?.remove();
        flight = null;
    };
    const finish = (next) => {
        removeFlight();
        destination = null;
        settleUntil = now() + 100;
        setPhase(next);
    };
    const transition = (next) => {
        if (disposed || phase === next) return false;
        if (destination) return true;
        const origin = brand.getBoundingClientRect();
        const dock = target.getBoundingClientRect();
        wheelConsumed = true;
        destination = next;

        if (reducedMotion || !brand.animate || !origin.width || !dock.width) {
            finish(next);
            return true;
        }

        const style = window.getComputedStyle(brand);
        flight = brand.cloneNode(true);
        flight.className = "re-brand-flight";
        flight.removeAttribute("id");
        flight.setAttribute("aria-hidden", "true");
        Object.assign(flight.style, {
            left: `${origin.left}px`, top: `${origin.top}px`,
            width: `${origin.width}px`, height: `${origin.height}px`,
            fontFamily: style.fontFamily, fontSize: style.fontSize,
            fontWeight: style.fontWeight, fontStyle: style.fontStyle,
            lineHeight: style.lineHeight, letterSpacing: style.letterSpacing,
        });
        for (const child of flight.querySelectorAll("*")) {
            child.removeAttribute("id");
            Object.assign(child.style, { opacity: "1", transform: "none", transition: "none", color: "inherit" });
        }
        document.body.appendChild(flight);
        const dockTransform = `translate3d(${dock.left - origin.left}px, ${dock.top - origin.top}px, 0) scale(${dock.width / origin.width})`;
        const heroTransform = "translate3d(0, 0, 0) scale(1)";
        setPhase(next === "docked" ? "docking" : "undocking");
        animation = flight.animate([
            { transform: next === "docked" ? heroTransform : dockTransform },
            { transform: next === "docked" ? dockTransform : heroTransform },
        ], { duration: isMobile ? 420 : 580, easing: "cubic-bezier(.22,.61,.36,1)", fill: "forwards" });
        animation.onfinish = () => { if (!disposed) finish(next); };
        return true;
    };
    const isPageGesture = (event) => {
        const element = event.target?.nodeType === 3 ? event.target.parentElement : event.target;
        if (element?.closest?.("input, textarea, select, [contenteditable]:not([contenteditable='false']), [role='dialog'], .nav-list.is-active")) return false;
        if (element !== window && element !== document && element !== document.body && element !== document.documentElement && (!element?.nodeType || (!root.contains(element) && !navbar.contains(element)))) return false;
        // Keep native scrolling inside independent controls and open menus.
        for (let current = element; current && current !== root && current !== navbar && current !== document.body; current = current.parentElement) {
            if (current.nodeType !== 1) continue;
            if (/auto|scroll/.test(window.getComputedStyle(current).overflowY) && current.scrollHeight > current.clientHeight + 1) return false;
        }
        return true;
    };
    const prevent = (event) => { if (event.cancelable) event.preventDefault(); };
    const onWheel = (event) => {
        if (event.defaultPrevented || event.ctrlKey || event.metaKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX) || !isPageGesture(event)) return;
        const time = now();
        const fresh = time - lastWheelAt >= WHEEL_GESTURE_GAP_MS;
        lastWheelAt = time;
        if (destination) { prevent(event); return; }
        if (!atTop()) return;
        if (wheelConsumed && (!fresh || time < settleUntil)) { prevent(event); return; }
        wheelConsumed = false;
        if (phase === "hero" && event.deltaY > 0) {
            prevent(event);
            transition("docked");
        } else if (phase === "docked") {
            if (event.deltaY < 0) {
                prevent(event);
                if (fresh && time >= settleUntil) transition("hero");
            }
        }
    };
    const keyDirection = (event) => {
        if (["ArrowDown", "PageDown", "End"].includes(event.key)) return 1;
        if (["ArrowUp", "PageUp", "Home"].includes(event.key)) return -1;
        if (event.key === " ") return event.shiftKey ? -1 : 1;
        return 0;
    };
    const onKeyDown = (event) => {
        const direction = keyDirection(event);
        if (!direction || event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || !isPageGesture(event)) return;
        if (event.key === " " && event.target?.closest?.("button, [role='button']")) return;
        if (destination || (blockedKeys.has(event.code) && event.repeat)) {
            blockedKeys.add(event.code);
            prevent(event);
            return;
        }
        if (atTop() && ((phase === "hero" && direction > 0) || (phase === "docked" && direction < 0))) {
            prevent(event);
            if (!event.repeat) {
                blockedKeys.add(event.code);
                transition(direction > 0 ? "docked" : "hero");
            }
            return;
        }
        // A desktop page has an inner scroller even when focus is on the body.
        if (!isMobile && phase === "docked") {
            prevent(event);
            const distance = event.key.startsWith("Arrow") ? 56 : root.clientHeight * .9;
            const top = event.key === "Home" ? 0 : event.key === "End" ? root.scrollHeight : scrollTop() + direction * distance;
            root.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
        }
    };
    const onKeyUp = (event) => blockedKeys.delete(event.code);
    const onBlur = () => blockedKeys.clear();
    const onTouchStart = (event) => {
        touchEligible = event.touches.length === 1 && isPageGesture(event);
        touchY = touchEligible ? event.touches[0].clientY : null;
        touchConsumed = false;
    };
    const onTouchMove = (event) => {
        if (!touchEligible || event.touches.length !== 1 || touchY === null) return;
        if (touchConsumed || destination) { touchConsumed = true; prevent(event); return; }
        const delta = touchY - event.touches[0].clientY;
        if (!atTop() || Math.abs(delta) < 8) return;
        if ((phase === "hero" && delta > 0) || (phase === "docked" && delta < 0)) {
            prevent(event);
            touchConsumed = true;
            transition(delta > 0 ? "docked" : "hero");
        }
    };
    const onTouchEnd = () => { touchY = null; touchEligible = false; touchConsumed = false; };
    const onScroll = () => {
        if (scrollTop() <= 2 || (phase === "docked" && !destination)) return;
        // Also stage a scrollbar drag or browser-generated scroll at the intro.
        scrollToTop();
        if (phase === "hero") transition("docked");
    };
    const onFocusIn = (event) => {
        // Tab navigation may reveal a story/footer link before the intro gesture.
        // Let the browser keep that focused control onscreen instead of resetting.
        if (event.target !== root && !event.target.closest?.(".hero-screen") && (phase !== "docked" || destination)) finish("docked");
    };
    const onResize = () => { if (destination) finish(destination); };
    const reset = () => {
        scrollToTop();
        if (destination) finish("docked");
        transition("hero");
    };

    setPhase(scrollTop() > 2 || initialPhase === "docked" || initialPhase === "docking" ? "docked" : "hero");
    const scroller = isMobile ? window : root;
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
    window.addEventListener("re-brand-reset", reset);
    scroller.addEventListener("scroll", onScroll, { passive: true });
    root.addEventListener("focusin", onFocusIn);

    return {
        dock: () => transition("docked"),
        destroy() {
            disposed = true;
            removeFlight();
            window.removeEventListener("wheel", onWheel);
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
            window.removeEventListener("blur", onBlur);
            window.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchEnd);
            window.removeEventListener("touchcancel", onTouchEnd);
            window.removeEventListener("resize", onResize);
            window.visualViewport?.removeEventListener("resize", onResize);
            window.removeEventListener("re-brand-reset", reset);
            scroller.removeEventListener("scroll", onScroll);
            root.removeEventListener("focusin", onFocusIn);
            delete root.dataset.brandDockState;
            delete root.dataset.brandDockStarted;
            delete navbar.dataset.brandDockState;
        },
    };
}

export default function useHeroBrandDock({ experienceRef, brandRef, isMobile, reducedMotion }) {
    const [phase, setPhase] = useState("hero");
    const phaseRef = useRef("hero");
    const controllerRef = useRef(null);
    useLayoutEffect(() => {
        const controller = createHeroBrandDockController({
            root: experienceRef.current, brand: brandRef.current,
            navbar: document.querySelector(".app-container--about > .navbar"),
            isMobile, reducedMotion, initialPhase: phaseRef.current,
            onPhase(next) { phaseRef.current = next; setPhase(next); },
        });
        controllerRef.current = controller;
        return () => { controller?.destroy(); controllerRef.current = null; };
    }, [experienceRef, brandRef, isMobile, reducedMotion]);
    const dockBrand = useCallback(() => controllerRef.current?.dock() || false, []);
    return { phase, dockBrand };
}
