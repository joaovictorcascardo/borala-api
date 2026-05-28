import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.hostinger.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetLink = `${frontendUrl}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"Borala" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Redefinição de senha — Borala",
    html: `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
      <body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 16px;">
          <tr><td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">

              <!-- Header -->
              <tr><td style="background:linear-gradient(135deg,#2563eb 0%,#4f46e5 100%);border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
                <div style="display:inline-flex;align-items:center;gap:10px;">
                  <div style="width:40px;height:40px;background:rgba(255,255,255,0.2);border-radius:10px;display:inline-block;text-align:center;line-height:40px;font-size:22px;">✈️</div>
                  <span style="font-size:26px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">Borala</span>
                </div>
                <p style="color:rgba(255,255,255,0.75);font-size:13px;margin:8px 0 0;">App de caronas</p>
              </td></tr>

              <!-- Body -->
              <tr><td style="background:#ffffff;padding:40px;">
                <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a;">Redefinição de senha</h1>
                <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
                  Recebemos uma solicitação para redefinir a senha da sua conta no <strong style="color:#2563eb;">Borala</strong>.
                  Clique no botão abaixo para criar uma nova senha.
                </p>

                <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:24px;text-align:center;">
                  <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;">Link expira em</p>
                  <p style="margin:0;font-size:20px;font-weight:700;color:#0f172a;">1 hora ⏳</p>
                </div>

                <a href="${resetLink}"
                  style="display:block;text-align:center;padding:14px 24px;background:linear-gradient(135deg,#2563eb,#4f46e5);color:#ffffff;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;letter-spacing:0.01em;">
                  Redefinir minha senha →
                </a>

                <p style="margin:24px 0 0;font-size:13px;color:#94a3b8;line-height:1.6;text-align:center;">
                  Se você não solicitou isso, ignore este e-mail.<br>Sua senha permanecerá a mesma.
                </p>
              </td></tr>

              <!-- Footer -->
              <tr><td style="background:#f8fafc;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
                <p style="margin:0;font-size:12px;color:#94a3b8;">© 2026 Borala · contato@kodabr.com</p>
              </td></tr>

            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `,
  });
}
