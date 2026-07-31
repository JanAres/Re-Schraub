import React, { useState, useContext } from "react";
import "../Contact.css";
import { Language } from "../context/LanguageContext";
import logo from "../img/RE-Schraub Logo frei-1772x1128-429w.png";
import PageFlyTitle from "../components/PageFlyTitle";

const initialFormData = {
    name: "",
    email: "",
    phone: "",
    message: "",
    date: "",
    time: "",
    topic: "contact.topicProduct",
    job: "",
    businessCustomer: false,
    reasonInfo: false,
    cv: null,
};

function Contact() {
    const { t } = useContext(Language);
    const pageTitle = t("nav.contact") || "Kontakt";

    const [formData, setFormData] = useState(initialFormData);
    const [completedFields, setCompletedFields] = useState({});
    const [inviteGenerated, setInviteGenerated] = useState(false);
    const [icsData, setIcsData] = useState("");
    const [sending, setSending] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : type === "file" ? files?.[0] || null : value,
        }));
    };

    const handleBlur = (e) => {
        const { name, value, type, checked, files } = e.target;
        const hasValue =
            type === "checkbox"
                ? checked
                : type === "file"
                    ? Boolean(files?.length)
                    : value.trim().length > 0;

        setCompletedFields((prev) => ({
            ...prev,
            [name]: hasValue,
        }));
    };

    const fieldClassName = (name) =>
        completedFields[name] ? "contact-input contact-input--completed" : "contact-input";

    const setTopic = (topic) => {
        setFormData((prev) => ({ ...prev, topic }));
        setErrorMsg("");
        setSuccessMsg("");
    };

    const formatICS = (date) => {
        return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    const createICS = () => {
        if (!formData.date || !formData.time) return "";

        const datetime = new Date(`${formData.date}T${formData.time}`);
        if (Number.isNaN(datetime.getTime())) return "";

        const endTime = new Date(datetime.getTime() + 30 * 60000);

        return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//RE-Schraub GmbH//DE
BEGIN:VEVENT
UID:${new Date().getTime()}@re-schraub.eu
DTSTAMP:${formatICS(new Date())}
DTSTART:${formatICS(datetime)}
DTEND:${formatICS(endTime)}
SUMMARY:Beratungstermin mit RE-Schraub
DESCRIPTION:${formData.message}
LOCATION:Telefonisch oder Online
ORGANIZER;CN=RE-Schraub GmbH:mailto:info@re-schraub.eu
ATTENDEE;CN=${formData.name};RSVP=TRUE:mailto:${formData.email}
END:VEVENT
END:VCALENDAR`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email) {
            alert(t("contact.pleaseEnterEmail"));
            return;
        }

        setSending(true);
        setErrorMsg("");
        setSuccessMsg("");

        const icsContent = createICS();
        setIcsData(icsContent);
        setInviteGenerated(Boolean(icsContent));

        try {
            const response = await fetch("http://localhost:5000/api/send-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    message: formData.message,
                    date: formData.date,
                    time: formData.time,
                    job: formData.job,
                    businessCustomer: formData.businessCustomer,
                    reasonInfo: formData.reasonInfo,
                    topic: t(formData.topic || "nav.contact"),
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.error || "Unknown error");
            }

            setSuccessMsg("Danke. Ihre Anfrage wurde erfolgreich gesendet.");
        } catch (err) {
            console.error("Error:", err);
            setErrorMsg("Fehler beim Senden der E-Mail. Bitte versuchen Sie es später erneut.");
        } finally {
            setSending(false);
        }
    };

    const downloadICS = () => {
        const blob = new Blob([icsData], { type: "text/calendar" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "RE-Schraub-Termin.ics";
        link.click();

        URL.revokeObjectURL(url);
    };

    return (
        <main className="contact-page" aria-labelledby="contact-title">
            <PageFlyTitle path="/contact" title={pageTitle} />
            <div className="contact-shell">
                <section className="contact-content">
                    <div className="contact-hero">
                        <h1 id="contact-title">{pageTitle}</h1>
                    </div>


                    <article className="contact-legal-card">
                        <div className="contact-section-head">
                            <span>Rechtliches</span>
                            <h2>{t("impressum.title")}</h2>
                        </div>

                        <div className="contact-legal-scroll">
                            <h3>{t("impressum.company")}</h3>
                            <p>{t("impressum.companyInfo")}</p>

                            <h3>{t("impressum.businessData")}</h3>
                            <p>{t("impressum.businessDetails")}</p>

                            <h3>{t("impressum.responsible")}</h3>
                            <p>{t("impressum.responsibleDetails")}</p>

                            <h3>{t("impressum.revoke")}</h3>
                            <p>{t("impressum.revokeText")}</p>

                            <h3>{t("impressum.complaint")}</h3>
                            <p>{t("impressum.complaintText")}</p>

                            <h3>{t("impressum.portability")}</h3>
                            <p>{t("impressum.portabilityText")}</p>

                            <h3>{t("impressum.rights")}</h3>
                            <p>{t("impressum.rightsText")}</p>

                            <h3>{t("impressum.encryption")}</h3>
                            <p>{t("impressum.encryptionText")}</p>

                            <h3>{t("impressum.serverLog")}</h3>
                            <p>{t("impressum.serverLogText")}</p>

                            <h3>{t("impressum.contactForm")}</h3>
                            <p>{t("impressum.contactFormText")}</p>

                            <h3>{t("impressum.newsletter")}</h3>
                            <p>{t("impressum.newsletterText")}</p>

                            <h3>{t("impressum.cookies")}</h3>
                            <p>{t("impressum.cookiesText")}</p>

                            <p>{t("impressum.source")}</p>
                        </div>
                    </article>
                </section>

                <form className="contact-form-card" onSubmit={handleSubmit}>
                    <div className="contact-section-head contact-form-head">
                        <span>Anfrage an RE-Schraub</span>
                        <h2>{formData.topic === "contact.topicJobs" ? "Bewerbung" : "Kontaktformular"}</h2>
                        <p>Bitte wählen Sie den passenden Bereich und senden Sie uns Ihre Anfrage.</p>
                    </div>

                    <div className="contact-topic-tabs" role="tablist" aria-label="Kontaktbereich wählen">
                        <button
                            type="button"
                            className={formData.topic === "contact.topicProduct" ? "is-active" : ""}
                            onClick={() => setTopic("contact.topicProduct")}
                        >
                            Kontakt
                        </button>

                        <button
                            type="button"
                            className={formData.topic === "contact.topicJobs" ? "is-active" : ""}
                            onClick={() => setTopic("contact.topicJobs")}
                        >
                            Bewerbung
                        </button>
                    </div>

                    <div className="contact-field-row">
                        <div className="contact-field">
                            <label htmlFor="contact-name">{t("contact.name")}</label>
                            <input
                                id="contact-name"
                                className={fieldClassName("name")}
                                type="text"
                                name="name"
                                value={formData.name}
                                placeholder={t("contact.name")}
                                required
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </div>

                        <div className="contact-field">
                            <label htmlFor="contact-email">{t("contact.email")}</label>
                            <input
                                id="contact-email"
                                className={fieldClassName("email")}
                                type="email"
                                name="email"
                                value={formData.email}
                                placeholder={t("contact.email")}
                                required
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </div>
                    </div>

                    <div className="contact-field-row contact-field-row--small-second">
                        <div className="contact-field">
                            <label htmlFor="contact-phone">{t("contact.phone")}</label>
                            <input
                                id="contact-phone"
                                className={fieldClassName("phone")}
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                placeholder={t("contact.phone")}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </div>

                        <div className="contact-field">
                            <label htmlFor="contact-date">Termin optional</label>

                            <div className="contact-date-grid">
                                <input
                                    id="contact-date"
                                    className={fieldClassName("date")}
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />

                                <input
                                    className={fieldClassName("time")}
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="contact-field">
                        <label htmlFor="contact-message">{t("contact.message")}</label>
                        <textarea
                            id="contact-message"
                            className={fieldClassName("message")}
                            name="message"
                            value={formData.message}
                            placeholder={t("contact.message")}
                            rows="5"
                            required
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </div>

                    {formData.topic === "contact.topicJobs" ? (
                        <div className="contact-job-panel">
                            <div className="contact-field">
                                <label htmlFor="contact-job">{t("contact.selectJob")}</label>

                                <select
                                    id="contact-job"
                                    className={fieldClassName("job")}
                                    name="job"
                                    value={formData.job}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                >
                                    <option value="">{t("contact.selectJob")}</option>
                                    <option value="job1">{t("contact.jobOption1")}</option>
                                    <option value="job2">{t("contact.jobOption2")}</option>
                                    <option value="job3">{t("contact.jobOption3")}</option>
                                </select>
                            </div>

                            <div className="contact-field">
                                <label htmlFor="contact-cv">{t("contact.uploadCV")}</label>

                                <input
                                    id="contact-cv"
                                    className={fieldClassName("cv")}
                                    type="file"
                                    name="cv"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="contact-check-grid">
                            <label className="contact-check" htmlFor="contact-business">
                                <input
                                    id="contact-business"
                                    type="checkbox"
                                    name="businessCustomer"
                                    checked={formData.businessCustomer}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <span>{t("contact.checkboxBusiness")}</span>
                            </label>

                            <label className="contact-check" htmlFor="contact-info">
                                <input
                                    id="contact-info"
                                    type="checkbox"
                                    name="reasonInfo"
                                    checked={formData.reasonInfo}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <span>{t("contact.checkboxInfo")}</span>
                            </label>
                        </div>
                    )}

                    <button className="contact-submit" type="submit" disabled={sending}>
                        {sending
                            ? "Wird gesendet ..."
                            : t("contact.send").replace("{{topic}}", t(formData.topic || "nav.contact"))}
                    </button>

                    {inviteGenerated && (
                        <button type="button" onClick={downloadICS} className="contact-calendar-btn">
                            {t("contact.scheduleCalendar")}
                        </button>
                    )}

                    {successMsg && <p className="contact-status contact-status--success">{successMsg}</p>}
                    {errorMsg && <p className="contact-status contact-status--error">{errorMsg}</p>}
                </form>
            </div>
        </main>
    );
}

export default Contact;