import { otpCache } from "../config/db.js";

const checkResends = (req, res, next) => {
    const data = req.body;
    const otp = data.json ? data.json.otp : data.otp;
    const email = data.email;
    if(otpCache.has(email)) {
        const otpData = otpCache.get(email);
        if(otpData.totalResends >= Number(process.env.RESEND_LIMIT)) {
            otpCache.delete(email);
            return res.status(429).json({ message: "Too many resend attempts! Please try again later." });
        } else {
            next();
        }
    }else{
        return res.status(400).json({ message: "Invalid OTP or session expired." });
    }
}

export default checkResends;