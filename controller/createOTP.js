import crypto from "crypto";
import { otpCache } from "../config/db.js";
import { hashOTP } from "../utils/hashOtp.js";

const createOTP = (req, res) => {
    const otp = crypto.randomInt(100000, 1000000);
    const email = req.body.email;

    otpCache.set(email,{
        "otp": hashOTP(otp),
        "expiresAt": Date.now() + 5 * 60 * 1000,
        "createdAt": Date.now(),
        "attempts": 0,
        "lastResentAt": Date.now(),
        "totalResends": 0
    });
    if(process.env.ENVIORNMENT=="development"){
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