import { NextResponse } from "next/server"
import { getUserIdFromToken } from "@/lib/auth"
import { sql } from "@/lib/db"
import Parser from "rss-parser"

const parser = new Parser()

export async function GET() {
    const userId = await getUserIdFromToken();

    if (!userId) {
        return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }

    try {
        const rows = await sql`
            SELECT article_url
            FROM saved
            WHERE user_id = ${userId}
        `

        if (!rows.length) {
            return NextResponse.json({ articles: [] })
        }

        const feeds = await Promise.all(
            rows.map(row => parser.parseURL(row.article_url))
        );

        const articles = feeds.flatMap(feed => feed.items);

        return NextResponse.json({ articles });

    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        const userId = await getUserIdFromToken();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { articleUrl } = await req.json();
        if (!articleUrl) return NextResponse.json({ error: 'articleUrl is required' }, { status: 400 });

        const inserted = await sql`
            INSERT INTO saved (user_id, article_url)
            VALUES (${userId}, ${articleUrl})
            RETURNING *
        `;

        return NextResponse.json({ ok: true, saved: inserted[0] });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to save article' }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const userId = await getUserIdFromToken();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { articleUrl } = await req.json();
        if (!articleUrl) return NextResponse.json({ error: 'articleUrl is required' }, { status: 400 });

        await sql`
            DELETE FROM saved WHERE user_id = ${userId} AND article_url = ${articleUrl}
        `;

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to remove saved article' }, { status: 500 });
    }
}