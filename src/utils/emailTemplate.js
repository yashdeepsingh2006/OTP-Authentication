export const getOtpEmailTemplate = (otp, expiryMinutes = 5) => {
  const subject = `${otp} is your verification code`;
  
  const text = `Your verification code is: ${otp}\n\nThis code will expire in ${expiryMinutes} minutes. For security reasons, do not share this code with anyone.\nIf you did not request this, please ignore this email.`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${otp} is your verification code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #ffffff; -webkit-font-smoothing: antialiased;">
  <!-- Preview Text -->
  <div style="display: none; max-height: 0px; overflow: hidden; opacity: 0; mso-hide: all; font-size: 1px; line-height: 1px; color: #000000;">
    Your one-time verification code is ${otp}. Valid for ${expiryMinutes} minutes.
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #000000; padding: 56px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 460px; background-color: #0e0e0e; border-radius: 24px; box-shadow: 0 30px 60px rgba(0, 0, 0, 0.8); overflow: hidden;">
          
          <!-- Content Area -->
          <tr>
            <td style="padding: 48px 40px 40px 40px; text-align: center;">

              <!-- Minimalist Eyebrow Tag -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto 28px auto;">
                <tr>
                  <td align="center" style="background-color: #1a1a1a; border-radius: 9999px; padding: 6px 16px;">
                    <span style="font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #888888;">
                      Authentication
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Heading -->
              <h1 style="margin: 0 0 12px 0; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px; line-height: 1.25;">
                Verification Code
              </h1>

              <!-- Subheading -->
              <p style="margin: 0 0 36px 0; font-size: 14px; line-height: 22px; color: #8c8c8c; font-weight: 400;">
                Enter the code below to complete your verification.
              </p>

              <!-- Sleek Grayscale OTP Display Block (Zero Borders) -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 0 auto 24px auto;">
                <tr>
                  <td align="center" style="background-color: #171717; border-radius: 16px; padding: 24px 16px;">
                    <div style="font-family: 'SF Mono', 'Geist Mono', Consolas, 'Liberation Mono', Menlo, Monaco, monospace; font-size: 42px; font-weight: 700; letter-spacing: 14px; color: #ffffff; padding-left: 14px;">
                      ${otp}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Expiry Pill (Grayscale, No Borders) -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto 36px auto;">
                <tr>
                  <td align="center" style="background-color: #1a1a1a; border-radius: 9999px; padding: 6px 16px;">
                    <span style="font-size: 12px; font-weight: 500; color: #999999; letter-spacing: 0.2px;">
                      Expires in ${expiryMinutes} minutes
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Security Advisory (Seamless whitespace, No Border divider) -->
              <p style="margin: 0; font-size: 12px; line-height: 20px; color: #555555;">
                Do not share this code with anyone. If you didn't request this verification, you can safely disregard this email.
              </p>

            </td>
          </tr>

          <!-- Minimal Footer (Seamless, No Borders) -->
          <tr>
            <td style="background-color: #080808; padding: 22px 40px; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #404040; letter-spacing: 0.4px;">
                Secure OTP Verification Service • Automated Message
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
};
