# Blog Backend API

A comprehensive blog backend built with Node.js, Express.js, and MongoDB featuring user authentication, CRUD operations, and social features.

## Features

- **User Authentication**: Register, login, logout with JWT
- **User Profiles**: Update profile, view public profiles
- **Blog Management**: Create, read, update, delete blogs
- **Social Features**: Like/unlike blogs
- **Advanced Features**: Search, filtering, pagination, tags
- **Security**: Password hashing, JWT tokens, input validation
- **Performance**: Database indexing, optimized queries

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file with your configuration
4. Start MongoDB service
5. Run the server: `npm run dev`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - Logout user

### Blogs

- `GET /api/blogs` - Get all blogs (with pagination, search, filtering)
- `GET /api/blogs/:id` - Get single blog
- `POST /api/blogs` - Create new blog (auth required)
- `PUT /api/blogs/:id` - Update blog (auth required, owner only)
- `DELETE /api/blogs/:id` - Delete blog (auth required, owner only)
- `POST /api/blogs/:id/like` - Toggle like on blog (auth required)
- `GET /api/blogs/user/:userId` - Get blogs by specific user

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user profile with recent blogs

## Usage Examples

### Register a new user

```bash
curl -X POST http://localhost:5000/api/auth/register \
-H "Content-Type: application/json" \
-d '{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "bio": "I love writing blogs!"
}'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "john@example.com",
  "password": "password123"
}'
```

### Create a blog

```bash
curl -X POST http://localhost:5000/api/blogs \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_JWT_TOKEN" \
-d '{
  "title": "My First Blog Post",
  "content": "This is the content of my blog post...",
  "summary": "A short summary",
  "tags": ["nodejs", "mongodb", "express"]
}'
```

### Get blogs with filtering

```bash
curl "http://localhost:5000/api/blogs?page=1&limit=10&search=nodejs&tag=express"
```

## Project Structure

```
blog-backend/
├── models/
│   ├── User.js          # User schema and methods
│   └── Blog.js          # Blog schema and methods
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── blogs.js         # Blog CRUD and like routes
│   └── users.js         # User profile routes
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── server.js            # Express server setup
├── package.json         # Dependencies and scripts
├── .env                 # Environment variables
└── README.md           # Project documentation
```

## Key Concepts Covered

### Node.js & Express.js

- **Middleware**: Custom auth middleware, express-validator, cors
- **Routing**: Modular route handlers with parameter validation
- **Error Handling**: Global error handler and async error catching
- **Security**: JWT authentication, password hashing, input sanitization

### MongoDB & Mongoose

- **Schema Design**: User and Blog schemas with relationships
- **Data Validation**: Built-in and custom validators
- **Indexing**: Performance optimization with database indexes
- **Population**: Referencing and populating related documents
- **Aggregation**: Like counting, blog statistics

### Advanced Features

- **Pagination**: Efficient data loading with skip/limit
- **Search**: Text search across multiple fields
- **Filtering**: Query building for dynamic filtering
- **Relationships**: One-to-many (User-Blogs), many-to-many (User-Likes-Blogs)
- **Middleware**: Pre/post hooks for data processing

## Database Schema

### User Model

- username (unique, 3-30 chars)
- email (unique, validated)
- password (hashed with bcrypt)
- bio (optional, max 500 chars)
- avatar (optional)
- blogCount (auto-updated)
- timestamps

### Blog Model

- title (5-200 chars)
- content (min 10 chars)
- summary (auto-generated if not provided)
- author (reference to User)
- tags (array of strings)
- likes (array of user references with timestamps)
- likesCount (auto-calculated)
- readTime (auto-calculated based on word count)
- slug (auto-generated from title)
- timestamps

## Security Features

1. **Password Security**: Bcrypt hashing with salt rounds
2. **JWT Authentication**: Stateless authentication with expiration
3. **Input Validation**: Express-validator for request sanitization
4. **Authorization**: Route-level protection and ownership checks
5. **Error Handling**: Secure error messages without sensitive data

## Performance Optimizations

1. **Database Indexing**: Strategic indexes on frequently queried fields
2. **Selective Population**: Only populate necessary fields
3. **Pagination**: Limit data transfer with skip/limit
4. **Efficient Queries**: Optimized aggregation and filtering

## Getting Started

1. Ensure MongoDB is running
2. Copy `.env.example` to `.env` and configure
3. Run `npm install` to install dependencies
4. Run `npm run dev` to start development server
5. Test endpoints using Postman or curl

The API will be available at `http://localhost:5000`
