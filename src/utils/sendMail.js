import nodemailer from "nodemailer";
import { getOtpEmailTemplate } from "./emailTemplate.js";

let transporter = null;

const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }
    return transporter;
};

const sendMail = async (email, otp) => {
    const transport = getTransporter();

    const expiryMinutes = process.env.OTP_EXPIRY_TIME || 5;
    const { subject, text, html } = getOtpEmailTemplate(otp, expiryMinutes);
    
    const mailOptions = {
        from: `"Security Verification" <${process.env.SMTP_USER}>`,
        to: email,
        subject,
        text,
        html
    };
    
    const info = await transport.sendMail(mailOptions);
    return info;
};

export default sendMail;
