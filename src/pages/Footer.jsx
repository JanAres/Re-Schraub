// src/pages/Footer.jsx
import React from "react";
import "../Footer.css";
import logo from "../img/RE-Schraub Logo frei-1772x1128-429w.png";

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-content">
                <div className="footer-left">
                    <div className="footer-logo-row">
                        <img
                            src={logo}
                            alt="RE-Schraub Logo"
                            className="footer-logo-img"
                        />
                        <h4 className="footer-company">RE-Schraub GmbH</h4>
                    </div>
                    <div className="footer-address">
                        <p>Auerstr. 2</p>
                        <p>45663 Recklinghausen</p>
                    </div>
                </div>

                <div className="footer-right">
                    <p>Telefon: <a href="tel:+49236171035">02361 71035</a></p>
                    <p>Fax: <a href="tel:+49236171034">02361 71034</a></p>
                    <p>E-Mail: <a href="mailto:info@re-schraub.eu">info@re-schraub.eu</a></p>
                </div>
            </div>

            <div className="footer-bottom">
                © {new Date().getFullYear()} RE-Schraub GmbH – Alle Rechte vorbehalten.
            </div>
        </footer>
    );
}
