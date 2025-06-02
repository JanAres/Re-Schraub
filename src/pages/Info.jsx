// src/pages/Info.jsx
import React, { useContext } from "react";
import "../Info.css";
import { Language } from "../context/LanguageContext";

function Info() {
    const { t } = useContext(Language);

    return (
        <div className="company-info-box">
            <div className="info-content">
                <h2>{t("info.company")}</h2>
                <p>
                    {t("info.addressLine1")}
                    <br />
                    {t("info.addressLine2")}
                </p>
                <p>{t("info.contact")}</p>
            </div>
        </div>
    );
}

export default Info;
