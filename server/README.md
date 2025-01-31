# Personal Website - Server

Backend server for the personal website, built with Node.js and Express.

## Features

- 🔐 Authentication with Google OAuth
- 🔒 JWT token-based authorization
- 📝 RESTful API endpoints
- 📨 Contact form email service
- 🗄️ MongoDB database integration
- 📊 Rate limiting and security features

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: Passport.js, JWT
- **Email**: Nodemailer
- **Validation**: Joi
- **Testing**: Jest
- **Documentation**: Swagger/OpenAPI

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/DevLifeHub-server.git
   cd DevLifeHub-server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following:

   Google OAuth configuration.
      First, you need to get credentials from Google Cloud Console:
      1) Go to Google Cloud Console(<https://console.cloud.google.com/home/dashboard>)
      2) Create a new project or select an existing one
      3) Enable the Google+ API and Google OAuth2 API
      4) Go to "Credentials" section
      5) Click "Create Credentials" → "OAuth client ID"
      6) Select "Web application"
      7) Set up authorized origins and redirect URIs:
      Authorized JavaScript origins: <http://localhost:3000>
      Authorized redirect URIs: <http://localhost:5000/auth/google/callback>
      8) Click "Create"
      9) You'll get your Client ID and Client Secret

   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/devlifehub

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d

   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

   # Email Configuration (if using email service)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_email_password
   ```

4. Start the server:

   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

### API Documentation

The API documentation is available at `/api-docs` when running the server.

### Available Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with nodemon
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

## Project Structure

```json
server/
├── config/             # Configuration files
├── controllers/        # Route controllers
├── middleware/         # Custom middleware
├── models/            # Database models
├── routes/            # API routes
├── services/          # Business logic
├── utils/             # Utility functions
├── validation/        # Request validation schemas
├── .env              # Environment variables
└── server.js         # Entry point
```

## API Endpoints

### Auth Routes

- `POST /auth/google` - Google OAuth login
- `GET /auth/google/callback` - Google OAuth callback
- `POST /auth/logout` - Logout user

### User Routes

- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Contact Routes

- `POST /api/contact` - Send contact form message

## Error Handling

The API uses the following error status codes:

- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Security

- CORS enabled
- Rate limiting
- Helmet security headers
- JWT authentication
- Input validation
- XSS protection

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the open-source community
- Special thanks to all contributors

## ENV config Explain

### 1. google oauth explain

Here’s a step-by-step guide to obtaining Google OAuth `Client ID` and `Client Secret` based on the **latest English Google Cloud Console interface** (as of 2024):

---
**Step 1: Go to Google Cloud Console**

1. Visit [Google Cloud Console](https://console.cloud.google.com/).
2. Log in with your Google account.

---

**Step 2: Create or Select a Project**

1. Click the project dropdown menu in the top-left corner.
   - If you have an existing project, select it.
   - **To create a new project**:
     1. Click **New Project**.
     2. Enter a project name (e.g., `My OAuth App`).
     3. Click **Create**.

---

**Step 3: Enable Required APIs**

1. In the left sidebar, go to **APIs & Services** > **Enabled APIs & Services**.
2. Click **+ ENABLE APIS AND SERVICES**.
3. Search for and enable the following APIs:
   - **People API** (to fetch user profile data).
   - **Google Identity Toolkit API** (for OAuth flows).
4. Click **Enable** for each API.

---

**Step 4: Configure OAuth Consent Screen**

1. In the left sidebar, go to **APIs & Services** > **OAuth consent screen**.
2. Select the **User Type**:
   - **Internal**: For users within your organization (requires Google Workspace).
   - **External**: For public apps (most common choice).
3. Fill in the **App Information**:
   - **App name**: The name users see (e.g., `My App`).
   - **User support email**: Your contact email.
   - **Developer contact information**: Your email.
4. Click **SAVE AND CONTINUE**.
5. (Optional) Add **Scopes**:
   - Click **ADD OR REMOVE SCOPES**.
   - Select basic scopes like `.../auth/userinfo.email` and `.../auth/userinfo.profile`.
6. (Optional) Add **Test Users** (for external apps):
   - Enter your email or other test accounts.
7. Click **SAVE AND CONTINUE** until you return to the dashboard.

---

**Step 5: Create OAuth Client ID & Secret**

1. In the left sidebar, go to **APIs & Services** > **Credentials**.
2. Click **+ CREATE CREDENTIALS** > **OAuth client ID**.
3. Configure the OAuth client:
   - **Application type**: Select **Web application**.
   - **Name**: Give it a name (e.g., `My Web Client`).
   - **Authorized JavaScript origins** (optional for local dev):
     - Add `http://localhost` (if your app runs locally).
   - **Authorized redirect URIs**:
     - Add your callback URL (e.g., `http://localhost:5000/auth/google/callback`).
     - Click **+ ADD URI**.
4. Click **CREATE**.
5. **Copy the Client ID and Client Secret**:
   - A popup will display your `Client ID` and `Client Secret`.
   - Save them securely (they’ll look like this):

     ```plaintext
     Client ID: 1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
     Client Secret: GOCSPX-abc123def456ghi789
     ```

---

**Step 6: Configure Environment Variables**
Add the credentials to your project’s environment variables (e.g., `.env` file):

```plaintext
# Google OAuth
GOOGLE_CLIENT_ID='your_client_id_here'
GOOGLE_CLIENT_SECRET='your_client_secret_here'
GOOGLE_CALLBACK_URL='http://localhost:5000/auth/google/callback'
```

---

**Step 7: Test Your Integration**

1. In your code, load the environment variables. For example, in Node.js:

   ```javascript
   require('dotenv').config();
   const clientId = process.env.GOOGLE_CLIENT_ID;
   const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
   ```

2. Start your app and test the Google OAuth flow.

---

**Troubleshooting**

1. **Redirect URI mismatch**:
   - Ensure the `GOOGLE_CALLBACK_URL` in your code matches the **Authorized redirect URI** in Google Cloud Console.
2. **Invalid credentials**:
   - Double-check the `Client ID` and `Client Secret` for typos.
3. **Scopes missing**:
   - Add required scopes (e.g., `email`, `profile`) in the OAuth consent screen.

---

**Important Notes**

- Never share your `Client Secret` publicly.
- For production, replace `localhost` with your domain (e.g., `https://yourdomain.com/auth/google/callback`).
- Regenerate credentials if compromised via **Credentials** > **Edit OAuth Client**.

---
