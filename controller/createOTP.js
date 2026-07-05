import { otpCache } from "../config/db.js";
import { hashOTP } from "../utils/hashOtp.js";

const createOTP = (req, res) => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const email = req.body.email;

    otpCache.set(email,{
        "otp": hashOTP(otp),
        "expiresAt": Date.now() + 5 * 60 * 1000,
        "createdAt": Date.now(),
        "attempts": 0
    });
    console.log(`Generated OTP for ${email}: ${otp}`);
    res.json({ otp });
}

export default createOTP;