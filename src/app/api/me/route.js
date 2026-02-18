import { NextResponse } from "next/server"
import { getUserIdFromToken } from "@/lib/auth" 
export async function GET() {
    const user = getUserIdFromToken();

    if (!user) {
        return NextResponse.json(null, { status: 401 })
    }

    return NextResponse.json(user)
}