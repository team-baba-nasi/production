import jwt, { Secret, JwtPayload } from "jsonwebtoken";

const ACCESS_TOKEN_SECRET: Secret = process.env.JWT_ACCESS_SECRET || "access-secret";

const REFRESH_TOKEN_SECRET: Secret = process.env.JWT_REFRESH_SECRET || "refresh-secret";

export interface AccessTokenPayload extends JwtPayload {
    id: number;
    email: string;
}

export interface RefreshTokenPayload extends JwtPayload {
    id: number;
    tokenVersion: number;
}

export function signAccessToken(payload: AccessTokenPayload): string {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });
}

export function signRefreshToken(payload: RefreshTokenPayload): string {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });
}

export function verifyAccessToken(token: string): AccessTokenPayload | null {
    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
        if (typeof decoded === "string") return null;
        return decoded as AccessTokenPayload;
    } catch {
        return null;
    }
}

export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
    try {
        const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
        if (typeof decoded === "string") return null;
        return decoded as RefreshTokenPayload;
    } catch {
        return null;
    }
}
