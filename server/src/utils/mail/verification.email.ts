// import nodemailer from "nodemailer";
import { mailSender } from "./mailSender";
import otpTemplate from "../templates/mail/verificationCode.template";

/** Send Verification Email **/
const sendVerificationCodeEmail = async (email: string, otp: string) => {
  try {
    const mailContext = otpTemplate(otp);
    await mailSender(email, "Your Verification Code", mailContext);
    console.info("Email sent successfully");
  } catch (error) {
    throw new Error("Error while sending verification code email");
  }
};

export { sendVerificationCodeEmail };
