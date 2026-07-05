import { otpCache } from "../config/db.js";

const checkAttempts = (req, res, next) => {
    const data = req.body;
    const otp = data.json ? data.json.otp : data.otp;
    const email = data.email;
    if(otpCache.has(email)) {
        const otpData = otpCache.get(email);
        if(otpData.attempts >= 3) {
            otpCache.delete(email);
            res.status(429).json({ message: "Too many attempts! Please try again later." });
        } else {
            next();
        }
    }else{
        res.status(400).json({ message: "Invalid OTP or session expired." });
    }
}

export default checkAttempts;