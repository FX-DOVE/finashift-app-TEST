import mongoose, { Document, Schema, Model } from 'mongoose';
import { IAccount, IVirtualCard } from '../types';
import { EncryptionService } from '../services/encryption.service';

interface IAccountDocument extends IAccount, Document {}

const VirtualCardSchema = new Schema<IVirtualCard>({
  cardNumber: { type: String, required: true },
  cvv: { type: String, required: true },
  expiryDate: { type: String, required: true }
});

const AccountSchema = new Schema<IAccountDocument>({
  firstName: { 
    type: String, 
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  surname: { 
    type: String, 
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: { 
    type: String, 
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phoneNumber: { 
    type: String, 
    required: true,
    trim: true,
    match: [/^\+?[\d\s-]{10,}$/, 'Please enter a valid phone number']
  },
  dateOfBirth: { 
    type: Date, 
    required: true,
    validate: {
      validator: function(v: Date) {
        return v < new Date();
      },
      message: 'Date of birth must be in the past'
    }
  },
  accountNumber: { 
    type: String, 
    required: false,
    unique: true,
    length: 10,
    sparse: true
  },
  virtualCard: { 
    type: VirtualCardSchema, 
    required: false 
  }
}, {
  timestamps: true
});

// Generate unique 10-digit account number
AccountSchema.pre('save', async function(next) {
  if (!this.isNew) return next();
  
  let accountNumber: string;
  let isUnique = false;
  
  const AccountModel = this.constructor as Model<IAccountDocument>;
  
  while (!isUnique) {
    accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const existingAccount = await AccountModel.findOne({ accountNumber });
    if (!existingAccount) {
      isUnique = true;
    }
  }
  
  this.accountNumber = accountNumber!;
  next();
});

// Generate virtual card before saving
AccountSchema.pre('save', function(next) {
  if (!this.isNew) return next();

  const generateCardNumber = () => {
    return Array.from({ length: 4 }, () => 
      Math.floor(1000 + Math.random() * 9000)
    ).join('');
  };

  const generateCVV = () => {
    return Math.floor(100 + Math.random() * 900).toString();
  };

  const generateExpiryDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 3);
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getFullYear()).slice(-2)}`;
  };

  this.virtualCard = {
    cardNumber: generateCardNumber(),
    cvv: generateCVV(),
    expiryDate: generateExpiryDate()
  };

  next();
});

// Encrypt sensitive data before saving
AccountSchema.pre('save', function(next) {
  const encryptionService = EncryptionService.getInstance();
  
  this.phoneNumber = encryptionService.encrypt(this.phoneNumber).encrypted;
  this.dateOfBirth = new Date(encryptionService.encrypt(this.dateOfBirth.toISOString()).encrypted);
  this.virtualCard.cardNumber = encryptionService.encrypt(this.virtualCard.cardNumber).encrypted;
  this.virtualCard.cvv = encryptionService.encrypt(this.virtualCard.cvv).encrypted;
  this.virtualCard.expiryDate = encryptionService.encrypt(this.virtualCard.expiryDate).encrypted;
  
  next();
});

export const Account = mongoose.model<IAccountDocument>('Account', AccountSchema); 