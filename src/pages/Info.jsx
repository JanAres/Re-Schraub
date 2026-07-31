import React, { useContext } from "react";
import "../Info.css";
import { Language } from "../context/LanguageContext";

function Info() {
    const { t } = useContext(Language);

    const company = t("info.company");
    const addressLine1 = t("info.addressLine1");
    const addressLine2 = t("info.addressLine2");
    const phoneLabel = t("info.phoneLabel");
    const phone = t("info.phone");
    const faxLabel = t("info.faxLabel");
    const fax = t("info.fax");
    const emailLabel = t("info.emailLabel");
    const email = t("info.email");

    const normalizedPhone = phone.replace(/\s+/g, "");
    const normalizedFax = fax.replace(/\s+/g, "");

    return (
        <div className="info-floating-wrap">
            <div className="info-logo-badge" aria-hidden="true">
                <img
                    src="/img/RE-Schraub Logo frei-1772x1128-429w.png"
                    alt="/img/RE-Schraub Logo frei-1772x1128-429w.png"
                    className="info-logo-img"
                />
            </div>

            <div className="company-info-box">
                <div className="info-content">
                    <h2>{company}</h2>

                    <p>
                        {addressLine1}
                        <br />
                        {addressLine2}
                    </p>

                    <p>
                        <strong>{phoneLabel}</strong>{" "}
                        <a href={`tel:${normalizedPhone}`}>{phone}</a>
                        <br />

                        <strong>{faxLabel}</strong>{" "}
                        <a href={`fax:${normalizedFax}`}>{fax}</a>
                        <br />

                        <strong>{emailLabel}</strong>{" "}
                        <a href={`mailto:${email}`}>{email}</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Info;