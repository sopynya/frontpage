import { NextResponse } from "next/server"
import { getUserIdFromToken } from "@/lib/auth"
import { sql } from "@/lib/db"
import Parser from "rss-parser"
import guestData from "@/data/sample.json"

const parser = new Parser()

export async function GET() {
    try {
        const userId = await getUserIdFromToken();

        let feeds = []

        if(userId) {
            feeds = await sql`SELECT id, title, site_rss, image_url, category_id FROM user_feeds WHERE user_id = ${userId}`;
        } else {
            feeds = guestData.categories.flatMap((cat, catIndex) => 
                cat.feeds.map((feed, feedIndex) => ({
                    id: `feed-${catIndex}-${feedIndex}`,
                    title: feed.title,
                    site_rss: feed.feedUrl,
                    image_url: feed.imageUrl,
                    category_id: `cat-${catIndex}`
                }))
            )
        }

        

        const allItems = await Promise.all(
            feeds.map(async (feed) => {
                try {
                    const rss = await parser.parseURL(feed.site_rss);

                    return rss.items.slice(0, 10).map((item) => ({
                        id: item.guid ||item.link,
                        feed_id: feed.id,
                        feed_title: feed.title,
                        feed_image: feed.image_url,
                        category_id: feed.category_id,
                        title: item.title || "Untitled",
                        link: item.link,
                        published_at: item.pubDate ? new Date(item.pubDate) : new Date(),
                    }))
                } catch (err) {
                    console.error("RSS error:", feed.site_rss)
                    return []
                }
            })
        );

        const articles = allItems.flat().sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
        

        return NextResponse.json(articles);
    } catch(err) {
        console.error(err);
        return NextResponse.json(
            { error: "Failed to load articles" },
            { status: 500 }
        )
    }
}