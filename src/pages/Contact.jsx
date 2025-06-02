// src/pages/Contact.jsx
import React, { useState, useContext } from "react";
import "../Contact.css";
import { Language } from "../context/LanguageContext";

function Contact() {
    const { t } = useContext(Language);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
        date: "",
        time: "",
        topic: ""
    });
    const [inviteGenerated, setInviteGenerated] = useState(false);
    const [icsData, setIcsData] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const formatICS = (date) => {
        return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.email) {
            alert(t("contact.pleaseEnterEmail"));
            return;
        }

        const datetime = new Date(`${formData.date}T${formData.time}`);
        const endTime = new Date(datetime.getTime() + 30 * 60000);

        const icsContent = `BEGIN:VCALENDAR
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

        setIcsData(icsContent);
        setInviteGenerated(true);
    };

    const downloadICS = () => {
        const blob = new Blob([icsData], { type: "text/calendar" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "RE-Schraub-Termin.ics";
        link.click();
    };

    return (
        <>
            <div className="full-width-banner"></div>
            <div className="contact">
                <h1 className="contact-header">{t("contact.title")}</h1>

                <div className="contact-container">
                    <div className="contact-form-wrapper">
                        <div className="contact-topic-buttons">
                            <button
                                onClick={() =>
                                    setFormData({ ...formData, topic: "contact.topicProduct" })
                                }
                            >
                                {t("contact.topicProduct")}
                            </button>
                            <button
                                onClick={() =>
                                    setFormData({ ...formData, topic: "contact.topicJobs" })
                                }
                            >
                                {t("contact.topicJobs")}
                            </button>
                        </div>

                        <form className="contact-form" onSubmit={handleSubmit}>
                            <label>{t("contact.name")}</label>
                            <input
                                type="text"
                                name="name"
                                placeholder={t("contact.name")}
                                required
                                onChange={handleChange}
                            />

                            <label>{t("contact.email")}</label>
                            <input
                                type="email"
                                name="email"
                                placeholder={t("contact.email")}
                                required
                                onChange={handleChange}
                            />

                            <label>{t("contact.phone")}</label>
                            <input
                                type="tel"
                                name="phone"
                                placeholder={t("contact.phone")}
                                onChange={handleChange}
                            />

                            <label>{t("contact.message")}</label>
                            <textarea
                                name="message"
                                placeholder={t("contact.message")}
                                rows="5"
                                required
                                onChange={handleChange}
                            ></textarea>

                            {formData.topic === "contact.topicJobs" && (
                                <>
                                    <label>{t("contact.selectJob")}</label>
                                    <select name="job" onChange={handleChange} required>
                                        <option value="">{t("contact.selectJob")}</option>
                                        <option value="job1">{t("contact.jobOption1")}</option>
                                        <option value="job2">{t("contact.jobOption2")}</option>
                                        <option value="job3">{t("contact.jobOption3")}</option>
                                    </select>
                                    <label>{t("contact.uploadCV")}</label>
                                    <input type="file" name="cv" accept=".pdf,.doc,.docx" />
                                </>
                            )}

                            {formData.topic !== "contact.topicJobs" && (
                                <>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="businessCustomer"
                                            onChange={handleChange}
                                        />{" "}
                                        {t("contact.checkboxBusiness")}
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="reasonInfo"
                                            onChange={handleChange}
                                        />{" "}
                                        {t("contact.checkboxInfo")}
                                    </label>
                                </>
                            )}

                            <button type="submit">
                                {t("contact.send").replace(
                                    "{{topic}}",
                                    t(formData.topic || "nav.contact")
                                )}
                            </button>

                            {inviteGenerated && (
                                <button
                                    type="button"
                                    onClick={downloadICS}
                                    className="calendar-btn"
                                >
                                    {t("contact.scheduleCalendar")}
                                </button>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Contact;
