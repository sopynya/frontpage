import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
    const feeds = await sql`SELECT f.*, fp.save_count FROM feeds f 
    LEFT JOIN feed_popularity fp ON fp.feed_id = f.id 
    ORDER BY fp.save_count DESC NULLS LAST LIMIT 30`;

    return NextResponse.json(feeds)
}