import client from "../config/redis.js";

const checkAttempts = async (req, res, next) => {
    const data = req.body;
    const email = data.email;

    if (!email) {
        return res.status(400).json({ message: "Email is required." });
    }

    try {
        // 1. Fetch data from Redis
        const rawOtpData = await client.get(email);

        if (rawOtpData) {
            const otpData = JSON.parse(rawOtpData);

            // 2. Validate attempt thresholds
            if (otpData.attempts >= Number(process.env.ATTEMPT_LIMIT)) {
                // Delete the OTP from Redis immediately to block further attempts
                await client.del(email);
                return res.status(429).json({ message: "Too many attempts! Please try again later." });
            } else {
                // Threshold not met, safely pass control to the next middleware/controller
                next();
            }
        } else {
            return res.status(400).json({ message: "Invalid OTP or session expired." });
        }
    } catch (err) {
        console.error("Error in checkAttempts middleware:", err);
        return res.status(500).json({ error: "Failed to process security validation" });
    }
}

export default checkAttempts;