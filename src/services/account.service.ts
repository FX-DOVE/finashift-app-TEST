import { Account } from '../models/account.model';
import { IAccountCreateDTO, IAccountResponse, IEncryptedData } from '../types';
import { EncryptionService } from './encryption.service';

export class AccountService {
  private static instance: AccountService;
  private readonly encryptionService: EncryptionService;

  private constructor() {
    this.encryptionService = EncryptionService.getInstance();
  }

  public static getInstance(): AccountService {
    if (!AccountService.instance) {
      AccountService.instance = new AccountService();
    }
    return AccountService.instance;
  }

  public async createAccount(accountData: IAccountCreateDTO): Promise<IAccountResponse> {
    const account = new Account({
      ...accountData,
      dateOfBirth: new Date(accountData.dateOfBirth)
    });

    await account.save();
    return this.formatAccountResponse(account);
  }

  public async getAllAccounts(): Promise<IAccountResponse[]> {
    const accounts = await Account.find();
    return accounts.map(account => this.formatAccountResponse(account));
  }

  public async getAccountByNumber(accountNumber: string): Promise<IAccountResponse | null> {
    const account = await Account.findOne({ accountNumber });
    if (!account) return null;
    return this.formatAccountResponse(account);
  }

  public async decryptEncryptedData(encryptedData: string): Promise<string> {
    return this.encryptionService.decrypt(encryptedData);
  }

  private formatAccountResponse(account: any): IAccountResponse {
    const formatEncryptedData = (encrypted: string): IEncryptedData => ({
      encrypted,
      decrypted: this.encryptionService.decrypt(encrypted)
    });

    return {
      accountNumber: account.accountNumber,
      fullName: `${account.firstName} ${account.surname}`,
      email: account.email,
      phoneNumber: formatEncryptedData(account.phoneNumber),
      dateOfBirth: formatEncryptedData(account.dateOfBirth.toISOString()),
      virtualCard: {
        cardNumber: formatEncryptedData(account.virtualCard.cardNumber),
        cvv: formatEncryptedData(account.virtualCard.cvv),
        expiryDate: formatEncryptedData(account.virtualCard.expiryDate)
      }
    };
  }
} 