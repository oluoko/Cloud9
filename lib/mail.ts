import { Booking, User } from "@prisma/client";
import { Resend } from "resend";
import { formatDate, formatISODateToTime, capitalize } from "@/lib/utils";

const API_KEY = process.env.RESEND_API_KEY;
if (!API_KEY) {
  throw new Error("RESEND_API_KEY is not defined in environment variables");
}

const resend = new Resend(API_KEY);

const domain =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_APP_URL || "https://cloud9ine.vercel.app";

// Design tokens matching the booking page
const COLORS = {
  primary: "#16A34A",
  primaryLight: "#16A34A1A", // primary/10
  text: "#0F172A",
  textMuted: "#64748B",
  background: "#FFFFFF",
  backgroundMuted: "#F8FAFC",
  border: "#E2E8F0",
  success: "#10B981",
  destructive: "#EF4444",
};

const supportTeamLink = `${domain}/#contact-us`;

// Utility functions
const createButton = (
  label: string,
  url: string,
  variant: "primary" | "outline" = "primary"
) => {
  const styles =
    variant === "primary"
      ? `background-color: ${COLORS.primary}; color: #FFFFFF; border: 1px solid ${COLORS.primary};`
      : `background-color: transparent; color: ${COLORS.primary}; border: 1px solid ${COLORS.primary};`;

  return `
    <table border="0" cellspacing="0" cellpadding="0" style="margin: 24px 0;">
      <tr>
        <td align="center" style="border-radius: 6px; ${styles}">
          <a href="${url}" target="_blank" style="display: inline-block; padding: 12px 24px; text-decoration: none; font-weight: 500; font-size: 14px; border-radius: 6px; color: inherit;">
            ${label}
          </a>
        </td>
      </tr>
    </table>
  `;
};

const createInfoCard = (
  title: string,
  items: Array<{ label: string; value: string }>
) => `
  <div style="background-color: ${COLORS.backgroundMuted}; border: 1px solid ${COLORS.border}; border-radius: 8px; padding: 24px; margin: 24px 0;">
    <h3 style="color: ${COLORS.text}; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">${title}</h3>
    <div style="display: grid; gap: 12px;">
      ${items
        .map(
          (item) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;">
          <span style="color: ${COLORS.textMuted}; font-size: 14px;">${item.label}</span>
          <span style="color: ${COLORS.text}; font-size: 14px; font-weight: 500;">${item.value}</span>
        </div>
      `
        )
        .join("")}
    </div>
  </div>
`;

const createStatusBadge = (
  status: string,
  type: "success" | "warning" | "info" = "info"
) => {
  const colorMap = {
    success: COLORS.success,
    warning: "#F59E0B",
    info: COLORS.primary,
  };

  return `
    <span style="display: inline-block; background-color: ${colorMap[type]}20; color: ${colorMap[type]}; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 500; text-transform: uppercase;">
      ${status}
    </span>
  `;
};

const createEmailTemplate = (content: string) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cloud9</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: ${COLORS.backgroundMuted}; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: ${COLORS.text};">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="${COLORS.backgroundMuted}">
        <tr>
          <td align="center" style="padding: 32px 16px;">
            <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: ${COLORS.background}; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
              
              <!-- Header -->
              <tr>
                <td align="center" style="padding: 40px 32px 24px 32px; border-bottom: 1px solid ${COLORS.border};">
                  <div style="display: inline-block; border: 2px solid ${COLORS.primary}; border-radius: 8px; padding: 12px 16px;">
                    <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: 1px; color: ${COLORS.text};">
                      Cloud<span style="color: ${COLORS.primary};">9</span>
                    </h1>
                  </div>
                  <p style="margin: 12px 0 0 0; color: ${COLORS.textMuted}; font-size: 14px;">Fly faster, better.</p>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 32px;">
                  ${content}
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 24px 32px; background-color: ${COLORS.backgroundMuted}; border-top: 1px solid ${COLORS.border}; border-radius: 0 0 12px 12px;">
                  <div style="text-align: center; color: ${COLORS.textMuted}; font-size: 12px; line-height: 1.5;">
                    <p style="margin: 0 0 8px 0;">© ${new Date().getFullYear()} Cloud9. All rights reserved.</p>
                    <p style="margin: 0;">
                      Need help? <a href="${supportTeamLink}" style="color: ${COLORS.primary}; text-decoration: none;">Contact our support team</a>
                    </p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
`;

// Common booking details formatter
const getBookingDetails = (booking: Booking) => [
  { label: "Booking Reference", value: booking.paymentReference },
  { label: "Flight ID", value: booking.flightId },
  { label: "Seat Type", value: `${capitalize(booking.seatType)} Class` },
  {
    label: "Passengers",
    value: `${booking.seatCount} ${booking.seatCount > 1 ? "passengers" : "passenger"}`,
  },
  { label: "Total Amount", value: `Ksh ${booking.totalAmount.toFixed(2)}` },
  { label: "Payment Method", value: booking.paymentMethod || "Card" },
  { label: "Payment Status", value: capitalize(booking.paymentStatus) },
  { label: "Booking Status", value: capitalize(booking.bookingStatus) },
];

// Email functions
export const sendBookingDetailsEmail = async (booking: Booking, user: User) => {
  const bookingLink = `${domain}/bookings/${booking.id}`;

  const content = `
    <div style="text-align: center; margin-bottom: 32px;">
      ${createStatusBadge(capitalize(booking.bookingStatus), "success")}
      <h2 style="color: ${COLORS.text}; font-size: 24px; font-weight: 600; margin: 16px 0 8px 0;">Booking Confirmed!</h2>
      <p style="color: ${COLORS.textMuted}; font-size: 16px; margin: 0;">Thank you for choosing Cloud9. We're excited to have you on board.</p>
    </div>

    ${createInfoCard("Booking Details", getBookingDetails(booking))}

    <div style="background-color: ${COLORS.primaryLight}; border: 1px solid ${COLORS.primary}40; border-radius: 8px; padding: 16px; margin: 24px 0;">
      <p style="color: ${COLORS.text}; font-size: 14px; margin: 0; text-align: center;">
        📅 Booking made on ${formatDate(booking.createdAt)} at ${formatISODateToTime(booking.createdAt)}
      </p>
    </div>

    <div style="text-align: center;">
      ${createButton("View Full Booking Details", bookingLink)}
      ${createButton("Find More Flights", `${domain}/flights`, "outline")}
    </div>

    <p style="color: ${COLORS.textMuted}; font-size: 14px; text-align: center; margin-top: 24px;">
      Need to make changes? Please do so before your flight's deadline.
    </p>
  `;

  await resend.emails.send({
    from: "Cloud9 Bookings <bookings@live-ly.tech>",
    to: user.email,
    subject: `✈️ Booking Confirmed - ${booking.paymentReference}`,
    html: createEmailTemplate(content),
  });
};

export const sendBookingUpdatedDetailsEmail = async (
  booking: Booking,
  user: User
) => {
  const isAdmin = ["ADMIN", "MAIN_ADMIN"].includes(user.role);
  const bookingLink = `${domain}/${isAdmin ? "admin/" : ""}bookings/${booking.id}`;

  const content = `
    <div style="text-align: center; margin-bottom: 32px;">
      ${createStatusBadge(capitalize(booking.bookingStatus), "info")}
      <h2 style="color: ${COLORS.text}; font-size: 24px; font-weight: 600; margin: 16px 0 8px 0;">Booking Updated</h2>
      <p style="color: ${COLORS.textMuted}; font-size: 16px; margin: 0;">Your booking has been successfully updated.</p>
    </div>

    ${createInfoCard("Updated Booking Details", getBookingDetails(booking))}

    <div style="background-color: ${COLORS.primaryLight}; border: 1px solid ${COLORS.primary}40; border-radius: 8px; padding: 16px; margin: 24px 0;">
      <p style="color: ${COLORS.text}; font-size: 14px; margin: 0 0 8px 0; text-align: center;">
        📅 Originally booked: ${formatDate(booking.createdAt)} at ${formatISODateToTime(booking.createdAt)}
      </p>
      <p style="color: ${COLORS.text}; font-size: 14px; margin: 0; text-align: center;">
        🔄 Updated: ${formatDate(booking.updatedAt)} at ${formatISODateToTime(booking.updatedAt)}
      </p>
    </div>

    <div style="text-align: center;">
      ${createButton("View Updated Booking", bookingLink)}
    </div>
  `;

  await resend.emails.send({
    from: "Cloud9 Bookings <bookings@live-ly.tech>",
    to: user.email,
    subject: `📝 Booking Updated - ${booking.paymentReference}`,
    html: createEmailTemplate(content),
  });
};

export const sendDeletedBookingDetailsEmail = async (
  booking: Booking,
  user: User
) => {
  const content = `
    <div style="text-align: center; margin-bottom: 32px;">
      ${createStatusBadge("Cancelled", "warning")}
      <h2 style="color: ${COLORS.text}; font-size: 24px; font-weight: 600; margin: 16px 0 8px 0;">Booking Cancelled</h2>
      <p style="color: ${COLORS.textMuted}; font-size: 16px; margin: 0;">Your booking has been successfully cancelled.</p>
    </div>

    ${createInfoCard(
      "Cancelled Booking Details",
      getBookingDetails(booking).filter(
        (item) => item.label !== "Booking Status"
      )
    )}

    <div style="background-color: #FEF3C7; border: 1px solid #F59E0B40; border-radius: 8px; padding: 16px; margin: 24px 0;">
      <p style="color: ${COLORS.text}; font-size: 14px; margin: 0; text-align: center;">
        ⚠️ If you paid for this booking, refunds will be processed according to our refund policy.
      </p>
    </div>

    <div style="text-align: center;">
      ${createButton("Book Another Flight", `${domain}/flights`)}
    </div>
  `;

  await resend.emails.send({
    from: "Cloud9 Bookings <bookings@live-ly.tech>",
    to: user.email,
    subject: `❌ Booking Cancelled - ${booking.paymentReference}`,
    html: createEmailTemplate(content),
  });
};

export const sendBookingReminderEmail = async (
  booking: Booking,
  email: string
) => {
  const bookingLink = `${domain}/bookings/${booking.id}`;

  const content = `
    <div style="text-align: center; margin-bottom: 32px;">
      ${createStatusBadge(capitalize(booking.bookingStatus), "info")}
      <h2 style="color: ${COLORS.text}; font-size: 24px; font-weight: 600; margin: 16px 0 8px 0;">Flight Reminder</h2>
      <p style="color: ${COLORS.textMuted}; font-size: 16px; margin: 0;">Don't forget about your upcoming flight!</p>
    </div>

    ${createInfoCard("Your Booking Details", getBookingDetails(booking))}

    <div style="background-color: ${COLORS.primaryLight}; border: 1px solid ${COLORS.primary}40; border-radius: 8px; padding: 16px; margin: 24px 0;">
      <p style="color: ${COLORS.text}; font-size: 14px; margin: 0; text-align: center;">
        ⏰ Booked on ${formatDate(booking.createdAt)} at ${formatISODateToTime(booking.createdAt)}
      </p>
    </div>

    <div style="text-align: center;">
      ${createButton("View Booking Details", bookingLink)}
    </div>

    <p style="color: ${COLORS.textMuted}; font-size: 14px; text-align: center; margin-top: 24px;">
      Need to make changes? Please do so before your flight's deadline.
    </p>
  `;

  await resend.emails.send({
    from: "Cloud9 Bookings <bookings@live-ly.tech>",
    to: email,
    subject: `⏰ Flight Reminder - ${booking.paymentReference}`,
    html: createEmailTemplate(content),
  });
};

export const sendUsAMessageEmail = async (
  firstName: string,
  lastName: string,
  email: string,
  message: string
) => {
  const content = `
    <h2 style="color: ${COLORS.text}; font-size: 24px; font-weight: 600; margin: 0 0 24px 0;">
      New Message from ${firstName} ${lastName}
    </h2>
    
    <div style="background-color: ${COLORS.backgroundMuted}; border-left: 4px solid ${COLORS.primary}; padding: 20px; margin: 24px 0; border-radius: 0 8px 8px 0;">
      <p style="color: ${COLORS.text}; font-size: 16px; line-height: 1.6; margin: 0;">
        ${message}
      </p>
    </div>

    <div style="background-color: ${COLORS.primaryLight}; border: 1px solid ${COLORS.primary}40; border-radius: 8px; padding: 16px; margin: 24px 0;">
      <p style="color: ${COLORS.text}; font-size: 14px; margin: 0;">
        📧 Reply to: <a href="mailto:${email}" style="color: ${COLORS.primary}; text-decoration: none; font-weight: 500;">${email}</a>
      </p>
    </div>
  `;

  await resend.emails.send({
    from: "Cloud9 Contact <contact@live-ly.tech>",
    to: process.env.CONTACT_EMAIL || "",
    subject: `📨 New Contact Message from ${firstName} ${lastName}`,
    html: createEmailTemplate(content),
  });
};

export const messageFollowUpEmail = async (email: string, message: string) => {
  const content = `
    <div style="text-align: center; margin-bottom: 32px;">
      <h2 style="color: ${COLORS.text}; font-size: 24px; font-weight: 600; margin: 0 0 8px 0;">Message Received</h2>
      <p style="color: ${COLORS.textMuted}; font-size: 16px; margin: 0;">Thank you for contacting Cloud9. We'll get back to you soon!</p>
    </div>
    
    <div style="background-color: ${COLORS.backgroundMuted}; border-left: 4px solid ${COLORS.primary}; padding: 20px; margin: 24px 0; border-radius: 0 8px 8px 0;">
      <h3 style="color: ${COLORS.text}; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">Your Message:</h3>
      <p style="color: ${COLORS.text}; font-size: 14px; line-height: 1.6; margin: 0;">
        ${message}
      </p>
    </div>

    <div style="text-align: center;">
      ${createButton("Visit Cloud9", domain)}
    </div>
  `;

  await resend.emails.send({
    from: "Cloud9 Contact <contact@live-ly.tech>",
    to: email,
    subject: "✅ Message Received - Cloud9",
    html: createEmailTemplate(content),
  });
};
