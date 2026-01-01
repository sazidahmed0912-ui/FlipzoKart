# Admin Panel API Documentation

## 📚 API Overview

The Admin Panel API provides RESTful endpoints for managing e-commerce operations including users, products, orders, payments, and more.

## 🔗 Base URL

```
Development: http://localhost:5001/api
Production: https://your-domain.com/api
```

## 🔐 Authentication

All API endpoints (except authentication endpoints) require JWT authentication.

### Headers
```http
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

### Authentication Flow

1. **Login**: POST `/auth/login`
2. **Receive Token**: JWT token in response
3. **Include Token**: Add to Authorization header for subsequent requests

## 📋 API Endpoints

### Authentication

#### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "admin@example.com",
      "role": "admin",
      "permissions": {
        "dashboard": true,
        "users": true,
        "products": true,
        "orders": true,
        "payments": true,
        "settings": true,
        "marketing": true
      }
    },
    "token": "jwt_token_here"
  }
}
```

#### Register
```http
POST /auth/register
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "admin@example.com",
  "password": "password123",
  "role": "admin"
}
```

#### Get Profile
```http
GET /auth/profile
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "admin@example.com",
      "role": "admin",
      "permissions": {...},
      "avatar": "avatar_url",
      "phone": "+1234567890",
      "isEmailVerified": true,
      "lastLogin": "2023-01-01T00:00:00.000Z",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

#### Update Profile
```http
PUT /auth/profile
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "avatar": "avatar_url"
}
```

#### Change Password
```http
PUT /auth/change-password
```

**Request Body:**
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}
```

#### Forgot Password
```http
POST /auth/forgot-password
```

**Request Body:**
```json
{
  "email": "admin@example.com"
}
```

#### Reset Password
```http
POST /auth/reset-password
```

**Request Body:**
```json
{
  "token": "reset_token",
  "newPassword": "new_password"
}
```

#### Logout
```http
POST /auth/logout
```

### Dashboard

#### Get Dashboard Statistics
```http
GET /dashboard/stats?period=30
```

**Query Parameters:**
- `period`: Number of days (default: 30)

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 1000,
      "totalProducts": 500,
      "totalOrders": 2500,
      "totalRevenue": 150000
    },
    "today": {
      "users": 10,
      "orders": 25,
      "revenue": 1500
    },
    "monthly": {
      "users": 300,
      "orders": 750,
      "revenue": 45000
    },
    "yearly": {
      "users": 1000,
      "orders": 2500,
      "revenue": 150000
    },
    "recentOrders": [...],
    "topProducts": [...],
    "orderStatusStats": [...],
    "paymentMethodStats": [...],
    "charts": {
      "monthlySales": [...],
      "userRegistrations": [...]
    },
    "alerts": {
      "lowStockProducts": 5
    }
  }
}
```

#### Get Sales Analytics
```http
GET /dashboard/sales?period=30
```

**Response:**
```json
{
  "success": true,
  "data": {
    "salesData": [
      {
        "_id": "2023-01-01",
        "revenue": 1500,
        "orders": 25,
        "avgOrderValue": 60
      }
    ],
    "topSellingProducts": [...]
  }
}
```

#### Get User Analytics
```http
GET /dashboard/users?period=30
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userGrowth": [...],
    "userStats": [...],
    "recentUsers": [...]
  }
}
```

#### Get Order Analytics
```http
GET /dashboard/orders?period=30
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderTrend": [...],
    "orderStatusBreakdown": [...],
    "paymentMethodBreakdown": [...]
  }
}
```

### Products

#### Get All Products
```http
GET /products?page=1&limit=10&search=laptop&category=electronics&status=active
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search term
- `category`: Category filter
- `status`: Status filter (active, inactive, draft)
- `sortBy`: Sort field (name, price, createdAt)
- `sortOrder`: Sort order (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10
    }
  }
}
```

#### Get Product by ID
```http
GET /products/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "product": {
      "id": "product_id",
      "name": "Product Name",
      "slug": "product-slug",
      "description": "Product description",
      "price": 99.99,
      "originalPrice": 149.99,
      "category": {...},
      "images": [...],
      "stock": 100,
      "status": "active",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

#### Create Product
```http
POST /products
```

**Request Body:**
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "originalPrice": 149.99,
  "category": "category_id",
  "sku": "SKU123",
  "images": [
    {
      "url": "image_url",
      "alt": "Product image",
      "isMain": true
    }
  ],
  "stock": 100,
  "status": "active"
}
```

#### Update Product
```http
PUT /products/:id
```

**Request Body:** Same as create product

#### Delete Product
```http
DELETE /products/:id
```

#### Upload Product Image
```http
POST /products/:id/upload
```

**Request:** multipart/form-data with image file

### Orders

#### Get All Orders
```http
GET /orders?page=1&limit=10&status=pending&startDate=2023-01-01&endDate=2023-01-31
```

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `status`: Order status filter
- `startDate`: Start date filter
- `endDate`: End date filter
- `search`: Search by order number or customer email

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [...],
    "pagination": {...}
  }
}
```

#### Get Order by ID
```http
GET /orders/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "order_id",
      "orderNumber": "ORD-123456789",
      "customer": {...},
      "items": [...],
      "shipping": {...},
      "payment": {...},
      "pricing": {...},
      "status": "pending",
      "statusHistory": [...],
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

#### Update Order Status
```http
PUT /orders/:id/status
```

**Request Body:**
```json
{
  "status": "confirmed",
  "note": "Order confirmed and ready for processing"
}
```

#### Cancel Order
```http
PUT /orders/:id/cancel
```

**Request Body:**
```json
{
  "reason": "Customer requested cancellation"
}
```

#### Generate Invoice
```http
POST /orders/:id/invoice
```

**Response:**
```json
{
  "success": true,
  "data": {
    "invoice": {
      "number": "INV-123456789",
      "url": "https://example.com/invoice.pdf"
    }
  }
}
```

### Users

#### Get All Users
```http
GET /users?page=1&limit=10&role=admin&status=active&search=john
```

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `role`: Role filter
- `status`: Status filter (active, blocked)
- `search`: Search by name or email

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": {...}
  }
}
```

#### Get User by ID
```http
GET /users/:id
```

#### Create User
```http
POST /users
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "support",
  "permissions": {
    "dashboard": true,
    "users": false,
    "products": false,
    "orders": true,
    "payments": false,
    "settings": false,
    "marketing": false
  }
}
```

#### Update User
```http
PUT /users/:id
```

#### Block User
```http
PUT /users/:id/block
```

#### Unblock User
```http
PUT /users/:id/unblock
```

#### Delete User
```http
DELETE /users/:id
```

### Categories

#### Get All Categories
```http
GET /categories
```

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "category_id",
        "name": "Electronics",
        "slug": "electronics",
        "description": "Electronic products",
        "parent": null,
        "level": 0,
        "isActive": true,
        "productCount": 150
      }
    ]
  }
}
```

#### Create Category
```http
POST /categories
```

**Request Body:**
```json
{
  "name": "Electronics",
  "description": "Electronic products",
  "parent": null,
  "isActive": true
}
```

### Settings

#### Get Settings
```http
GET /settings
```

**Response:**
```json
{
  "success": true,
  "data": {
    "settings": {
      "website": {
        "name": "Admin Panel",
        "description": "E-Commerce Admin Panel",
        "logo": "logo_url",
        "favicon": "favicon_url"
      },
      "tax": {
        "enabled": true,
        "rate": 18,
        "included": false
      },
      "shipping": {
        "freeShippingThreshold": 500,
        "defaultCost": 50
      },
      "payment": {
        "razorpay": {
          "enabled": true,
          "keyId": "rzp_test_..."
        },
        "stripe": {
          "enabled": false,
          "publishableKey": "pk_test_..."
        }
      }
    }
  }
}
```

#### Update Settings
```http
PUT /settings
```

**Request Body:** Same structure as get response

### Marketing

#### Get Coupons
```http
GET /marketing/coupons
```

#### Create Coupon
```http
POST /marketing/coupons
```

**Request Body:**
```json
{
  "code": "SAVE10",
  "type": "percentage",
  "value": 10,
  "minAmount": 100,
  "maxDiscount": 50,
  "usageLimit": 100,
  "expiresAt": "2023-12-31T23:59:59.000Z",
  "isActive": true
}
```

#### Get Banners
```http
GET /marketing/banners
```

#### Create Banner
```http
POST /marketing/banners
```

## 🚨 Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (development only)"
}
```

### Common Error Codes

- `400`: Bad Request - Validation error
- `401`: Unauthorized - Authentication required
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource not found
- `409`: Conflict - Resource already exists
- `422`: Unprocessable Entity - Validation failed
- `500`: Internal Server Error - Server error

## 🔄 Pagination

All list endpoints support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

**Response Structure:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10
    }
  }
}
```

## 🔍 Search and Filtering

Most list endpoints support search and filtering:

**Common Query Parameters:**
- `search`: Search term
- `status`: Status filter
- `category`: Category filter
- `startDate`: Start date (ISO format)
- `endDate`: End date (ISO format)
- `sortBy`: Sort field
- `sortOrder`: Sort order (asc, desc)

## 📊 Rate Limiting

API endpoints are rate limited:
- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Headers**: Rate limit info in response headers

## 🧪 Testing

### Postman Collection

Import the provided Postman collection to test all endpoints.

### Example Requests

```bash
# Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'

# Get Products
curl -X GET http://localhost:5001/api/products \
  -H "Authorization: Bearer <token>"

# Create Product
curl -X POST http://localhost:5001/api/products \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Product Name","price":99.99,"category":"category_id"}'
```

## 📝 Changelog

### v1.0.0
- Initial API release
- Authentication endpoints
- Product management
- Order management
- User management
- Dashboard analytics
- Settings management
- Marketing tools

## 📞 Support

For API support:
- Check the documentation
- Review error messages
- Contact development team
- Create GitHub issue

---

**API Version: 1.0.0**
**Last Updated: 2023-01-01**
