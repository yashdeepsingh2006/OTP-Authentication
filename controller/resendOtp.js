import { otpCache } from "../config/db.js";
import crypto from "crypto";
import {hashOTP} from "../utils/hashOtp.js"
import sendMail from "../utils/sendMail.js";

const resendOtp = (req, res) => {
    const data = req.body;
    const email = data.email;

    // CHECK IF EMAIL IS PROVIDED
    if(!email) {
        return res.status(400).send({
            "sucess": false,
            "message": "Email is required to resend an OTP"
        });
    }

    // CHECK IF OTP EXISTS FOR THE EMAIL
    if(!otpCache.has(email)){
        return res.status(400).send({
            "sucess": false,
            "message": "No OTP found for this email. Please request a new OTP."
        });
    }
    const otpData = otpCache.get(email);

    if(Date.now() - otpData.lastResentAt < Number(process.env.RESEND_COOLDOWN)){
        return res.status(400).send({
            "sucess": false,
            "message": `Please wait for ${Number(process.env.RESEND_COOLDOWN)/1000} seconds before requesting a new OTP.`
        });
    }else{
        const otp = crypto.randomInt(100000, 1000000);
        otpCache.set(email,{
            "otp": hashOTP(otp),
            "expiresAt": Date.now() + Number(process.env.EXPIRE_TIME),
            "createdAt": Date.now(),
            "attempts": 0,
            "lastResentAt": Date.now(),
            "totalResends": otpData.totalResends + 1
        });

        sendMail(email, otp).catch((err) => {
            console.error("Error sending OTP email:", err);
            return res.status(500).json({ error: "Failed to send OTP email" });
        });

        // Debugging statement
        if(process.env.ENVIRONMENT == "development"){
            console.log(`Generated OTP: ${otp}`);
            return res.send({
                "sucess": true,
                "otp": otp
            });
        }else{
            return res.send({
                "sucess": true,
                "message": "OTP resent successfully"
            });
        }
    }
} 

export default resendOtp;

