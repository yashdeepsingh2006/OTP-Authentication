import crypto from "crypto";
import { hashOTP } from "../utils/hashOtp.js";
import sendMail from "../utils/sendMail.js";
import client from "../config/redis.js";

const createOTP = async (req, res) => {
    const otp = crypto.randomInt(100000, 1000000);
    const email = req.body.email;
    const otpData = {
        "otp": hashOTP(otp),
        "expiresAt": Date.now() + Number(process.env.OTP_EXPIRY_TIME) * 60 * 1000,
        "createdAt": Date.now(),
        "attempts": 0,
        "lastResentAt": Date.now(),
        "totalResends": 0
    }
    
    await client.set(email, JSON.stringify(otpData), {
        EX: Number(process.env.OTP_EXPIRY_TIME) * 60
    });


    try{
        await sendMail(email, otp);
    } catch (err) {
        console.error("Error sending OTP email:", err);
        return res.status(500).json({ error: "Failed to send OTP email" });
    }

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