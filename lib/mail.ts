import { Booking, User } from "@prisma/client";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_APP_URL;

const BRAND_COLOR = "#16A34A";
const BRAND_COLOR_DARK = "#0D9B3A";
const TEXT_COLOR = "#333333";
const BACKGROUND_COLOR = "#F9F9F9";

// Common email template with consistent branding
const createEmailTemplate = (content: string) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cloud9</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: ${BACKGROUND_COLOR}; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: ${TEXT_COLOR};">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="${BACKGROUND_COLOR}">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #FFFFFF; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                <!-- Header with Logo -->
                <tr>
                  <td align="center" style="padding: 30px 30px 20px 30px; border-bottom: 1px solid #EEEEEE;">
                    <h1 style="margin-top: 15px; color: ${BRAND_COLOR}; font-size: 24px; font-weight: bold;">Cloud9</h1>
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style="padding: 30px;">
                    ${content}
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="padding: 20px 30px; background-color: #F5F5F5; border-radius: 0 0 8px 8px; font-size: 12px; color: #666666; text-align: center;">
                    <p>© ${new Date().getFullYear()} Cloud9. All rights reserved.</p>
                    <p>Fly faster, better.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

// Button style for CTAs
const createButton = (label: string, url: string) => {
  return `
    <table border="0" cellspacing="0" cellpadding="0" style="margin: 30px auto;">
      <tr>
        <td align="center" style="border-radius: 4px;" bgcolor="${BRAND_COLOR}">
          <a href="${url}" target="_blank" style="display: inline-block; padding: 12px 24px; color: #FFFFFF; text-decoration: none; font-weight: bold; font-size: 16px; border-radius: 4px;">
            ${label}
          </a>
        </td>
      </tr>
    </table>
  `;
};

export const sendBookingDetailsEmail = async (booking: Booking, user: User) => {
  const bookingLink = `${domain}/bookings/${booking.id}`;

  const content = `
    <h2 style="color: ${BRAND_COLOR}; margin-bottom: 20px;">Booking Confirmation</h2>
    <p style="font-size: 16px; line-height: 1.5; margin-bottom: 15px;">Thank you for your booking! We're excited to have you on board.</p>
    <p style="font-size: 16px; line-height: 1.5; margin-bottom: 25px;">To view your booking details, please click the button below:</p>
    ${createButton("View Booking", bookingLink)}
    <p style="font-size: 14px; line-height: 1.5; margin-top: 25px;">If you have any questions or need assistance, feel free to reach out to our support team.</p>
  `;

  await resend.emails.send({
    from: "Cloud9-Booking@live-ly.tech",
    to: user.email,
    subject: "Details for booking made with Cloud9",
    html: createEmailTemplate(content),
  });
};

export const sendBookingReminderEmail = async (
  booking: Booking,
  user: User
) => {
  const bookingLink = `${domain}/bookings/${booking.id}`;

  const content = `
    <h2 style="color: ${BRAND_COLOR}; margin-bottom: 20px;">Booking Reminder</h2>
    <p style="font-size: 16px; line-height: 1.5; margin-bottom: 15px;">This is a friendly reminder about your upcoming booking.</p>
    <p style="font-size: 16px; line-height: 1.5; margin-bottom: 25px;">To view your booking details, please click the button below:</p>
    ${createButton("View Booking", bookingLink)}
    <p style="font-size: 14px; line-height: 1.5; margin-top: 25px;">If you have any questions or need assistance, feel free to reach out to our support team.</p>
  `;

  await resend.emails.send({
    from: "Cloud9-Booking@live-ly.tech",
    to: user.email,
    subject: "Reminder for your upcoming booking",
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
    <h2 style="color: ${BRAND_COLOR}; margin-bottom: 20px;">New Message from ${firstName} ${lastName}</h2>
    <p style="font-size: 16px; line-height: 1.5; margin-bottom: 15px;">You have received a new message:</p>
    <blockquote style="background-color: #F5F5F5; padding: 15px; border-left: 4px solid ${BRAND_COLOR}; margin-bottom: 25px;">
      <p style="margin: 0;">${message}</p>
    </blockquote>
    <p style="font-size: 14px; line-height: 1.5;">You can reply to this message by contacting the sender at <a href="mailto:${email}" style="color: ${BRAND_COLOR};">${email}</a>.</p>
  `;

  await resend.emails.send({
    from: "Cloud9-User@live-ly.tech",
    to: process.env.CONTACT_EMAIL || "",
    subject: "New Message from ${firstName} ${lastName}",
    html: createEmailTemplate(content),
  });
};
