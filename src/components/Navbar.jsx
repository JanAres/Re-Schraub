import React, { useContext, useEffect, useMemo, useState } from "react";
import { Language } from "../context/LanguageContext";
import "../Navbar.css";
import logo from "../img/RE-Schraub Logo frei-1772x1128-429w.png";
import { useNavigate, NavLink } from "react-router-dom";
import { flyTitleAndNavigate } from "../utils/pageTitleMotion";


function Navbar({ animateBuild = false }) {
    const { t } = useContext(Language);
    const [menuOpen, setMenuOpen] = useState(false);
    const [buildDone, setBuildDone] = useState(!animateBuild);
    const [visibleLettersByItem, setVisibleLettersByItem] = useState([]);

    const toggleMenu = () => setMenuOpen((prev) => !prev);


    const FLASH_NAV_ROUTES = ["/products", "/impressum"];

    const navigate = useNavigate();

    const handleFlyNav = (event, to) => {
        event.preventDefault();
        setMenuOpen(false);
        flyTitleAndNavigate(to, navigate);
    };


    const [flashItems, setFlashItems] = useState([]);

    const handleNavClick = () => {
        setMenuOpen(false);

        // erst kurz leeren, damit die Animation auch bei wiederholtem Klick neu startet
        setFlashItems([]);

        window.setTimeout(() => {
            setFlashItems(FLASH_NAV_ROUTES);
        }, 20);

        window.setTimeout(() => {
            setFlashItems([]);
        }, 650);
    };


    const navItems = useMemo(
        () => [
            { to: "/about-us", label: t("nav.about") },
            { to: "/products", label: t("nav.products") },
            { to: "/newsletter", label: t("nav.newsletter") },
            { to: "/contact", label: t("nav.contact") },
            { to: "/impressum", label: t("nav.stock") },
        ],
        [t]
    );




    useEffect(() => {
        if (!animateBuild) {
            setBuildDone(true);
            setVisibleLettersByItem(navItems.map((item) => item.label.length));
            return;
        }

        setBuildDone(false);
        setVisibleLettersByItem(navItems.map(() => 0));

        const timers = [];
        const itemStarts = navItems.map((_, index) => 420 + index * 310);
        const charStep = 38;

        navItems.forEach((item, itemIndex) => {
            Array.from(item.label).forEach((_, charIndex) => {
                timers.push(
                    setTimeout(() => {
                        setVisibleLettersByItem((prev) => {
                            const next = [...prev];
                            next[itemIndex] = Math.max(next[itemIndex] || 0, charIndex + 1);
                            return next;
                        });
                    }, itemStarts[itemIndex] + charIndex * charStep)
                );
            });
        });

        timers.push(
            setTimeout(() => {
                setBuildDone(true);
            }, 420 + navItems.length * 310 + 380)
        );

        return () => timers.forEach(clearTimeout);
    }, [animateBuild, navItems]);

    return (
        <nav
            className={`navbar ${animateBuild ? "navbar-build-mode" : ""} ${
                buildDone ? "is-built" : ""
            }`}
        >
            <div className="navbar-build-line" aria-hidden="true" />
            {!buildDone && (
                <div className="navbar-build-screw" aria-hidden="true">
                    <img src={logo} alt="" className="navbar-build-screw-image" />
                </div>
            )}

            <button
                className="navbar-toggle"
                onClick={toggleMenu}
                aria-label="Toggle menu"
            >
                ☰
            </button>



            <ul className={menuOpen ? "nav-list is-active" : "nav-list"}>
                {navItems.map((item, itemIndex) => {
                    const visibleCount =
                        visibleLettersByItem[itemIndex] ?? item.label.length;

                    return (
                        <li key={item.to} className="nav-build-item is-visible">
                            <NavLink
                                to={item.to}
                                onClick={(event) => {
                                    handleNavClick();
                                    handleFlyNav(event, item.to);
                                }}
                                className={({ isActive }) =>
                                    `${isActive ? "active" : ""} ${
                                        flashItems.includes(item.to) ? "nav-link-flash" : ""
                                    }`
                                }
                            >                             <span className="nav-build-word" aria-label={item.label}>
                                    {Array.from(item.label).map((char, charIndex) => (
                                        <span
                                            key={`${item.to}-${charIndex}-${char}`}
                                            className={`nav-build-letter ${
                                                visibleCount > charIndex ? "is-visible" : ""
                                            }`}
                                        >
                                            {char}
                                        </span>
                                    ))}
                                </span>
                            </NavLink>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

export default Navbar;