import { NextResponse } from "next/server";
import { getUserFromToken } from "@/features/auth/libs/getUserFromToken";

export async function GET(request) {
    const user = await getUserFromToken(request);
    if (!user) return NextResponse.json({ user: null }, { status: 401 });

    return NextResponse.json({ user });
}
