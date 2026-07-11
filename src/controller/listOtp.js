import client from "../config/redis.js";

const listOtp = async (req, res) => {
    try {
        const list = await client.keys('*');
        
        return res.json({ otps: list });
    } catch (err) {
        console.error("Error listing OTP keys from Redis:", err);
        return res.status(500).json({ error: "Failed to retrieve OTP list" });
    }
}

export default listOtp;