# OTP Authentication API

## Overview

This project is a small Express-based OTP authentication API. It generates 6-digit one-time passwords, stores them in memory, hashes them with SHA-256, and exposes endpoints to create, verify, resend, and list OTP sessions.

It is intended for local experimentation, frontend integration testing, and learning the core OTP lifecycle without adding a database or external SMS/email provider.

## Features

- Generate 6-digit OTPs for an email address.
- Hash OTPs before storing them in memory.
- Verify OTPs with attempt limiting.
- Resend OTPs with resend limiting and cooldown handling.
- List currently active OTP sessions for debugging.
- Remove OTP sessions after successful verification or when limits are exceeded.

## Tech Stack

- Node.js
- Express 5
- dotenv
- Nodemon for development
- Built-in Node.js `crypto` for OTP generation and hashing

## Project Structure

```text
OTP/
├── config/
│   └── db.js
├── controller/
│   ├── createOtp.js
│   ├── listOtp.js
│   ├── resendOtp.js
│   └── verifyOtp.js
├── middlewares/
│   ├── checkAttempts.js
│   └── checkResends.js
├── src/
│   └── index.js
├── utils/
│   └── hashOtp.js
├── package.json
└── README.md
```

## OTP Authentication Flow

```mermaid
flowchart TD
    A[Client requests POST /otp/new] --> B[Server generates a 6-digit OTP]
    B --> C[Hash OTP with SHA-256]
    C --> D[Store OTP session in in-memory Map]
    D --> E{Development mode?}
    E -- Yes --> F[Return raw OTP for testing]
    E -- No --> G[Return success message]

    H[Client requests POST /otp/verify] --> I[checkAttempts middleware]
    I --> J{OTP session exists?}
    J -- No --> K[Return 400 session expired or invalid]
    J -- Yes --> L{Attempts reached limit?}
    L -- Yes --> M[Delete session and return 429]
    L -- No --> N[Hash submitted OTP]
    N --> O{OTP matches stored hash?}
    O -- Yes --> P[Delete session and return success]
    O -- No --> Q[Increment attempts and return 400]

    R[Client requests POST /otp/resend] --> S[checkResends middleware]
    S --> T{OTP session exists?}
    T -- No --> U[Return 400 session expired or invalid]
    T -- Yes --> V{Resend limit reached?}
    V -- Yes --> W[Delete session and return 429]
    V -- No --> X{Cooldown elapsed?}
    X -- No --> Y[Return 400 and ask user to wait]
    X -- Yes --> Z[Generate new OTP, reset attempts, update resend count]

    AA[OTP expires] --> AB[Session becomes invalid]
```

## Installation

### Prerequisites

- Node.js 18 or newer
- npm

### Install dependencies

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root and define the values used by the API:

```env
PORT=3000
ATTEMPT_LIMIT=3
RESEND_LIMIT=3
RESEND_COOLDOWN=30000
EXPIRE_TIME=300000
ENVIORNMENT=development
```

- `PORT` sets the server port.
- `ATTEMPT_LIMIT` controls how many failed verification attempts are allowed.
- `RESEND_LIMIT` controls how many resend requests are allowed.
- `RESEND_COOLDOWN` sets the minimum time between resend requests in milliseconds.
- `EXPIRE_TIME` is used for resend-generated OTP expiry in milliseconds.
- `ENVIORNMENT` is checked by the code to decide whether to return the raw OTP in responses during development.

Use plain millisecond values in `.env`. The code reads these variables with `Number(...)`, so expressions like `60*1000` will not work.

## Running the Server

```bash
npm run dev
```

The API starts on `http://localhost:3000` by default, or on the value provided in `PORT`.

## API Endpoints

### `GET /`

Returns a simple welcome message.

Response:

```json
"Welcome to the OTP API!"
```

### `POST /otp/new`

Creates a new OTP session for an email address.

Request body:

```json
{
  "email": "user@example.com"
}
```

Response in development mode:

```json
{
  "otp": 123456
}
```

Response in non-development mode:

```json
{
  "sucess": true,
  "message": "OTP sent sucessfully"
}
```

### `POST /otp/verify`

Verifies a submitted OTP for an email address.

Request body:

```json
{
  "email": "user@example.com",
  "otp": 123456
}
```

Success response:

```json
{
  "message": "Success"
}
```

Common failure responses:

```json
{
  "message": "Invalid OTP"
}
```

```json
{
  "message": "Invalid OTP or session expired."
}
```

```json
{
  "message": "Too many attempts! Please try again later."
}
```

### `POST /otp/resend`

Generates a new OTP for an existing email session when resend conditions are satisfied.

Request body:

```json
{
  "email": "user@example.com"
}
```

Success response in development mode:

```json
{
  "sucess": true,
  "otp": 123456
}
```

Success response in non-development mode:

```json
{
  "sucess": true,
  "message": "OTP resent successfully"
}
```

### `GET /otp/list`

Returns the email keys currently stored in memory for debugging.

Response:

```json
{
  "otps": ["user@example.com"]
}
```

## Security Measures

- OTPs are hashed with SHA-256 before storage.
- OTP data is kept in memory only and is removed after successful verification.
- Verification attempts are capped by `ATTEMPT_LIMIT`.
- Resend requests are capped by `RESEND_LIMIT`.
- Resend requests are throttled with `RESEND_COOLDOWN`.
- OTPs are not intended to be exposed in production mode.

## Current Limitations

- OTP data is stored in memory, so it is lost when the server restarts.
- There is no persistent database or distributed cache.
- The API currently depends on environment-driven limits and does not validate missing variables.
- The code uses a misspelled `ENVIORNMENT` environment variable name.
- Initial OTP expiry is hardcoded in the create flow, while resend expiry uses `EXPIRE_TIME`.
- The API is not wired to an email or SMS delivery provider yet.

## Future Improvements

- Persist OTP sessions in Redis or a database.
- Replace raw OTP logging with an email or SMS provider.
- Add validation for request bodies and environment variables.
- Normalize success and error response shapes.
- Add automated tests for OTP generation, verification, resend, and cooldown behavior.
- Fix the environment variable naming typo and make expiry handling consistent.

## License

ISC
