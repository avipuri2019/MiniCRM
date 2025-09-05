# Mini CRM Backend API

A complete CRM backend built with Node.js, TypeScript, Express, and SQLite.

## Features

- **Authentication**: JWT-based auth with bcrypt password hashing
- **Leads Management**: CRUD operations with filtering and conversion
- **Accounts Management**: CRUD with activity count and JOIN queries
- **Activities Management**: CRUD with WebSocket live updates
- **Security**: Helmet, CORS, rate limiting, input validation, SQL injection prevention
- **Real-time Updates**: WebSocket endpoint for live activity updates
- **Database**: SQLite with better-sqlite3
- **Code Quality**: ESLint, Prettier

## Password Requirements

Passwords must contain:

- At least 8 characters
- One uppercase letter
- One lowercase letter
- One number
- One special character

## Installation

```bash
npm install
```

## Development

```bash
# Copy environment variables
cp .env.example .env

# Run in development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Testing & Code Quality

### Unit Testing with Jest

```bash
# Run unit tests
npm test

# Run linting
npm run lint

# Format code
npm run format
```

## API Endpoints

### Authentication

- `POST /auth/signup` - Create new user account
- `POST /auth/login` - Login user

### Leads

- `GET /leads` - Get all leads (with optional filters)
- `GET /leads/:id` - Get lead by ID
- `POST /leads` - Create new lead
- `PUT /leads/:id` - Update lead
- `DELETE /leads/:id` - Delete lead
- `POST /leads/:id/convert` - Convert lead to account

### Accounts

- `GET /accounts` - Get all accounts with activity count
- `GET /accounts/recent-activity` - Get accounts with most recent activity
- `GET /accounts/:id` - Get account by ID
- `POST /accounts` - Create new account
- `PUT /accounts/:id` - Update account
- `DELETE /accounts/:id` - Delete account

### Activities

- `GET /accounts/:id/activities` - Get all activities for account
- `GET /accounts/:id/activities/:activityId` - Get specific activity
- `POST /accounts/:id/activities` - Create new activity
- `PUT /accounts/:id/activities/:activityId` - Update activity
- `DELETE /accounts/:id/activities/:activityId` - Delete activity

### WebSocket

- `ws://localhost:3000/ws/updates?token=JWT_TOKEN` - Live updates endpoint

## Database Schema

The database includes the following tables:

- `users` - User accounts with roles (rep/manager)
- `leads` - Lead management with status tracking
- `accounts` - Account management with industry info
- `activities` - Activity tracking with foreign key relationships

## Security Features

- **JWT Authentication** - Configurable expiration, secure token generation
- **Password Security** - Bcrypt hashing with salt rounds
- **Rate Limiting** - 5 attempts per 15 minutes on auth endpoints
- **Input Validation** - Zod schemas with custom validation functions
- **SQL Injection Prevention** - Prepared statements and input sanitization
- **Security Headers** - Helmet middleware for security headers
- **CORS** - Cross-origin resource sharing configuration
- **Input Sanitization** - Custom helper functions for cleaning user input

## WebSocket Testing

### Using Test Files

1. **Start the server:**

   ```bash
   npm run dev
   ```

2. **Get JWT Token:**
   - Use Postman or curl to login: `POST /auth/login`
   - Copy the token from response

3. **Test with HTML file:**
   - Open `websocket-test.html` in your browser
   - Enter JWT token and click "Connect"
   - Monitor live updates in the message panel

4. **Test with Node.js script:**

   ```bash
   # First, update the token in test-websocket.js file
   # Replace 'YOUR_JWT_TOKEN_HERE' with actual JWT token

   # Then run the test script
   node test-websocket.js
   ```

5. **Trigger Live Updates:**
   ```bash
   # Create activity to see WebSocket broadcast
   curl -X POST http://localhost:3000/accounts/ACCOUNT_ID/activities \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"type":"call","notes":"Test activity"}'
   ```

## Architecture Benefits

- **MVC Pattern** - Clear separation of concerns
- **Controller Layer** - Reusable business logic
- **Security First** - Multiple layers of protection
- **Type Safety** - Full TypeScript implementation
- **Real-time** - WebSocket integration for live updates
- **Testable** - Unit tests with Jest
- **Code Quality** - ESLint and Prettier integration
