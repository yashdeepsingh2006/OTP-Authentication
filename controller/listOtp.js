import { otpCache } from "../config/db.js";

const listOtp = (req, res) => {
    const list = Array.from(otpCache.keys());
    res.json({ otps: list });
}

export default listOtp;