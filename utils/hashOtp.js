import crypto from "crypto";

export const hashOTP = (otp) => {
    return crypto
        .createHash("sha256")
        .update(otp.toString())
        .digest("hex");
}
