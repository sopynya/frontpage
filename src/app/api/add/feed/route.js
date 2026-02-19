import { NextResponse } from "next/server"
import Parser from "rss-parser"
import { getUserIdFromToken } from "@/lib/auth"
import { sql } from "@/lib/db"
import { validateUrl } from "@/lib/validateUrl"

const parser = new Parser()

export async function POST(req) {
  try {
    const userId = await getUserIdFromToken()

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { url, categoryId } = await req.json()

    if (!url) {
      return NextResponse.json(
        { error: "RSS URL is required" },
        { status: 400 }
      )
    }

    const existing = await sql`
        SELECT id FROM user_feeds
        WHERE user_id = ${userId}
        AND site_rss = ${url}`

    if (existing.length > 0) {
        return NextResponse.json(
            { error: "Feed already added" },
            { status: 409 }
        )
    }

    if (!validateUrl(url)) {
        return NextResponse.json(
            { error: "Invalid URL" },
            { status: 400 }
        )
    }



    const feed = await parser.parseURL(url)

    if (!feed) {
      return NextResponse.json(
        { error: "Invalid RSS feed" },
        { status: 400 }
      )
    }

    const title = feed.title || "Untitled"
    const description = feed.description || ""
    const siteUrl = feed.link || ""
    const imageUrl =
      feed.image?.url ||
      feed.itunes?.image ||
      feed.icon ||
      ""

    const inserted = await sql`
      INSERT INTO user_feeds (
        user_id,
        category_id,
        title,
        site_url,
        description,
        site_rss,
        image_url
      )
      VALUES (
        ${userId},
        ${categoryId || null},
        ${title},
        ${siteUrl},
        ${description},
        ${url},
        ${imageUrl}
      )
      RETURNING *
    `

    return NextResponse.json(inserted[0])
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Failed to add feed" },
      { status: 500 }
    )
  }
}
