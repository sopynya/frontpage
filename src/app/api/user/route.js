import { NextResponse } from "next/server"
import { getUserIdFromToken } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET() {
    const userId = await getUserIdFromToken();

    if(!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const categories = await sql`SELECT * FROM categories WHERE user_id = ${userId}`;
    const feeds = await sql`SELECT * FROM user_feeds WHERE user_id = ${userId}`;

    return NextResponse.json({
        categories: categories,
        feeds: feeds
    })
}