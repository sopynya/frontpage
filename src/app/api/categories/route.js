import { NextResponse } from "next/server";
import { getUserIdFromToken } from "@/lib/auth";
import { sql } from "@/lib/db";

export async function POST(req) {
  try {
    const userId = await getUserIdFromToken();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, color } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const inserted = await sql`
      INSERT INTO categories (user_id, name, color)
      VALUES (${userId}, ${name}, ${color || null})
      RETURNING *
    `;

    return NextResponse.json(inserted[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
