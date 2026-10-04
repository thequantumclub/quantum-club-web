import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "onboarding@resend.dev";

// ─────────────────────────────────────────────
// EMAIL 1: Booking Confirmation (sent on submit)
// ─────────────────────────────────────────────
export interface BookingConfirmationParams {
  toEmail: string;
  customerName: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  quantity: number;
  amount: number;
  utr: string;
}

export async function sendBookingConfirmationEmail(params: BookingConfirmationParams) {
  const { toEmail, customerName, eventTitle, eventDate, eventTime, eventVenue, quantity, amount, utr } = params;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><title>Booking Received</title></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td align="center" style="padding:32px 0 24px;">
          <div style="background:linear-gradient(135deg,#7c3aed,#4f46e5);display:inline-block;padding:10px 28px;border-radius:999px;">
            <span style="color:#fff;font-size:18px;font-weight:800;letter-spacing:3px;">QUANTUM CLUB</span>
          </div>
        </td></tr>
        <tr><td style="background:#111;border-radius:20px;border:1px solid #2a2a2a;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#f59e0b,#d97706);padding:36px 32px;text-align:center;">
            <p style="margin:0 0 8px;color:#fef3c7;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Booking Received</p>
            <h1 style="margin:0 0 8px;color:#fff;font-size:26px;font-weight:800;">⏳ Pending Verification</h1>
            <p style="margin:0;color:#fde68a;font-size:15px;">We've received your booking and are verifying your payment.</p>
          </div>
          <div style="padding:32px;">
            <p style="margin:0 0 24px;color:#94a3b8;font-size:15px;line-height:1.6;">
              Hi <strong style="color:#e2e8f0;">${customerName}</strong>,<br/>
              Your booking for <strong style="color:#fbbf24;">${eventTitle}</strong> is received! Our team will verify your UPI payment and send your QR ticket once confirmed — usually within a few hours.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a2e;border-radius:12px;border:1px solid #2a2a2a;margin-bottom:24px;">
              <tr><td style="padding:16px 24px;border-bottom:1px solid #2a2a2a;">
                <p style="margin:0 0 4px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Event</p>
                <p style="margin:0;color:#fff;font-size:16px;font-weight:700;">${eventTitle}</p>
              </td></tr>
              <tr><td style="padding:16px 24px;border-bottom:1px solid #2a2a2a;">
                <p style="margin:0 0 4px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1px;">📅 Date &amp; Time</p>
                <p style="margin:0;color:#e2e8f0;font-size:15px;">${eventDate} &bull; ${eventTime}</p>
              </td></tr>
              <tr><td style="padding:16px 24px;border-bottom:1px solid #2a2a2a;">
                <p style="margin:0 0 4px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1px;">📍 Venue</p>
                <p style="margin:0;color:#e2e8f0;font-size:15px;">${eventVenue}</p>
              </td></tr>
              <tr><td style="padding:16px 24px;border-bottom:1px solid #2a2a2a;">
                <p style="margin:0 0 4px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1px;">🎟️ Tickets</p>
                <p style="margin:0;color:#e2e8f0;font-size:15px;">${quantity} ticket${quantity > 1 ? "s" : ""} &bull; ₹${amount}</p>
              </td></tr>
              <tr><td style="padding:16px 24px;">
                <p style="margin:0 0 4px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1px;">💳 UTR Number</p>
                <p style="margin:0;color:#fbbf24;font-size:15px;font-family:monospace;">${utr}</p>
              </td></tr>
            </table>
            <p style="margin:0;color:#475569;font-size:13px;text-align:center;line-height:1.6;">
              You'll receive another email with your QR ticket once payment is verified.<br/>
              Questions? Contact us at <a href="mailto:thequantumcomedyclub@gmail.com" style="color:#a78bfa;">thequantumcomedyclub@gmail.com</a>
            </p>
          </div>
        </td></tr>
        <tr><td align="center" style="padding:24px 0 0;">
          <p style="margin:0;color:#1e293b;font-size:12px;">&copy; 2026 Quantum Club &middot; Parbhani, Maharashtra</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [toEmail],
      subject: `The Quantum Club | Booking Received - ${eventTitle}`,
      html,
    });
    if (error) console.error("[Resend] Booking email failed:", error);
    else console.log("[Resend] Booking email sent:", data?.id);
    return { success: !error };
  } catch (err) {
    console.error("[Resend] Booking email error:", err);
    return { success: false };
  }
}

// ─────────────────────────────────────────────
// EMAIL 2: Ticket Confirmed (sent after verified)
// ─────────────────────────────────────────────
interface TicketEmailParams {
  toEmail: string;
  customerName: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  tickets: { ticketNumber: string; qrToken: string }[];
  myTicketsUrl: string;
}

function buildTicketEmail(params: TicketEmailParams): string {
  const {
    customerName,
    eventTitle,
    eventDate,
    eventTime,
    eventVenue,
    tickets,
    myTicketsUrl,
  } = params;

  const ticketRows = tickets
    .map(
      (t) => `
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #2a2a2a; color: #e2e8f0; font-family: monospace; font-size: 15px; letter-spacing: 1px;">
          🎟️ ${t.ticketNumber}
        </td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your Quantum Club Ticket</title>
</head>
<body style="margin:0; padding:0; background-color:#0a0a0a; font-family: 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding: 32px 0 24px;">
              <div style="background: linear-gradient(135deg, #7c3aed, #4f46e5); display:inline-block; padding: 10px 28px; border-radius: 999px;">
                <span style="color: #ffffff; font-size: 18px; font-weight: 800; letter-spacing: 3px;">QUANTUM CLUB</span>
              </div>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background: #111111; border-radius: 20px; border: 1px solid #2a2a2a; overflow: hidden;">

              <!-- Gradient Banner -->
              <div style="background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); padding: 40px 32px; text-align: center;">
                <p style="margin: 0 0 8px; color: #c4b5fd; font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">Your ticket is confirmed</p>
                <h1 style="margin: 0 0 8px; color: #ffffff; font-size: 28px; font-weight: 800; line-height: 1.2;">🎉 You're in!</h1>
                <p style="margin: 0; color: #e0d9ff; font-size: 16px;">Get ready for an unforgettable night.</p>
              </div>

              <!-- Body -->
              <div style="padding: 32px;">

                <p style="margin: 0 0 24px; color: #94a3b8; font-size: 15px; line-height: 1.6;">
                  Hi <strong style="color: #e2e8f0;">${customerName}</strong>,<br/>
                  Your booking has been <strong style="color: #a78bfa;">verified</strong> and your ticket(s) are ready. See you there! 🎶
                </p>

                <!-- Event Details -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a2e; border-radius:12px; border: 1px solid #2a2a2a; margin-bottom: 24px;">
                  <tr>
                    <td style="padding: 20px 24px; border-bottom: 1px solid #2a2a2a;">
                      <p style="margin: 0 0 4px; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Event</p>
                      <p style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 700;">${eventTitle}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 16px 24px; border-bottom: 1px solid #2a2a2a;">
                      <p style="margin: 0 0 4px; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">📅 Date</p>
                      <p style="margin: 0; color: #e2e8f0; font-size: 15px;">${eventDate}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 16px 24px; border-bottom: 1px solid #2a2a2a;">
                      <p style="margin: 0 0 4px; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">⏰ Time</p>
                      <p style="margin: 0; color: #e2e8f0; font-size: 15px;">${eventTime}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 16px 24px;">
                      <p style="margin: 0 0 4px; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">📍 Venue</p>
                      <p style="margin: 0; color: #e2e8f0; font-size: 15px;">${eventVenue}</p>
                    </td>
                  </tr>
                </table>

                <!-- Ticket Numbers -->
                <p style="margin: 0 0 12px; color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Your Ticket(s)</p>
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a2e; border-radius:12px; border: 1px solid #2a2a2a; margin-bottom: 28px;">
                  ${ticketRows}
                </table>

                <!-- CTA Button -->
                <div style="text-align: center; margin-bottom: 24px;">
                  <a href="${myTicketsUrl}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #4f46e5); color: #ffffff; text-decoration: none; padding: 14px 36px; border-radius: 999px; font-weight: 700; font-size: 15px; letter-spacing: 0.5px;">
                    View QR Ticket &rarr;
                  </a>
                </div>

                <p style="margin: 0; color: #475569; font-size: 13px; text-align: center; line-height: 1.6;">
                  Show your QR code at the entry gate.<br/>
                  Each ticket can only be scanned once.
                </p>

              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 28px 0 0;">
              <p style="margin: 0 0 8px; color: #334155; font-size: 12px;">
                Questions? Contact us at <a href="mailto:thequantumcomedyclub@gmail.com" style="color: #7c3aed; text-decoration: none;">thequantumcomedyclub@gmail.com</a>
              </p>
              <p style="margin: 0; color: #1e293b; font-size: 12px;">© 2026 Quantum Club &middot; Parbhani, Maharashtra</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendTicketEmail(params: TicketEmailParams) {
  try {
    const html = buildTicketEmail(params);

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [params.toEmail],
      // "The Quantum Club" branding clearly in the subject
      subject: `The Quantum Club | 🎟️ Your ticket for ${params.eventTitle} is confirmed!`,
      html,
    });

    if (error) {
      console.error("[Resend] Failed to send ticket email:", error);
      return { success: false, error };
    }

    console.log("[Resend] Ticket email sent:", data?.id);
    return { success: true, id: data?.id };
  } catch (err) {
    console.error("[Resend] Unexpected error:", err);
    return { success: false, error: err };
  }
}
