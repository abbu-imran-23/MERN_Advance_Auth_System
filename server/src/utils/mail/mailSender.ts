import nodemailer from "nodemailer";

/** Maile Sender **/
const mailSender = async (email: string, title: string, body: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: `${email}`,
    subject: `${title}`,
    html: `${body}`,
  };

  await transporter.sendMail(mailOptions);
};

export { mailSender };
