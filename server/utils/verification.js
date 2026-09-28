const crypto = require("crypto");
const origins = require("../config/origins");
const { sendMail } = require("./mailer");

const LINK_VALID_HOURS = 24;
const RESEND_WAIT_SECONDS = 60;

// Only the hash is stored, so a leaked database can't be used to verify accounts
const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

// Links go to the site the request came from, if it's one of ours
const siteUrl = (req) => {
  if (process.env.CLIENT_URL) return process.env.CLIENT_URL.replace(/\/$/, "");
  const origin = req.get("origin");
  return origins.includes(origin) ? origin : "https://munchiemaster.com";
};

const requestLanguage = (req) =>
  String(req.headers["accept-language"] || "").toLowerCase().startsWith("fa")
    ? "fa"
    : "en";

const messages = {
  en: {
    subject: "Confirm your Munchie Master account",
    body: (name, link) =>
      `Hi ${name},\n\nWelcome to Munchie Master! Please confirm your email address by opening this link:\n\n${link}\n\nThe link works for ${LINK_VALID_HOURS} hours. If you didn't sign up, you can ignore this email.`,
    button: "Confirm my email",
  },
  fa: {
    subject: "تأیید حساب Munchie Master",
    body: (name, link) =>
      `سلام ${name}،\n\nبه Munchie Master خوش آمدید! لطفاً با باز کردن این لینک ایمیل خود را تأیید کنید:\n\n${link}\n\nاین لینک تا ${LINK_VALID_HOURS} ساعت معتبر است. اگر ثبت‌نام نکرده‌اید، این ایمیل را نادیده بگیرید.`,
    button: "تأیید ایمیل",
  },
};

const escapeHtml = (text) =>
  String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// Gives the user a fresh link (replacing any older one) and emails it
async function sendVerificationEmail(user, req) {
  const token = crypto.randomBytes(32).toString("hex");
  user.verificationTokenHash = hashToken(token);
  user.verificationExpires = new Date(Date.now() + LINK_VALID_HOURS * 3600 * 1000);
  user.verificationSentAt = new Date();
  await user.save();

  const language = requestLanguage(req);
  const t = messages[language];
  const link = `${siteUrl(req)}/verify-email?token=${token}`;
  const text = t.body(user.name, link);
  const dir = language === "fa" ? "rtl" : "ltr";
  const html = `<div dir="${dir}" style="font-family:sans-serif;font-size:16px;line-height:1.6;color:#10375C">
${escapeHtml(text).split("\n").join("<br>").replace(escapeHtml(link), `<a href="${escapeHtml(link)}">${escapeHtml(link)}</a>`)}
<p><a href="${escapeHtml(link)}" style="display:inline-block;padding:12px 24px;border-radius:999px;background:#F56759;color:#fff;text-decoration:none">${t.button}</a></p>
</div>`;

  await sendMail({ to: user.email, subject: t.subject, text, html });
}

// True if another email may be sent now (limits resend spam)
const canResend = (user) =>
  !user.verificationSentAt ||
  Date.now() - user.verificationSentAt.getTime() > RESEND_WAIT_SECONDS * 1000;

module.exports = { sendVerificationEmail, hashToken, canResend };
