import express from "express";
import crypto from "crypto";
import dotenv from "dotenv";
import { otpCache } from "../config/db.js";
import createOTP from "../controller/createOtp.js";
import verifyOtp from "../controller/verifyOtp.js";
import checkResends from "../middlewares/checkResends.js";
import checkAttempts from "../middlewares/checkAttempts.js";
import listOtp from "../controller/listOtp.js";
import resendOtp from "../controller/resendOtp.js";

dotenv.config();
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the OTP API!");
});

// Generate a new OTP
app.post("/otp/new", createOTP);

// Verify an existing OTP
app.post("/otp/verify", checkAttempts, verifyOtp);

// Resend an existing OTP
app.post("/otp/resend", checkResends, resendOtp);

// List all OTPs (for testing purposes)
app.get("/otp/list", listOtp);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});