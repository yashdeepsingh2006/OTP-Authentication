import { otpCache } from "../config/db.js";
import { hashOTP } from "../utils/hashOtp.js";

const verifyOtp = (req, res) => {
    const data = req.body;
    const otp = data.json ? data.json.otp : data.otp;
    const email = data.email;
    if(otpCache.has(email)) {
        const otpData = otpCache.get(email);
        if(hashOTP(otp) == otpData.otp){
            otpCache.delete(email);
            res.status(200).json({message: "Success"});
        }else{
            otpData.attempts+=1;
            otpCache.set(email, otpData);
            res.status(400).json({message: "Invalid OTP"});
        }
    }else{
        res.status(400).json({ message: "Invalid OTP or session expired." });
    }
    
    
}

export default verifyOtp;