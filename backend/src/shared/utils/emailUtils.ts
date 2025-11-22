import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const getEmailSecrets = () => {
  const { EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error(
      "EMAIL_USER and EMAIL_PASS must be defined in environment variables"
    );
  }

  return {
    emailUser: EMAIL_USER,
    emailPass: EMAIL_PASS,
  };
};

const emailSecrets = getEmailSecrets();

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: emailSecrets.emailUser,
    pass: emailSecrets.emailPass,
  },
});

export async function sendMail(to: string, subject: string, html: string) {
  return transport.sendMail({
    from: `"App" <${emailSecrets.emailUser}>`,
    to,
    subject,
    html,
  });
}
