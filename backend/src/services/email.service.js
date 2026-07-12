import nodemailer from 'nodemailer';
import env from '../config/env.js';
import logger from '../utils/logger.js';

let transporter = null;

if (env.SMTP.host && env.SMTP.user) {
  transporter = nodemailer.createTransport({
    host: env.SMTP.host,
    port: env.SMTP.port,
    secure: env.SMTP.port === 465,
    auth: {
      user: env.SMTP.user,
      pass: env.SMTP.pass,
    },
  });
}

export const sendEmail = async ({ to, subject, html, text }) => {
  if (!transporter) {
    logger.warn('Email transporter not configured; skipping send', { to, subject });
    return { sent: false };
  }
  try {
    const info = await transporter.sendMail({
      from: env.SMTP.from,
      to,
      subject,
      text: text || html.replace(/<[^>]+>/g, ''),
      html,
    });
    logger.info('Email sent', { to, subject, messageId: info.messageId });
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Email send failed', { error: error.message, to });
    return { sent: false, error: error.message };
  }
};

export default sendEmail;
