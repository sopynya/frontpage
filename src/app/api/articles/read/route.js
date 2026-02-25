import { NextResponse } from "next/server";
import { getUserIdFromToken } from "@/lib/auth";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const userId = await getUserIdFromToken();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rows = await sql`
      SELECT article_url FROM user_article_status WHERE user_id = ${userId}
    `;

    const articles = rows.map((r) => r.article_url);
    return NextResponse.json({ articles });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch read articles" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const userId = await getUserIdFromToken();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const articleUrl = body.articleUrl || body.articleId || body.article_id;

    if (!articleUrl) {
      return NextResponse.json(
        { error: "articleUrl is required" },
        { status: 400 }
      );
    }

    const existing = await sql`
      SELECT id FROM user_article_status 
      WHERE user_id = ${userId} AND article_url = ${articleUrl}
    `;

    if (existing.length > 0) {
      return NextResponse.json({ already: true });
    }

    const inserted = await sql`
      INSERT INTO user_article_status (user_id, article_url)
      VALUES (${userId}, ${articleUrl})
      RETURNING *
    `;

    return NextResponse.json(inserted[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to mark article as read" },
      { status: 500 }
    );
  }
}
