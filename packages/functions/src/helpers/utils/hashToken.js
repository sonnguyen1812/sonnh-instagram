import crypto from 'crypto';

// Configuration
const algorithm = 'aes-256-cbc'; // AES-256-CBC is a strong symmetric encryption algorithm
const key = crypto.randomBytes(32); // 32 bytes = 256 bits (AES-256 key)
const iv = crypto.randomBytes(16); // Initialization Vector (16 bytes for AES-CBC)

// Function to encrypt the token
export function encryptToken(token) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Function to decrypt the token
export function decryptToken(encryptedToken) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedToken, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
