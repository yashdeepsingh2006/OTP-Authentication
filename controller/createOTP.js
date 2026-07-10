import crypto from "crypto";
import { otpCache } from "../config/db.js";
import { hashOTP } from "../utils/hashOtp.js";
import sendMail from "../utils/sendMail.js";

const createOTP = (req, res) => {
    const otp = crypto.randomInt(100000, 1000000);
    const email = req.body.email;

    otpCache.set(email,{
        "otp": hashOTP(otp),
        "expiresAt": Date.now() + Number(process.env.OTP_EXPIRY_TIME) * 60 * 1000,
        "createdAt": Date.now(),
        "attempts": 0,
        "lastResentAt": Date.now(),
        "totalResends": 0
    });

    sendMail(email, otp).catch((err) => {
        console.error("Error sending OTP email:", err);
        return res.status(500).json({ error: "Failed to send OTP email" });
    });

    if(process.env.ENVIRONMENT=="development"){
        console.log(`Generated OTP for ${email}: ${otp}`);
        res.json({ otp });
    }else{
        res.json({
            "sucess": true,
            "message": "OTP sent sucessfully"
        });
    }
    
}

export default createOTP;