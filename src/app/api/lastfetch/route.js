import { NextResponse } from "next/server"
import { getUserIdFromToken } from "@/lib/auth"
import { sql } from "@/lib/db"
import guestData from "@/data/sample.json"

export async function GET() {
  try {
    const userId = await getUserIdFromToken()

    let result = {}

    if (userId) {
      const feeds = await sql`
        SELECT id, last_fetched_at
        FROM user_feeds
        WHERE user_id = ${userId}
      `

      result = Object.fromEntries(
        feeds.map((feed) => [
          feed.id,
          feed.last_fetched_at || new Date()
        ])
      )

    } else {
      result = Object.fromEntries(
        guestData.categories.flatMap((cat) =>
          cat.feeds.map((feed) => [
            feed.id || feed.feedUrl,
            feed.last_fetched_at || new Date()
          ])
        )
      )
    }

    return NextResponse.json(result)

  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Failed to load lastFetchedAt" },
      { status: 500 }
    )
  }
}
