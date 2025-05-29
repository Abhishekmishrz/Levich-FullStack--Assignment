# Authentication and Comment Permission Service

A full-stack application that handles user authentication, authorization, session management, and comment-level access control using role-based permissions.

## Features

- User Authentication (Signup, Login, Logout)
- Password Reset Flow
- Token-based Authentication (Access & Refresh Tokens)
- Role-based Permission System
- Comment Management with Permission Control
- RESTful API Design

## Tech Stack

- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT (JSON Web Tokens)
- Password Hashing: bcryptjs
- Input Validation: express-validator

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd auth-comment-service
```

2. Install dependencies:
```bash
cd backend
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/auth-comment-service
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

## API Documentation

### Authentication Endpoints

#### Register User
- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

#### Login
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

#### Refresh Token
- **POST** `/api/auth/refresh-token`
- **Body:**
  ```json
  {
    "refreshToken": "your-refresh-token"
  }
  ```

#### Logout
- **POST** `/api/auth/logout`
- **Headers:** `Authorization: Bearer <access-token>`

#### Forgot Password
- **POST** `/api/auth/forgot-password`
- **Body:**
  ```json
  {
    "email": "john@example.com"
  }
  ```

#### Reset Password
- **POST** `/api/auth/reset-password`
- **Body:**
  ```json
  {
    "token": "reset-token",
    "password": "new-password"
  }
  ```

### User Endpoints

#### Get User Profile
- **GET** `/api/users/profile`
- **Headers:** `Authorization: Bearer <access-token>`

#### Update User Permissions
- **PATCH** `/api/users/:userId/permissions`
- **Headers:** `Authorization: Bearer <access-token>`
- **Body:**
  ```json
  {
    "permissions": {
      "read": true,
      "write": true,
      "delete": false
    }
  }
  ```

#### Get All Users
- **GET** `/api/users`
- **Headers:** `Authorization: Bearer <access-token>`

### Comment Endpoints

#### Get All Comments
- **GET** `/api/comments`
- **Headers:** `Authorization: Bearer <access-token>`

#### Create Comment
- **POST** `/api/comments`
- **Headers:** `Authorization: Bearer <access-token>`
- **Body:**
  ```json
  {
    "content": "This is a comment"
  }
  ```

#### Delete Comment
- **DELETE** `/api/comments/:commentId`
- **Headers:** `Authorization: Bearer <access-token>`

#### Get Comment by ID
- **GET** `/api/comments/:commentId`
- **Headers:** `Authorization: Bearer <access-token>`

## Permission System

The application implements a role-based permission system with three levels:

1. **Read Permission**
   - View comments
   - View user profiles

2. **Write Permission**
   - Create new comments
   - Update own comments

3. **Delete Permission**
   - Delete any comment
   - Manage user permissions

## Testing

Run the test suite:
```bash
npm test
```

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Refresh token rotation
- Input validation
- CORS enabled
- Rate limiting (to be implemented)
- Security headers (to be implemented)

## Future Improvements

1. Add rate limiting
2. Implement email service for password reset
3. Add request validation middleware
4. Implement caching
5. Add comprehensive logging
6. Add API documentation using Swagger
7. Implement unit and integration tests
8. Add Docker support
9. Implement CI/CD pipeline

## License

ISC 