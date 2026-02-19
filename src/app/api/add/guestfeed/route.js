import { NextResponse } from "next/server"
import Parser from "rss-parser"
import { validateUrl } from "@/lib/validateUrl"

const parser = new Parser()

export async function POST(req) {
  try {
    const { url } = await req.json()

    if (!validateUrl(url)) {
      return NextResponse.json(
        { error: "Invalid URL" },
        { status: 400 }
      )
    }

    const feed = await parser.parseURL(url)

    const data = {
      id: crypto.randomUUID(),
      title: feed.title || "Untitled",
      description: feed.description || "",
      site_url: feed.link || "",
      site_rss: url,
      image_url:
        feed.image?.url ||
        feed.itunes?.image ||
        feed.icon ||
        ""
    }

    return NextResponse.json(data)

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Failed to parse feed" },
      { status: 500 }
    )
  }
}
