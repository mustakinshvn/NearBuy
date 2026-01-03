# NearBuy Backend API - Customer Management

## Overview

This is the backend API for the NearBuy platform, built with Express.js and PostgreSQL. Currently, it includes complete CRUD operations for the customers table.

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # PostgreSQL connection using Neon
│   ├── models/
│   │   └── Customer.js         # Customer data model with database queries
│   ├── controllers/
│   │   └── customerController.js   # Business logic for customer operations
│   ├── routes/
│   │   └── customerRoutes.js   # API endpoints for customers
│   ├── middleware/             # Authentication, validation middleware
│   ├── app.js                  # Main Express app setup (if needed)
│   └── index.js                # Server entry point
├── .env                        # Environment variables
├── package.json                # Dependencies
└── README.md                   # This file
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Neon PostgreSQL account

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file in backend directory:**
   ```env
   PORT=5000
   DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require
   ```

3. **Run database setup:**
   - Log in to your Neon console
   - Execute the following SQL to create the customers table:
   ```sql
   CREATE TABLE customers (
       customer_id SERIAL PRIMARY KEY,
       name VARCHAR(100) NOT NULL,
       email VARCHAR(100) UNIQUE,
       phone VARCHAR(11) NOT NULL,
       password VARCHAR(255) NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:5000`

## API Endpoints

### Base URL
```
http://localhost:5000/api/customers
```

### 1. Register a New Customer
**POST** `/api/customers/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "01234567890",
  "password": "securePassword123"
}
```

**Response (201 Created):**
```json
{
  "message": "Customer registered successfully",
  "customer": {
    "customer_id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "01234567890",
    "created_at": "2025-11-06T10:30:00.000Z"
  }
}
```

### 2. Get All Customers
**GET** `/api/customers`

**Response (200 OK):**
```json
{
  "message": "Customers fetched successfully",
  "count": 2,
  "customers": [
    {
      "customer_id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "01234567890",
      "created_at": "2025-11-06T10:30:00.000Z"
    },
    {
      "customer_id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "phone": "09876543210",
      "created_at": "2025-11-06T11:00:00.000Z"
    }
  ]
}
```

### 3. Get Customer by ID
**GET** `/api/customers/:customerId`

**Response (200 OK):**
```json
{
  "message": "Customer fetched successfully",
  "customer": {
    "customer_id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "01234567890",
    "created_at": "2025-11-06T10:30:00.000Z"
  }
}
```

**Response (404 Not Found):**
```json
{
  "message": "Customer not found"
}
```

### 4. Update Customer
**PUT** `/api/customers/:customerId`

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "phone": "01987654321"
}
```

**Response (200 OK):**
```json
{
  "message": "Customer updated successfully",
  "customer": {
    "customer_id": 1,
    "name": "John Updated",
    "email": "john.updated@example.com",
    "phone": "01987654321",
    "created_at": "2025-11-06T10:30:00.000Z"
  }
}
```

### 5. Delete Customer
**DELETE** `/api/customers/:customerId`

**Response (200 OK):**
```json
{
  "message": "Customer deleted successfully",
  "customer_id": 1
}
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "All fields are required"
}
```

### 404 Not Found
```json
{
  "message": "Customer not found"
}
```

### 409 Conflict
```json
{
  "message": "Email already exists"
}
```

### 500 Internal Server Error
```json
{
  "message": "Error message details"
}
```

## Available Scripts

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start

# Run tests (when configured)
npm test
```

## Key Features

✅ **Customer Registration** - Create new customers with hashed passwords
✅ **CRUD Operations** - Create, Read, Update, Delete customers
✅ **Email Validation** - Prevents duplicate email registrations
✅ **Password Hashing** - Uses bcrypt for secure password storage
✅ **Database Connection** - Neon PostgreSQL with SSL
✅ **Error Handling** - Comprehensive error messages
✅ **CORS Support** - Allows cross-origin requests

## Dependencies

- **express** - Web framework
- **pg** - PostgreSQL client
- **bcrypt** - Password hashing
- **dotenv** - Environment variable management
- **cors** - Cross-Origin Resource Sharing
- **jsonwebtoken** - JWT for authentication (ready for use)
- **sequelize** - ORM (ready for use with additional models)
- **nodemon** - Development auto-reload

## Next Steps

1. **Add Authentication** - Implement JWT login/logout endpoints
2. **Add Middleware** - Create authentication middleware for protected routes
3. **Add Validation** - Implement input validation using express-validator
4. **Add More Models** - Create models for vendors, products, orders, etc.
5. **Add Unit Tests** - Set up Jest or Mocha for testing
6. **API Documentation** - Generate OpenAPI/Swagger documentation

## Troubleshooting

### Database Connection Issues
- Ensure `DATABASE_URL` is correctly set in `.env`
- Check that your Neon database is accessible
- Verify SSL settings if connecting from different regions

### Port Already in Use
```bash
# Change PORT in .env or run on different port
PORT=5001 npm run dev
```

### Dependencies Not Installing
```bash
# Clear cache and reinstall
npm cache clean --force
npm install
```

## License

ISC
