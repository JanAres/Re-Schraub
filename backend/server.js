// server.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: "http://localhost:3000" // your React dev URL
}));
app.use(bodyParser.json());

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: false, // true for 465, false for other ports (587)
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Verify connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error("SMTP connection error:", error);
    } else {
        console.log("SMTP server is ready to take requests");
    }
});

/**
 * POST /api/send-email
 * Expects JSON body with: { name, email, phone, message, date, time, topic }
 * Sends an email to 519690@student.fontys.nl containing these details.
 */
app.post("/api/send-email", async (req, res) => {
    const { name, email, phone, message, date, time, topic } = req.body;

    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).json({ error: "Name, email, and message are required." });
    }

    try {
        // Build the email content
        const subject = `Kontaktanfrage: ${topic} – ${name}`;
        const bodyLines = [
            `Name: ${name}`,
            `E-Mail: ${email}`,
            `Telefon: ${phone || "–"}`,
            `Thema: ${topic}`,
            `Nachricht: ${message}`,
            `Datum/​Zeit: ${date} ${time}`
        ];
        const textBody = bodyLines.join("\n");

        // Send mail
        await transporter.sendMail({
            from: `"Re-Schraub Website" <${process.env.SMTP_USER}>`,
            to: "519690@student.fontys.nl",
            subject: subject,
            text: textBody
            // If you also want an HTML‐formatted email, add html: "<p>...</p>"
        });

        return res.json({ success: true, message: "Email sent." });
    } catch (err) {
        console.error("Error sending email:", err);
        return res.status(500).json({ error: "Failed to send email." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
