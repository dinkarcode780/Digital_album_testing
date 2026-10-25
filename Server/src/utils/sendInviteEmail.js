import nodemailer from "nodemailer";

const escapeHtml = (str) =>
  String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendInviteEmail = async (email, inviteLink, name = "Guest") => {
  const mailOptions = {
    from: `"Album Studio" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "You're Invited to View Your Wedding Album 💍",

    html: `
      <div style="font-family:Arial,sans-serif;padding:20px">
        <h2>Album Studio</h2>

        <p>Hello <strong>${escapeHtml(name)}</strong>,</p>

        <p>
          You have been invited to access your wedding album.
        </p>

        <p>
          Click the button below to accept your invitation.
        </p>

        <a
          href="${escapeHtml(inviteLink)}"
          style="
            display:inline-block;
            background:#7e22ce;
            color:#fff;
            padding:12px 24px;
            text-decoration:none;
            border-radius:6px;
          "
        >
          Accept Invitation
        </a>

        <p style="margin-top:20px">
          Or copy this link:
        </p>

        <p>${escapeHtml(inviteLink)}</p>

        <p>
          Regards,<br/>
          Album Studio
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    throw err;
  }
};

export default sendInviteEmail;