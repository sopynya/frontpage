import { sql } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
    const {email, password} = await req.json();

    if (!email || !password) {
        return NextResponse.json(
            { error: "Invalid data" },
            { status: 400 }
        );
    }

    const exists = await sql`SELECT 1 FROM users WHERE email = ${email}`;

    if (exists.length > 0) {
        return NextResponse.json(
            { error: "Email already exists" },
            { status: 409 }
        );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await sql`INSERT INTO users (email, password_hash) VALUES (${email}, ${hashedPassword}) RETURNING id`;

    const userId = user[0].id;

    const token = jwt.sign(
        {id: userId},
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
    );

    const res = NextResponse.json({ success: true });

    res.cookies.set("token", token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7, 
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });

    return res;
}