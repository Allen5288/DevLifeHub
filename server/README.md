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

```
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
