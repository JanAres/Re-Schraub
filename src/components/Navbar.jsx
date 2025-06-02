// src/components/Navbar.jsx
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Language } from "../context/LanguageContext";
import "../Navbar.css";

function Navbar() {
    const { t } = useContext(Language);

    return (
        <nav className="navbar">
            <ul className="nav-list">
                <li>
                    <NavLink to="/">{t("nav.home")}</NavLink>
                </li>
                <li>
                    <NavLink to="/products">{t("nav.products")}</NavLink>
                </li>
                <li>
                    <NavLink to="/about-us">{t("nav.about")}</NavLink>
                </li>
                <li>
                    <NavLink to="/news">{t("nav.news")}</NavLink>
                </li>
                <li>
                    <NavLink to="/impressum">{t("nav.stock")}</NavLink>
                </li>
                <li>
                    <NavLink to="/contact">{t("nav.contact")}</NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
