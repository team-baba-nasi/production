import jwt, { Secret, JwtPayload, SignOptions } from "jsonwebtoken";

const SECRET_KEY: Secret = process.env.JWT_SECRET || "your-secret-key";

export interface JwtPayloadWithId extends JwtPayload {
    id: number;
    email: string;
}

export function signJwt(payload: object, expiresIn: string | number = "1h"): string {
    return jwt.sign(payload, SECRET_KEY, { expiresIn } as SignOptions);
}

export function verifyJwt(token: string): JwtPayloadWithId | null {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        // string型の場合はnullを返す
        if (typeof decoded === "string") {
            return null;
        }
        return decoded as JwtPayloadWithId;
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
}
