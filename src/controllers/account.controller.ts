import { Request, Response } from 'express';
import { AccountService } from '../services/account.service';
import { IAccountCreateDTO, IErrorResponse, ISuccessResponse } from '../types';
import Joi from 'joi';

export class AccountController {
  private static instance: AccountController;
  private readonly accountService: AccountService;

  private constructor() {
    this.accountService = AccountService.getInstance();
  }

  public static getInstance(): AccountController {
    if (!AccountController.instance) {
      AccountController.instance = new AccountController();
    }
    return AccountController.instance;
  }

  private readonly createAccountSchema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    surname: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().pattern(/^\+?[\d\s-]{10,}$/).required(),
    dateOfBirth: Joi.date().max('now').required()
  });

  public async createAccount(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = this.createAccountSchema.validate(req.body);
      if (error) {
        this.sendError(res, 400, error.details[0].message);
        return;
      }

      const accountData: IAccountCreateDTO = value;
      const account = await this.accountService.createAccount(accountData);
      this.sendSuccess(res, 201, account);
    } catch (error: any) {
      console.error('Error in createAccount controller:', error);
      if (error.code === 11000) {
        this.sendError(res, 409, 'Email already exists');
        return;
      }
      this.sendError(res, 500, 'Failed to create account');
    }
  }

  public async getAllAccounts(req: Request, res: Response): Promise<void> {
    try {
      const accounts = await this.accountService.getAllAccounts();
      this.sendSuccess(res, 200, accounts);
    } catch (error) {
      this.sendError(res, 500, 'Failed to fetch accounts');
    }
  }

  public async getAccountByNumber(req: Request, res: Response): Promise<void> {
    try {
      const { accountNumber } = req.params;
      const account = await this.accountService.getAccountByNumber(accountNumber);
      
      if (!account) {
        this.sendError(res, 404, 'Account not found');
        return;
      }

      this.sendSuccess(res, 200, account);
    } catch (error) {
      this.sendError(res, 500, 'Failed to fetch account');
    }
  }

  public async decryptData(req: Request, res: Response): Promise<void> {
    try {
      const { encryptedData } = req.body;
      
      if (!encryptedData || typeof encryptedData !== 'string') {
        this.sendError(res, 400, 'Invalid encrypted data');
        return;
      }

      const decryptedData = await this.accountService.decryptEncryptedData(encryptedData);
      this.sendSuccess(res, 200, { decryptedData });
    } catch (error) {
      this.sendError(res, 400, 'Failed to decrypt data');
    }
  }

  private sendSuccess<T>(res: Response, status: number, data: T): void {
    const response: ISuccessResponse<T> = {
      status: 'success',
      data
    };
    res.status(status).json(response);
  }

  private sendError(res: Response, status: number, message: string, code?: string): void {
    const response: IErrorResponse = {
      status: 'error',
      message,
      ...(code && { code })
    };
    res.status(status).json(response);
  }
} 