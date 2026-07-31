import React, { useContext, useEffect, useMemo, useState } from "react";
import "./Newsletter.css";
import { Language } from "./context/LanguageContext";
import katalogPreview from "./img/Screenshot 2025-06-05 at 09-27-10 EH_ReSchraub_2025_L.pdf.png";
import produktPreview from "./img/Screenshot 2025-06-05 at 12-07-24 RE-Schraub Katalog ohne Preise.pdf.png";
import PageFlyTitle from "./components/PageFlyTitle";

const NEWSLETTER_ENDPOINT = "/api/newsletter.php";

const rapidmailNewsletterConfig = {
    provider: "rapidmail",
    publicListKey: "re-schraub-newsletter-2026",
    listName: "RE-Schraub Newsletter 2026",
    source: "re-schraub-website-newsletter-page",
    formName: "RE-Schraub Newsletter Anmeldung",
    doubleOptIn: true,
    activationMail: true,
    tags: ["website", "newsletter", "katalog", "re-schraub", "2026"],
    consentTextVersion: "newsletter-consent-v1-2026-05-31",
    fieldMapping: {
        salutation: "gender_or_salutation",
        fullName: "firstname_lastname_split_backend",
        companyName: "company",
        emailAddress: "email",
        phoneNumber: "phone",
        newsletterActiveUntil: "newsletter_active_until",
    },
};

const initialForm = {
    salutation: "",
    fullName: "",
    companyName: "",
    emailAddress: "",
    phoneNumber: "",
    newsletterActiveUntil: "unlimited",
    consentAccepted: false,
};

const getNewsletterActiveUntilDate = (value) => {
    if (value === "unlimited") return null;
    return `${value}-12-31`;
};

const normalizeNewsletterPayload = (formData) => {
    const fullName = formData.fullName.trim();
    const nameParts = fullName.split(/\s+/).filter(Boolean);
    const firstName = nameParts.shift() || "";
    const lastName = nameParts.join(" ");

    return {
        rapidmail: rapidmailNewsletterConfig,
        contact: {
            salutation: formData.salutation,
            firstName,
            lastName,
            fullName,
            companyName: formData.companyName.trim(),
            emailAddress: formData.emailAddress.trim().toLowerCase(),
            phoneNumber: formData.phoneNumber.trim(),
            newsletterActiveUntil: formData.newsletterActiveUntil,
            newsletterActiveUntilDate: getNewsletterActiveUntilDate(formData.newsletterActiveUntil),
        },
        consent: {
            accepted: formData.consentAccepted,
            acceptedAt: new Date().toISOString(),
            source: rapidmailNewsletterConfig.source,
            textVersion: rapidmailNewsletterConfig.consentTextVersion,
            doubleOptInRequested: true,
        },
    };
};

function Newsletter() {
    const { t } = useContext(Language);
    const [formData, setFormData] = useState(initialForm);
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");
    const [completedFields, setCompletedFields] = useState({});
    const [pageLeaving, setPageLeaving] = useState(false);

    const apiBaseUrl = useMemo(
        () => import.meta.env.VITE_API_URL || "",
        []
    );

    useEffect(() => {
        const handlePageTitleFlyout = () => {
            setPageLeaving(true);
        };

        window.addEventListener("page-title-flyout", handlePageTitleFlyout);

        return () => {
            window.removeEventListener("page-title-flyout", handlePageTitleFlyout);
        };
    }, []);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        if (type !== "checkbox") {
            setCompletedFields((prev) => ({
                ...prev,
                [name]: false,
            }));
        }
    };

    const handleBlur = (event) => {
        const { name, value, type, checked } = event.target;
        const hasValue = type === "checkbox" ? checked : String(value || "").trim().length > 0;

        setCompletedFields((prev) => ({
            ...prev,
            [name]: hasValue,
        }));
    };

    const fieldClassName = (name) =>
        completedFields[name]
            ? "newsletter-input newsletter-input--completed"
            : "newsletter-input";

    const handleSubmit = async (event) => {
        event.preventDefault();
        setStatus("sending");
        setMessage("");

        const payload = normalizeNewsletterPayload(formData);

        try {
            const response = await fetch(`${apiBaseUrl}${NEWSLETTER_ENDPOINT}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(result.error || "Die Newsletter-Anmeldung konnte nicht abgeschlossen werden.");
            }

            setStatus("success");
            setMessage(
                result.message ||
                "Fast geschafft: Bitte bestätige deine Anmeldung über die E-Mail von rapidmail."
            );
            setFormData(initialForm);
            setCompletedFields({});
        } catch (error) {
            setStatus("error");
            setMessage(error.message || "Die Newsletter-Anmeldung konnte nicht abgeschlossen werden.");
        }
    };

    return (
        <section className={`newsletter-page ${pageLeaving ? "is-leaving" : ""}`} aria-labelledby="newsletter-title">
            <PageFlyTitle path="/newsletter" title="Newsletter" />

            <header className="newsletter-header">
                <h1 id="newsletter-title">{t("Newsletter")}</h1>
                <p className="newsletter-lead">
                    {t("Anmelden und unseren Newsletter erhalten")}
                </p>
            </header>

            <div className="newsletter-stage">
                <div className="newsletter-catalog-split" aria-label="Katalogvorschauen">
                    <a
                        className="newsletter-catalog-img newsletter-catalog-img--one"
                        href="/pdf/EH_ReSchraub_2025_L.pdf"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Terrassofix/Fassadofix Katalog öffnen"
                    >
                        <img src={katalogPreview} alt="Terrassofix/Fassadofix Katalogvorschau" />
                    </a>

                    <a
                        className="newsletter-catalog-img newsletter-catalog-img--two"
                        href="/pdf/Katalog_ReSchraub_2025_FINAL_oPreise_HiRes.pdf"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="RE-Schraub Katalog öffnen"
                    >
                        <img src={produktPreview} alt="RE-Schraub Katalogvorschau" />
                    </a>
                </div>

                <form className="newsletter-form-card" onSubmit={handleSubmit} noValidate={false}>
                    <div className="newsletter-field-row newsletter-field-row--small-first">
                        <div className="newsletter-field">
                            <label htmlFor="newsletter-salutation">Anrede</label>
                            <select
                                id="newsletter-salutation"
                                name="salutation"
                                value={formData.salutation}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={fieldClassName("salutation")}
                                required
                            >
                                <option value="">Anrede wählen</option>
                                <option value="Herr">Herr</option>
                                <option value="Frau">Frau</option>
                                <option value="Divers">Divers</option>
                            </select>
                        </div>

                        <div className="newsletter-field">
                            <label htmlFor="newsletter-full-name">Name</label>
                            <input
                                id="newsletter-full-name"
                                name="fullName"
                                type="text"
                                autoComplete="name"
                                value={formData.fullName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={fieldClassName("fullName")}
                                placeholder="Name"
                                required
                            />
                        </div>
                    </div>

                    <div className="newsletter-field">
                        <label htmlFor="newsletter-company-name">Firma</label>
                        <input
                            id="newsletter-company-name"
                            name="companyName"
                            type="text"
                            autoComplete="organization"
                            value={formData.companyName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={fieldClassName("companyName")}
                            placeholder="Firma"
                            required
                        />
                    </div>

                    <div className="newsletter-field-row">
                        <div className="newsletter-field">
                            <label htmlFor="newsletter-email-address">E-Mail Adresse</label>
                            <input
                                id="newsletter-email-address"
                                name="emailAddress"
                                type="email"
                                autoComplete="email"
                                value={formData.emailAddress}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={fieldClassName("emailAddress")}
                                placeholder="E-Mail Adresse"
                                required
                            />
                        </div>

                        <div className="newsletter-field">
                            <label htmlFor="newsletter-phone-number">
                                Telefonnummer <span>Optional</span>
                            </label>
                            <input
                                id="newsletter-phone-number"
                                name="phoneNumber"
                                type="tel"
                                autoComplete="tel"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={fieldClassName("phoneNumber")}
                                placeholder="Telefonnummer"
                            />
                        </div>
                    </div>



                    <label className="newsletter-consent" htmlFor="newsletter-consent">
                        <input
                            id="newsletter-consent"
                            name="consentAccepted"
                            type="checkbox"
                            checked={formData.consentAccepted}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={fieldClassName("consentAccepted")}
                            required
                        />
                        <span>
                            Ich möchte den RE-Schraub Newsletter erhalten und willige ein,
                            dass meine Angaben zur Newsletter-Anmeldung verarbeitet und zur
                            Anmeldung übertragen werden. Die Abmeldung ist jederzeit möglich.{" "}
                            <a className="newsletter-privacy-link" href="/datenschutz">
                                Datenschutzhinweise öffnen
                            </a>
                        </span>
                    </label>



                    <button className="newsletter-submit" type="submit" disabled={status === "sending"}>
                        {status === "sending" ? "Wird angemeldet ..." : "Newsletter anmelden"}
                    </button>

                    {message && (
                        <p className={`newsletter-status newsletter-status--${status}`}>
                            {message}
                        </p>
                    )}
                </form>
            </div>
        </section>
    );
}

export default Newsletter;
