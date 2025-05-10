import { getUserByClerkId } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const user = await getUserByClerkId();

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error while getting user::::", error);
    return NextResponse.json({ error: `Failed to get user:::: ${error}` });
  }
}
