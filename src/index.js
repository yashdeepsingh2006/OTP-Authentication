import express from "express";
import crypto from "crypto";
import { otpCache } from "../config/db.js";
import createOTP from "../controller/createOTP.js";
import verifyOtp from "../controller/verifyOtp.js";
import checkAttempts from "../middlewares/checkAttempts.js";
import listOtp from "../controller/listOtp.js";

const app = express();
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Welcome to the OTP API!");
});

// Generate a new OTP
app.post("/otp/new", createOTP);

// Verify an existing OTP
app.post("/otp/verify", checkAttempts, verifyOtp);

// List all OTPs (for testing purposes)
app.get("/otp/list", listOtp);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});