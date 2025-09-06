import crypto from 'crypto'

export function generateRandomToken(lentgth= 32){
    const raw = crypto.randomBytes(lentgth).toString('hex');
    const hashed = crypto.createHash("sha256").update(raw).digest("hex");
    return {raw , hashed}
}