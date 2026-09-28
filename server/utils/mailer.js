const nodemailer = require("nodemailer");
const winston = require("winston");

// Email goes through any SMTP service configured in server/.env:
//   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM
// Without SMTP_HOST (e.g. local development) nothing is sent and the
// message is written to the server log instead, links included.
const isConfigured = () => !!process.env.SMTP_HOST;

let transport;
const getTransport = () => {
  if (!transport) {
    const port = Number(process.env.SMTP_PORT) || 587;
    transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      // 465/2465 use TLS from the start; 587/2587 upgrade to it
      secure: port === 465 || port === 2465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transport;
};

async function sendMail({ to, subject, text, html }) {
  if (!isConfigured()) {
    winston.info(`Email not sent (SMTP not configured). To: ${to} | ${subject}\n${text}`);
    return;
  }
  await getTransport().sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  });
}

module.exports = { sendMail, isConfigured };
