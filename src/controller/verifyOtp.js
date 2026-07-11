import { hashOTP } from "../utils/hashOtp.js";
import client from "../config/redis.js";

const verifyOtp = async (req, res) => {
    const data = req.body;
    const otp = data.json ? data.json.otp : data.otp;
    const email = data.email;

    try {
        // 1. Fetch data from Redis
        const rawOtpData = await client.get(email);

        if (rawOtpData) {
            const otpData = JSON.parse(rawOtpData);

            // 2. Validate OTP Hash Match
            if (hashOTP(otp) === otpData.otp) {
                // Remove OTP on successful verification to prevent reuse
                await client.del(email);
                return res.status(200).json({ message: "Success" });
            } else {
                // 3. Handle Wrong Attempt: Increment counter and update Redis
                otpData.attempts += 1;
                
                // Get remaining expiration time (TTL) so we don't accidentally reset the clock
                const currentTtl = await client.ttl(email);
                
                // If the key is close to expiring anyway, keep a minimal window or use remaining TTL
                const expiryTime = currentTtl > 0 ? currentTtl : 60;

                await client.set(email, JSON.stringify(otpData), {
                    EX: expiryTime
                });

                return res.status(400).json({ message: "Invalid OTP" });
            }
        } else {
            return res.status(400).json({ message: "Invalid OTP or session expired." });
        }
    } catch (err) {
        console.error("Error in verification flow:", err);
        return res.status(500).json({ error: "Failed to process verification" });
    }
}

export default verifyOtp;