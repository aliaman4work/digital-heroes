import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Digital Heroes" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error('❌ Email failed:', err.message);
  }
};

export const sendWinnerEmail = async (email, name, matchType, prize, month) => {
  await sendEmail({
    to: email,
    subject: `🏆 You won the ${month} Digital Heroes Draw!`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;background:#0F172A;color:#F1F5F9;padding:40px;border-radius:16px;">
        <h1 style="color:#10B981;">Congratulations ${name}! 🎉</h1>
        <p>You matched <strong style="color:#FBBF24;">${matchType}</strong> in the <strong>${month}</strong> draw!</p>
        <div style="background:#1E293B;border-radius:12px;padding:20px;margin:20px 0;text-align:center;">
          <div style="font-size:48px;font-weight:900;color:#10B981;">£${prize.toFixed(2)}</div>
          <div style="color:#94A3B8;">Your Prize</div>
        </div>
        <p>Log in to your dashboard to upload your proof of scores and claim your prize.</p>
        <a href="${process.env.CLIENT_URL}/dashboard" 
           style="display:inline-block;background:#10B981;color:#0F172A;font-weight:bold;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px;">
          Claim Your Prize
        </a>
      </div>
    `,
  });
};

export const sendDrawResultsEmail = async (email, name, month, winningNumbers) => {
  await sendEmail({
    to: email,
    subject: `📊 ${month} Draw Results — Digital Heroes`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;background:#0F172A;color:#F1F5F9;padding:40px;border-radius:16px;">
        <h1 style="color:#10B981;">Draw Results for ${month}</h1>
        <p>Hi ${name}, the monthly draw has been completed!</p>
        <div style="background:#1E293B;border-radius:12px;padding:20px;margin:20px 0;">
          <p style="color:#94A3B8;margin-bottom:12px;">Winning Numbers:</p>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            ${winningNumbers.map(n => `<span style="background:#10B981;color:#0F172A;width:40px;height:40px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-weight:900;font-size:18px;">${n}</span>`).join('')}
          </div>
        </div>
        <a href="${process.env.CLIENT_URL}/dashboard"
           style="display:inline-block;background:#10B981;color:#0F172A;font-weight:bold;padding:12px 24px;border-radius:8px;text-decoration:none;">
          View My Results
        </a>
      </div>
    `,
  });
};