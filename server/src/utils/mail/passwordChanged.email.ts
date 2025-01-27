// import nodemailer from "nodemailer";
import passwordChangedTemplate from "../templates/mail/passwordChanged.template";
import { mailSender } from "./mailSender";

/** Send Password Changed Email **/
const sendPasswordChangedEmail = async (email: string, name: string) => {
  try {
    await mailSender(
      email,
      "Your password has been changed successfully",
      passwordChangedTemplate(name)
    );
    console.info("Email sent successfully");
  } catch (error) {
    throw new Error("Error while sending password changed email");
  }
};

export { sendPasswordChangedEmail };
