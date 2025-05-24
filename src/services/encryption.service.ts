import CryptoJS from 'crypto-js';
import { IEncryptedData } from '../types';

export class EncryptionService {
  private static instance: EncryptionService;
  private readonly key: string;

  private constructor() {
    this.key = process.env.ENCRYPTION_KEY || 'default-key-for-development';
  }

  public static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  public encrypt(data: string): IEncryptedData {
    const encrypted = CryptoJS.AES.encrypt(data, this.key).toString();
    return {
      encrypted,
      decrypted: data
    };
  }

  public decrypt(encryptedData: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.key);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      throw new Error('Failed to decrypt data');
    }
  }

  public encryptSensitiveData(data: string): IEncryptedData {
    return this.encrypt(data);
  }

  public decryptSensitiveData(encryptedData: string): string {
    return this.decrypt(encryptedData);
  }
} 