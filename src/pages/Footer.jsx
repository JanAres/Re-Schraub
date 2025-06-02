import React from "react";
import "../Footer.css";

function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-content">
                <div className="footer-left">
                    <h4>RE-Schraub GmbH</h4>
                    <p>Auerstr. 2<br />45663 Recklinghausen</p>
                </div>
                <div className="footer-right">
                    <p style={{color: "white"}}> Telefon: <a href="tel:+49236171035" style={{color: "white"}}>02361 71035</a>
                    </p>
                    <p style={{color: "white"}}> Telefon: <a href="tel:+49236171034" style={{color: "white"}}>02361 71034</a>
                    </p>
                    <p style={{color: "white"}}> E-Mail: <a href="mailto:info@re-schraub.eu" style={{color: "white"}}>info@re-schraub.eu</a>
                    </p>


                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} RE-Schraub GmbH – Alle Rechte vorbehalten.</p>
            </div>
        </footer>
    );
}

export default Footer;
