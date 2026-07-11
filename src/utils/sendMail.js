import nodemailer from "nodemailer";

const sendMail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
    
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is: ${otp}`
    };
    
    await transporter.sendMail(mailOptions);
};

export default sendMail;