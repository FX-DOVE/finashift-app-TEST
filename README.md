# finashift-app - Secure Financial System

A secure financial system implementation built with TypeScript, Express, and MongoDB.


## Environment Variables

Create a `.env` file in the root directory with the following variables:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/finable // put your mongodb url here 
ENCRYPTION_KEY= replace-eith-your-secure-encryption-key
```
## API LINK :: https://documenter.getpostman.com/view/40790400/2sB2qcBKtY

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install

For development:
```bash
npm run dev
```

## API Documentation

### Create Account
- **POST** `/api/v1/accounts`
- **Body:**
  ```json
  {
    "firstName": "string",
    "surname": "string",
    "email": "string",
    "phoneNumber": "string",
    "dateOfBirth": "YYYY-MM-DD"
  }
  ```
- **Response:** Account details with encrypted sensitive data

### Get All Accounts
- **GET** `/api/v1/accounts`
- **Response:** List of all accounts with encrypted and decrypted data

### Get Account by Number
- **GET** `/api/v1/accounts/:accountNumber`
- **Response:** Account details with encrypted and decrypted data

### Decrypt Data
- **POST** `/api/v1/decrypt`
- **Body:**
  ```json
  {
    "encryptedData": "string"
  }
  ```
- **Response:** Decrypted data


## Security Features

- All sensitive data is encrypted using AES encryption
- Rate limiting to prevent abuse
- Helmet for security headers
- CORS enabled
- Input validation using Joi
- MongoDB connection with proper error handling

## Development

- TypeScript for type safety
- ESLint for code quality
- Jest for testing
- Nodemon for development
