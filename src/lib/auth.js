import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getUserIdFromToken() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return null
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload.id;
}