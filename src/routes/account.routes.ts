import { Router } from 'express';
import { AccountController } from '../controllers/account.controller';

const router = Router();
const accountController = AccountController.getInstance();

// Create a new account
router.post('/accounts', accountController.createAccount.bind(accountController));

// Get all accounts
router.get('/accounts', accountController.getAllAccounts.bind(accountController));

// Get account by account number
router.get('/accounts/:accountNumber', accountController.getAccountByNumber.bind(accountController));

// Decrypt encrypted data
router.post('/decrypt', accountController.decryptData.bind(accountController));

export default router; 