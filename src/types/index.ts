export interface IAccount {
  firstName: string;
  surname: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
  accountNumber: string;
  virtualCard: IVirtualCard;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVirtualCard {
  cardNumber: string;
  cvv: string;
  expiryDate: string;
}

export interface IEncryptedData {
  encrypted: string;
  decrypted: string;
}

export interface IAccountResponse {
  accountNumber: string;
  fullName: string;
  email: string;
  phoneNumber: IEncryptedData;
  dateOfBirth: IEncryptedData;
  virtualCard: {
    cardNumber: IEncryptedData;
    cvv: IEncryptedData;
    expiryDate: IEncryptedData;
  };
}

export interface IAccountCreateDTO {
  firstName: string;
  surname: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
}

export interface IErrorResponse {
  status: 'error';
  message: string;
  code?: string;
}

export interface ISuccessResponse<T> {
  status: 'success';
  data: T;
} 