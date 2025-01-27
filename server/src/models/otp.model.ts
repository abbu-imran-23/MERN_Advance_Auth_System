/******************* Imports *********************/
import mongoose, { Document } from "mongoose";
import { sendVerificationCodeEmail } from "../utils/mail/verification.email";

/** OTP Interface **/
export interface IOtp extends Document {
  email: string;
  otp: string;
  expiry: Date;
  isActive: boolean;
  isValidOTP: (otp: string) => Promise<boolean>;
}

/** OTP Schema **/
const otpSchema = new mongoose.Schema<IOtp>({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiry: {
    type: Date,
    required: true,
    default: Date.now(),
    expires: 300, // 5 mins
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

/******************* Middlewares *********************/
otpSchema.post<IOtp>("save", async function () {
  try {
    await sendVerificationCodeEmail(this.email, this.otp);
  } catch (error) {
    console.error("Error in post save hook for OTP:", error);
  }
});

/******************* Methods *********************/
/**
 * Checks Validatity of OTP
 * @param {string} otp - client OTP
 * @return {Promise<boolean>} - returns true if valid, else false
 */
otpSchema.methods.isValidOTP = async function (otp: string): Promise<boolean> {
  return (await this.otp) === otp;
};

/** OTP Model **/
export const OTP = mongoose.model<IOtp>("OTP", otpSchema);
