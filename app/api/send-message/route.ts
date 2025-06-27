import { getUserByClerkId } from "@/lib/auth";
import { messageFollowUpEmail, sendUsAMessageEmail } from "@/lib/mail";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, message } = await request.json();

    if (!firstName || !lastName || !email || !message) {
      return new Response(
        JSON.stringify({ error: "All fields are required." }),
        { status: 400 }
      );
    }

    // Call the function to send the email
    await sendUsAMessageEmail(firstName, lastName, email, message);

    const user = await getUserByClerkId();

    if (user) {
      await messageFollowUpEmail(user.email, message);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error sending message:", error);
    return new Response(JSON.stringify({ error: "Failed to send message." }), {
      status: 500,
    });
  }
}
