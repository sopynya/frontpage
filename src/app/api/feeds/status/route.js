import { NextResponse } from "next/server";
import { getUserIdFromToken } from "@/lib/auth";
import { sql } from "@/lib/db";
import Parser from "rss-parser";
import guestData from "@/data/sample.json";

const parser = new Parser();

export async function GET() {
  try {
    const userId = await getUserIdFromToken();

    let feeds = [];
    if (userId) {
      feeds = await sql`SELECT id, title, site_rss, image_url FROM user_feeds WHERE user_id = ${userId}`;
    } else {
      feeds = guestData.categories.flatMap((cat, catIndex) =>
        cat.feeds.map((feed, feedIndex) => ({
          id: `feed-${catIndex}-${feedIndex}`,
          title: feed.title,
          site_rss: feed.feedUrl,
        }))
      );
    }

    const results = await Promise.all(
      feeds.map(async (f) => {
        try {
          const rss = await parser.parseURL(f.site_rss);
          if (rss && Array.isArray(rss.items) && rss.items.length > 0) {
            return { feed_id: f.id, title: f.title, status: "green" };
          }
          return { feed_id: f.id, title: f.title, status: "yellow" };
        } catch (err) {
          return { feed_id: f.id, title: f.title, status: "red" };
        }
      })
    );

    return NextResponse.json({ statuses: results });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to get feed statuses" }, { status: 500 });
  }
}
