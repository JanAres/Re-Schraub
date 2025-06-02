// src/pages/Impressum.jsx
import React, { useContext } from "react";
import "../location.css";
import { Language } from "../context/LanguageContext";

function Impressum() {
    const { t } = useContext(Language);

    return (
        <>
            {/* Großes Banner am Seitenanfang */}
            <div className="full-width-banner"></div>

            <div className="home-container">
                {/* Sticky-Header oberhalb der Text-Box */}
                <div className="impressum-header">{t("impressum.title")}</div>

                {/* Große Text-Box mit den restlichen Inhalten */}
                <div className="text-box">
                    <h3>{t("impressum.company")}</h3>
                    <p style={{ whiteSpace: "pre-line" }}>
                        {t("impressum.companyInfo")}
                    </p>

                    <h3>{t("impressum.businessData")}</h3>
                    <p style={{ whiteSpace: "pre-line" }}>
                        {t("impressum.businessDetails")}
                    </p>

                    <h3>{t("impressum.responsible")}</h3>
                    <p style={{ whiteSpace: "pre-line" }}>
                        {t("impressum.responsibleDetails")}
                    </p>

                    <h3>{t("impressum.revoke")}</h3>
                    <p style={{ whiteSpace: "pre-line" }}>
                        {t("impressum.revokeText")}
                    </p>

                    <h3>{t("impressum.complaint")}</h3>
                    <p style={{ whiteSpace: "pre-line" }}>
                        {t("impressum.complaintText")}
                    </p>

                    <h3>{t("impressum.portability")}</h3>
                    <p style={{ whiteSpace: "pre-line" }}>
                        {t("impressum.portabilityText")}
                    </p>

                    <h3>{t("impressum.rights")}</h3>
                    <p style={{ whiteSpace: "pre-line" }}>
                        {t("impressum.rightsText")}
                    </p>

                    <h3>{t("impressum.encryption")}</h3>
                    <p style={{ whiteSpace: "pre-line" }}>
                        {t("impressum.encryptionText")}
                    </p>

                    <h3>{t("impressum.serverLog")}</h3>
                    <p style={{ whiteSpace: "pre-line" }}>
                        {t("impressum.serverLogText")}
                    </p>

                    <h3>{t("impressum.contactForm")}</h3>
                    <p style={{ whiteSpace: "pre-line" }}>
                        {t("impressum.contactFormText")}
                    </p>

                    <h3>{t("impressum.newsletter")}</h3>
                    <p style={{ whiteSpace: "pre-line" }}>
                        {t("impressum.newsletterText")}
                    </p>

                    <h3>{t("impressum.cookies")}</h3>
                    <p style={{ whiteSpace: "pre-line" }}>
                        {t("impressum.cookiesText")}
                    </p>

                    <p>{t("impressum.source")}</p>
                </div>
            </div>
        </>
    );
}

export default Impressum;
