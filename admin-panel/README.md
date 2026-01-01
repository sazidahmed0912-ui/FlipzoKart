# E-Commerce Admin Panel - Complete Documentation

## Overview

A complete, production-ready E-Commerce Admin Panel built with React + Node.js + MongoDB. Features comprehensive user management, product management, order processing, payment integration, and marketing tools.

## 🏗️ Architecture

### Frontend (React + Vite)
- **React 18** with hooks and modern patterns
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Query** for data fetching
- **Recharts** for analytics
- **Headless UI** for components
- **Axios** for API calls

### Backend (Node.js + Express)
- **Express.js** server framework
- **MongoDB** with Mongoose ODM
- **JWT** authentication
- **Role-based access control**
- **Multer** for file uploads
- **Cloudinary** for image storage
- **Razorpay/Stripe** payment integration

## 📁 Project Structure

```
admin-panel/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   └── utils/          # Utility functions
│   ├── public/
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middlewares/       # Express middlewares
│   ├── utils/             # Utility functions
│   ├── config/            # Configuration files
│   └── package.json
├── controllers/           # Shared controllers
├── models/               # Shared models
├── routes/               # Shared routes
├── middlewares/          # Shared middlewares
├── utils/                # Shared utilities
└── config/               # Shared configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- MongoDB 4.4 or higher
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd admin-panel
```

2. **Install backend dependencies**
```bash
cd server
npm install
```

3. **Install frontend dependencies**
```bash
cd ../client
npm install
```

4. **Environment Setup**

Create `.env` file in server directory:
```env
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/admin-panel
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
STRIPE_SECRET_KEY=your-stripe-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email
EMAIL_PASS=your-password
CLIENT_URL=http://localhost:3000
```

5. **Start the development servers**

Backend:
```bash
cd server
npm run dev
```

Frontend:
```bash
cd client
npm run dev
```

## 🔐 Authentication & Authorization

### User Roles
- **Admin**: Full access to all features
- **Manager**: Access to products, orders, payments, marketing
- **Support**: Access to orders and customer support features

### Permissions
- `dashboard`: View dashboard and analytics
- `users`: Manage users
- `products`: Manage products
- `orders`: Manage orders
- `payments`: Manage payments
- `settings`: Manage settings
- `marketing`: Manage marketing tools

### JWT Authentication
- Token-based authentication
- Automatic token refresh
- Secure password hashing with bcrypt
- Account lockout after failed attempts

## 📊 Features

### Dashboard
- Real-time statistics
- Sales analytics
- Order tracking
- User metrics
- Revenue reports
- Interactive charts

### Product Management
- Add/Edit/Delete products
- Category management
- Image uploads
- Stock management
- Price and discount management
- SEO optimization

### Order Management
- Order tracking
- Status updates
- Invoice generation
- Shipping management
- Refund processing
- Order history

### User Management
- User registration
- Role assignment
- Permission management
- User blocking/unblocking
- Profile management
- Activity tracking

### Payment Integration
- Razorpay integration
- Stripe integration
- Payment status tracking
- Refund processing
- Transaction history

### Marketing Tools
- Coupon management
- Banner management
- Email campaigns
- Push notifications
- Analytics tracking

### Settings
- Website configuration
- Tax settings
- Shipping settings
- Payment gateway setup
- Email configuration
- System preferences

## 🎨 UI/UX Features

- **Responsive Design**: Works on all devices
- **Dark/Light Mode**: Theme switching
- **Modern UI**: Clean, professional interface
- **Real-time Updates**: Live data refresh
- **Interactive Charts**: Data visualization
- **Search & Filter**: Advanced filtering options
- **Bulk Actions**: Multiple item operations
- **Export Data**: CSV/PDF exports
- **Notifications**: Toast notifications
- **Loading States**: Smooth loading indicators

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/sales` - Sales analytics
- `GET /api/dashboard/users` - User analytics
- `GET /api/dashboard/orders` - Order analytics

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/:id/upload` - Upload product image

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order
- `POST /api/orders/:id/invoice` - Generate invoice

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PUT /api/users/:id/block` - Block user
- `PUT /api/users/:id/unblock` - Unblock user

## 🚀 Deployment

### Vercel (Frontend)
1. Connect your repository to Vercel
2. Set root directory to `client`
3. Add environment variables
4. Deploy

### Render (Backend)
1. Connect your repository to Render
2. Set build command to `npm install`
3. Set start command to `npm start`
4. Add environment variables
5. Deploy

### Docker
```bash
# Build Docker image
docker build -t admin-panel .

# Run container
docker run -p 5001:5001 admin-panel
```

## 📱 Mobile Support

The admin panel is fully responsive and works seamlessly on:
- Desktop (1920px+)
- Laptop (1024px+)
- Tablet (768px+)
- Mobile (320px+)

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Input validation
- SQL injection prevention
- XSS protection
- CSRF protection
- Secure file uploads

## 📈 Performance

- Lazy loading components
- Image optimization
- Code splitting
- Caching strategies
- Database indexing
- API response optimization
- Bundle size optimization

## 🧪 Testing

- Unit tests with Jest
- Integration tests
- API testing with Postman
- E2E testing with Cypress
- Performance testing

## 📚 Documentation

- API documentation
- Component documentation
- Database schema
- Deployment guide
- Troubleshooting guide

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please contact:
- Email: support@example.com
- GitHub Issues: Create an issue
- Documentation: Check the docs folder

## 🔄 Updates

Regular updates and improvements are made to this project. Check the changelog for updates.

---

**Built with ❤️ for modern e-commerce management**
