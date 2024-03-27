// lib/crypto.ts
import crypto from 'crypto';

export function encrypt(message: string, passphrase: string, seed: string): string {
    const key = crypto.createHash('sha256').update(passphrase + seed).digest();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(message, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + encrypted;
}

export function decrypt(encryptedMessage: string, passphrase: string, seed: string): string {
    try {
        const iv = Buffer.from(encryptedMessage.slice(0, 32), 'hex');
        const encrypted = encryptedMessage.slice(32);
        const key = crypto.createHash('sha256').update(passphrase + seed).digest();
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error('Error decrypting message:', error);
        throw new Error('Unable to decrypt data');
    }
}