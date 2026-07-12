import env from '../config/env.js';

const base = env.FRONTEND_URL;

export const emailTemplates = {
  welcome: (name) => ({
    subject: 'Welcome to LazerVault AI & Machine Learning',
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
      <h1 style="color:#7c3aed">Welcome to LazerVault</h1>
      <p>Hi ${name},</p>
      <p>Thanks for joining <strong>LazerVault AI &amp; Machine Learning</strong>. Learn today, build tomorrow, master AI.</p>
      <p><a href="${base}/courses" style="background:#7c3aed;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">Browse Courses</a></p>
    </div>`,
  }),

  verification: (name, token) => ({
    subject: 'Verify your LazerVault email',
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
      <h1 style="color:#7c3aed">Verify your email</h1>
      <p>Hi ${name},</p>
      <p>Use the code below to verify your account:</p>
      <p style="font-size:24px;font-weight:bold;letter-spacing:4px">${token}</p>
      <p>Or click <a href="${base}/verify-email?token=${token}">here</a>.</p>
    </div>`,
  }),

  passwordReset: (name, token) => ({
    subject: 'Reset your LazerVault password',
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
      <h1 style="color:#7c3aed">Password Reset</h1>
      <p>Hi ${name},</p>
      <p>Use this code to reset your password (valid for 15 minutes):</p>
      <p style="font-size:24px;font-weight:bold;letter-spacing:4px">${token}</p>
      <p>If you didn't request this, ignore this email.</p>
    </div>`,
  }),

  purchaseConfirmation: (name, orderRef, items, total) => ({
    subject: `Order confirmed - ${orderRef}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
      <h1 style="color:#7c3aed">Thank you for your purchase!</h1>
      <p>Hi ${name},</p>
      <p>Order <strong>${orderRef}</strong> was successful.</p>
      <ul>${items.map((i) => `<li>${i.title} - ${i.price}</li>`).join('')}</ul>
      <p>Total: <strong>${total}</strong></p>
    </div>`,
  }),

  instructorApproval: (name) => ({
    subject: 'Your instructor account was approved',
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
      <h1 style="color:#7c3aed">You're approved!</h1>
      <p>Hi ${name},</p>
      <p>Your instructor account on LazerVault has been approved. You can now upload content.</p>
    </div>`,
  }),

  newsletter: (name) => ({
    subject: 'LazerVault Newsletter',
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
      <h1 style="color:#7c3aed">Latest from LazerVault</h1>
      <p>Hi ${name || 'there'},</p>
      <p>Check out our newest AI & ML courses and recordings.</p>
    </div>`,
  }),
};

export default emailTemplates;
