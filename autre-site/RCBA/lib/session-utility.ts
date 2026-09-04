/**
 * RCBA Session Management (Edge-Compatible)
 * Uses Web Crypto API (crypto.subtle) instead of node:crypto.
 */

const SESSION_SECRET = process.env.SESSION_SECRET || (
  process.env.NODE_ENV === 'production'
    ? (() => { throw new Error('SESSION_SECRET env var is required in production'); })()
    : 'dev-only-debug-secret-not-for-production'
);

async function getHmacKey() {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(SESSION_SECRET);
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function signSession<T extends object>(data: T): Promise<string> {
  const json = JSON.stringify(data);
  const encoder = new TextEncoder();
  const dataUint8 = encoder.encode(json);
  
  // Base64 encoding without Node's Buffer
  const base64 = btoa(String.fromCharCode(...dataUint8));
  
  const key = await getHmacKey();
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC', 
    key, 
    encoder.encode(base64)
  );
  
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const signatureHex = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return `${base64}.${signatureHex}`;
}

export async function verifySession<T = any>(sealed: string): Promise<T | null> {
  if (!sealed) return null;
  const parts = sealed.split('.');
  if (parts.length !== 2) return null;
  const [base64, signature] = parts;
  
  const encoder = new TextEncoder();
  const key = await getHmacKey();
  
  try {
    const sigUint8 = new Uint8Array(signature.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    const verified = await crypto.subtle.verify(
      'HMAC', 
      key, 
      sigUint8, 
      encoder.encode(base64)
    );
    
    if (!verified) return null;
    
    const json = atob(base64);
    const session = JSON.parse(json);
    if (session && session.roleName === 'Admin') {
      session.roleName = 'Direction';
    }
    return session as T;
  } catch {
    return null;
  }
}
