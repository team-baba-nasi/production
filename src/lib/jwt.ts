import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = "1h";

export function signJwt(payload: object) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyJwt(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        console.error("JWT verify error:", err);
        return null;
    }
}
