import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const data = await req.json();

    const supabase = await createClient();

    // Insert new entry
    const { error: insertError } = await supabase
      .from("waitlist_entries")
      .insert([
        {
          email: data.email,
          approved: false,
          created_at: new Date().toISOString(),
          country: null,
        },
      ]);

    if (insertError) {
      console.error("Database insertion error:", insertError);

      throw insertError;
    }

    return NextResponse.json(
      {
        message: "Successfully added to waitlist",
        data: { email: data.email },
      },
      { status: 201 },
    );
  } catch (_error) {
    const error = _error as Error;
    console.error("Failed to join the waitlist", error.message);
    if (
      error.message.includes("duplicate key value violates unique constraint")
    ) {
      console.log("Email already added to waitlist");

      return NextResponse.json(
        { message: "Email already added to waitlist" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Failed to join the waitlist" },
      { status: 500 },
    );
  }
}
