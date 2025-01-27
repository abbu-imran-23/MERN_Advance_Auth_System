// import nodemailer from "nodemailer";
import { mailSender } from "./mailSender";
import onboardingTemplate from "../templates/mail/onboarding.template";

/** Send Verification Email **/
const sendOnboardingEmail = async (email: string, name: string) => {
  try {
    await mailSender(email, "Welcome to Platform", onboardingTemplate(name));
    console.info("Email sent successfully");
  } catch (error) {
    throw new Error("Error while sending onboarding email");
  }
};

export { sendOnboardingEmail };
