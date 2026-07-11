import crypto from "crypto";
import { hashOTP } from "../utils/hashOtp.js";
import sendMail from "../utils/sendMail.js";
import client from "../config/redis.js";

const resendOtp = async (req, res) => {
    const data = req.body;
    const email = data.email;

    // CHECK IF EMAIL IS PROVIDED
    if (!email) {
        return res.status(400).send({
            "success": false,
            "message": "Email is required to resend an OTP"
        });
    }

    try {
        // FETCH RAW DATA FROM REDIS
        const rawOtpData = await client.get(email);

        // CHECK IF OTP EXISTS FOR THE EMAIL
        if (!rawOtpData) {
            return res.status(400).send({
                "success": false,
                "message": "No OTP found for this email. Please request a new OTP."
            });
        }

        const otpData = JSON.parse(rawOtpData);

        // EVALUATE COOLDOWN TIMEOUTS
        if (Date.now() - otpData.lastResentAt < Number(process.env.RESEND_COOLDOWN)) {
            return res.status(400).send({
                "success": false,
                "message": `Please wait for ${Number(process.env.RESEND_COOLDOWN) / 1000} seconds before requesting a new OTP.`
            });
        }

        // GENERATE NEW OTP AND RE-SAVE TO REDIS
        const otp = crypto.randomInt(100000, 1000000);
        const expiryInSeconds = Number(process.env.OTP_EXPIRY_TIME) * 60;

        const updatedOtpData = {
            "otp": hashOTP(otp),
            "expiresAt": Date.now() + expiryInSeconds * 1000,
            "createdAt": Date.now(),
            "attempts": 0,
            "lastResentAt": Date.now(),
            "totalResends": otpData.totalResends + 1
        };

        // Write update to Redis with clean native expiration
        await client.set(email, JSON.stringify(updatedOtpData), {
            EX: expiryInSeconds
        });

        // AWAIT EMAIL TRANSMISSION SECURELY
        await sendMail(email, otp);

        // PROCESS CONDITIONAL ENVIRONMENT LOGIC
        if (process.env.ENVIRONMENT == "development") {
            console.log(`Generated OTP: ${otp}`);
            return res.send({
                "success": true,
                "otp": otp
            });
        } else {
            return res.send({
                "success": true,
                "message": "OTP resent successfully"
            });
        }

    } catch (err) {
        console.error("Error in resend OTP flow:", err);
        return res.status(500).json({ error: "Failed to process or resend OTP" });
    }
}

export default resendOtp;