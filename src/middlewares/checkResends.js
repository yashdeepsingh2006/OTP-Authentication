import client from "../config/redis.js";

const checkResends = async (req, res, next) => {
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

            // 2. Validate resend thresholds
            if (otpData.totalResends >= Number(process.env.RESEND_LIMIT)) {
                // Wipe out the OTP payload from Redis to force a complete cooldown period
                await client.del(email);
                return res.status(429).json({ message: "Too many resend attempts! Please try again later." });
            } else {
                // Safe to proceed to the resend controller logic
                next();
            }
        } else {
            // If checking resends on a non-existent or expired key, handle it gracefully
            return res.status(400).json({ message: "Invalid OTP or session expired." });
        }
    } catch (err) {
        console.error("Error in checkResends middleware:", err);
        return res.status(500).json({ error: "Failed to process rate limiting validation" });
    }
}

export default checkResends;