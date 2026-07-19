export const ADMIN_SESSION_COOKIE = 'admin_session';

const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
export const ADMIN_SESSION_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;

const getSecret = (): string => {
    const secret = process.env.ADMIN_PASSWORD;
    if (!secret) throw new Error('ADMIN_PASSWORD is not set');
    return secret;
};

const toBase64Url = (bytes: Uint8Array): string => {
    let binary = '';
    bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const fromBase64Url = (value: string): Uint8Array => {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
    const binary = atob(padded);
    return Uint8Array.from(binary, (char) => char.charCodeAt(0));
};

const sign = async (payload: string): Promise<Uint8Array> => {
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(getSecret()), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
    return new Uint8Array(signature);
};

const timingSafeEqual = (a: Uint8Array, b: Uint8Array): boolean => {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
    return diff === 0;
};

export const constantTimeStringEqual = (a: string, b: string): boolean => {
    return timingSafeEqual(new TextEncoder().encode(a), new TextEncoder().encode(b));
};

export const createSessionToken = async (): Promise<string> => {
    const payload = String(Date.now() + SESSION_TTL_MS);
    const signature = await sign(payload);
    return `${payload}.${toBase64Url(signature)}`;
};

export const verifySessionToken = async (token: string | undefined): Promise<boolean> => {
    if (!token) return false;

    const [payload, signaturePart] = token.split('.');
    if (!payload || !signaturePart) return false;

    const expiresAt = Number(payload);
    if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;

    const expectedSignature = await sign(payload);
    const providedSignature = fromBase64Url(signaturePart);
    return timingSafeEqual(expectedSignature, providedSignature);
};
