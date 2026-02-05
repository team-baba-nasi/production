import { NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function getUserFromToken(request: NextRequest) {
    try {
        const accessToken = request.cookies.get("accessToken")?.value;

        if (!accessToken) {
            console.log("accessToken not found");
            return null;
        }

        const decoded = verifyAccessToken(accessToken);
        if (!decoded) {
            console.log("accessToken verification failed");
            return null;
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                username: true,
                email: true,
                profile_image_url: true,
            },
        });

        return user;
    } catch (error) {
        console.error("getUserFromToken error:", error);
        return null;
    }
}
