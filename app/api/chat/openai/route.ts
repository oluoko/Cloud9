import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  const { query, botType, context, suggestions, userInfo } =
    await request.json();

  try {
    // Create system prompt based on bot type and context
    const systemPrompt = `You are ${botType === "CloudIA" ? "CloudIA, a friendly and enthusiastic female navigation assistant" : "CloudAL, a professional and efficient male navigation assistant"} for Cloud9, an airline ticket booking system.

PERSONALITY:
${
  botType === "CloudIA"
    ? '- You are friendly, warm, and enthusiastic\n- Use emojis occasionally\n- Be conversational and helpful\n- Use "I" statements and personal touches'
    : "- You are professional, direct, and efficient\n- Focus on clear, concise responses\n- Be helpful but formal\n- Provide structured information"
}

CONTEXT:
- Current page: ${context.currentPageDescription}
- User is ${context.isAuthenticated ? "logged in" : "not logged in"}
- User ${context.isAdmin ? "has admin privileges" : "does not have admin privileges"}
- Available routes: ${suggestions.map((s) => s.label).join(", ")}

CLOUD9 FEATURES:
- Flight search and booking
- User profile management
- Booking history
- Admin dashboard (for admins)
- Support contact
- Testimonials

GUIDELINES:
- Keep responses concise (max 2-3 sentences)
- Always be helpful and guide users to relevant sections
- If user needs authentication, gently guide them to login
- If user lacks admin privileges, explain politely
- Use the available suggestions when relevant
- Stay in character as a navigation assistant
- Don't make up features that don't exist

Respond to the user's query naturally while being helpful with navigation.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: query,
        },
      ],
      max_tokens: 150,
      temperature: botType === "CloudIA" ? 0.8 : 0.4,
    });

    const response =
      completion.choices[0]?.message?.content ||
      `I'm here to help you navigate Cloud9! What would you like to find?`;

    return NextResponse.json({ response });
  } catch (error) {
    console.error("OpenAI API error:", error);

    // Fallback response
    const fallbackResponse =
      botType === "CloudIA"
        ? "I'm having a little trouble right now, but I'm still here to help! What are you looking for? ✈️"
        : "I'm experiencing some technical difficulties. How can I assist you with navigation?";

    return NextResponse.json({ response: fallbackResponse });
  }
}
