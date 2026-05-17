# NearBuy Backend API - Customer & Product Management

## Overview

This is the backend API for the NearBuy platform, built with Express.js and PostgreSQL. It includes complete CRUD operations for the customers table and product catalog (products and product variants).

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # PostgreSQL connection using Neon
│   ├── models/
│   │   ├── Customer.js         # Customer data model with database queries
│   │   ├── Product.js          # Product data model (base product fields)
│   │   └── ProductVariant.js   # Product variant data model
│   ├── controllers/
│   │   ├── CustomerController.js   # Business logic for customer operations
│   │   ├── ProductController.js    # Business logic for product operations
│   │   └── ProductVariantController.js # Business logic for product variant operations
│   ├── routes/
│   │   ├── customerRoutes.js   # API endpoints for customers
│   │   └── productRoutes.js    # API endpoints for products and variants
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
  CLOUDINARY_CLOUD_NAME=your_cloud_name
  CLOUDINARY_API_KEY=your_api_key
  CLOUDINARY_API_SECRET=your_api_secret
  CLOUDINARY_FOLDER=nearbuy
  ADMIN_JWT_SECRET=change_me
  ADMIN_DEFAULT_NAME=Admin
  ADMIN_DEFAULT_EMAIL=admin@nearbuy.com
  ADMIN_DEFAULT_PASSWORD=change_me_now
   ```

  `CLOUDINARY_FOLDER` is optional and defaults to `nearbuy`.
  `ADMIN_DEFAULT_*` values are used to create the first admin account if none exists.

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

     And the base products and product_variants tables (simplified example):

     ```sql
     CREATE TABLE products (
       product_id SERIAL PRIMARY KEY,
       title VARCHAR(255) NOT NULL,
       description TEXT,
       brand VARCHAR(100),
       model_number VARCHAR(100),
       category_id INT,
       subcategory_id INT,
       price DECIMAL(10,2) NOT NULL,
       discount_price DECIMAL(10,2),
       currency VARCHAR(10) DEFAULT 'BDT',
       stock_quantity INT DEFAULT 0,
       is_available BOOLEAN DEFAULT TRUE,
       main_image_url TEXT,
       image_urls TEXT,
       average_rating DECIMAL(3,2) DEFAULT 0.0,
       total_reviews INT DEFAULT 0,
       weight DECIMAL(10,2),
       dimensions VARCHAR(100),
       color VARCHAR(50),
       material VARCHAR(100),
       seller_id INT,
       keywords TEXT,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     );

     CREATE TABLE product_variants (
       variant_id SERIAL PRIMARY KEY,
       product_id INT NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
       sku VARCHAR(100) UNIQUE,
       variant_name VARCHAR(150),
       color VARCHAR(50),
       size VARCHAR(50),
       material VARCHAR(100),
       price DECIMAL(10,2),
       discount_price DECIMAL(10,2),
       stock_quantity INT DEFAULT 0,
       is_available BOOLEAN DEFAULT TRUE,
       image_url TEXT,
       weight DECIMAL(10,2),
       dimensions VARCHAR(100),
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     );
     ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:5000`

## API Endpoints

### Base URL (Customers)
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

### Products & Variants Overview

Base URL for products:

```
http://localhost:5000/api/products
```

- **GET** `/api/products` – List products. Each product includes a `variants` array aggregated from `product_variants`.
- **GET** `/api/products/:id` – Get single product by ID (also includes `variants`).
- **GET** `/api/products/search?title=...` – Search products by title.
- **GET** `/api/products/seller/:sellerId` – Get all products for a seller (each with `variants`).
- **POST** `/api/products` – Create a product. The request body may optionally contain a `variants` array; each object is created in `product_variants` with the new `product_id`.
- **PUT/PATCH** `/api/products/:id` – Update base product fields.
- **DELETE** `/api/products/:id` – Delete a product (its variants are cascaded by FK).

Nested routes for variants under a specific product:

- **POST** `/api/products/:productId/variants` – Create a new variant for a product.
- **GET** `/api/products/:productId/variants` – List all variants for a product.
- **GET** `/api/products/:productId/variants/:variantId` – Get a single variant.
- **PUT/PATCH** `/api/products/:productId/variants/:variantId` – Update a variant.
- **DELETE** `/api/products/:productId/variants/:variantId` – Delete a variant.

Example payload for creating a product with variants:

```json
{
  "title": "T-Shirt",
  "price": 1000,
  "description": "Comfortable cotton t-shirt",
  "variants": [
    { "sku": "TS-RED-M", "variant_name": "Red / M", "color": "Red", "size": "M", "stock_quantity": 10 },
    { "sku": "TS-BLK-L", "variant_name": "Black / L", "color": "Black", "size": "L", "stock_quantity": 5 }
  ]
}
```

Response for `GET /api/products/:id` includes:

```json
{
  "message": "Product fetched successfully",
  "product": {
    "product_id": 1,
    "title": "T-Shirt",
    "price": "1000.00",
    "variants": [
      { "variant_id": 1, "product_id": 1, "sku": "TS-RED-M", ... },
      { "variant_id": 2, "product_id": 1, "sku": "TS-BLK-L", ... }
    ]
  }
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
