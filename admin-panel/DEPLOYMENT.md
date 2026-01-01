# Admin Panel Deployment Guide

## 🚀 Production Deployment

This guide covers deploying the E-Commerce Admin Panel to production environments.

## 📋 Prerequisites

- Node.js 18.x or higher
- MongoDB database
- Cloudinary account (for image storage)
- Razorpay/Stripe account (for payments)
- Email service (SMTP)

## 🔧 Environment Configuration

### Backend Environment Variables

Create `.env` file in server directory:

```env
# Server Configuration
NODE_ENV=production
PORT=5001

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/admin-panel

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRE=7d

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Payment Gateways
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
STRIPE_SECRET_KEY=your-stripe-secret-key

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# CORS
CLIENT_URL=https://your-frontend-domain.com
```

### Frontend Environment Variables

Create `.env` file in client directory:

```env
VITE_API_URL=https://your-backend-domain.com
VITE_APP_NAME=Admin Panel
```

## 🌐 Deployment Options

### Option 1: Vercel (Frontend) + Render (Backend)

#### Frontend (Vercel)

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - Root Directory: `admin-panel/client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables**
   - Add frontend environment variables
   - Add `VITE_API_URL` pointing to your backend URL

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete

#### Backend (Render)

1. **Connect Repository**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - Root Directory: `admin-panel/server`
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Environment Variables**
   - Add all backend environment variables
   - Set `NODE_ENV=production`

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

### Option 2: Docker Deployment

#### Create Dockerfile

**Backend Dockerfile** (`admin-panel/server/Dockerfile`):

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5001

USER node

CMD ["npm", "start"]
```

**Frontend Dockerfile** (`admin-panel/client/Dockerfile`):

```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf** (`admin-panel/client/nginx.conf`):

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /api {
            proxy_pass http://backend:5001;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: ./server
    ports:
      - "5001:5001"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/admin-panel
      - JWT_SECRET=your-super-secret-jwt-key
    depends_on:
      - mongo
    volumes:
      - ./server/uploads:/app/uploads

  frontend:
    build: ./client
    ports:
      - "80:80"
    depends_on:
      - backend

  mongo:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

#### Deploy with Docker

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 3: AWS EC2

#### Server Setup

1. **Launch EC2 Instance**
   - Choose Ubuntu 20.04 LTS
   - Select t3.medium or larger
   - Configure security groups (ports 22, 80, 443, 5001)

2. **Install Dependencies**
```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx nodejs npm mongodb
```

3. **Clone and Deploy**
```bash
git clone <repository-url>
cd admin-panel

# Deploy backend
cd server
npm install
pm2 start server.js --name admin-panel

# Deploy frontend
cd ../client
npm install
npm run build
sudo cp -r dist/* /var/www/html/
```

4. **Configure Nginx**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

5. **SSL Certificate**
```bash
sudo certbot --nginx -d your-domain.com
```

## 🔒 Security Configuration

### SSL/TLS Setup

1. **Obtain SSL Certificate**
   - Use Let's Encrypt (free)
   - Or purchase from certificate authority

2. **Configure HTTPS**
   - Update environment variables
   - Set up redirects
   - Configure security headers

### Security Headers

Add these headers to your Nginx configuration:

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

### Firewall Configuration

```bash
# Ubuntu UFW
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

## 📊 Monitoring & Logging

### Application Monitoring

1. **PM2 Monitoring**
```bash
pm2 monit
pm2 logs admin-panel
```

2. **Log Management**
```bash
# Configure log rotation
sudo nano /etc/logrotate.d/admin-panel
```

3. **Error Tracking**
   - Integrate with Sentry
   - Set up error alerts
   - Monitor application health

### Database Monitoring

1. **MongoDB Monitoring**
   - Use MongoDB Atlas monitoring
   - Set up performance alerts
   - Monitor query performance

2. **Backup Strategy**
```bash
# Daily backup script
mongodump --uri="mongodb://localhost:27017/admin-panel" --out=/backup/$(date +%Y%m%d)
```

## 🚀 Performance Optimization

### Frontend Optimization

1. **Bundle Size Reduction**
   - Code splitting
   - Tree shaking
   - Image optimization

2. **Caching Strategy**
   - Browser caching
   - CDN integration
   - API response caching

### Backend Optimization

1. **Database Optimization**
   - Indexing strategy
   - Query optimization
   - Connection pooling

2. **Server Optimization**
   - Load balancing
   - Caching with Redis
   - Compression middleware

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Admin Panel

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to production
        run: |
          # Add your deployment commands here
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check MongoDB URI
   - Verify network connectivity
   - Check firewall settings

2. **Authentication Issues**
   - Verify JWT secret
   - Check token expiration
   - Validate user permissions

3. **File Upload Issues**
   - Check Cloudinary configuration
   - Verify file size limits
   - Check CORS settings

4. **Payment Gateway Issues**
   - Verify API keys
   - Check webhook configuration
   - Validate currency settings

### Debug Mode

Enable debug logging:

```env
DEBUG=*
NODE_ENV=development
```

## 📈 Scaling Strategy

### Horizontal Scaling

1. **Load Balancing**
   - Use Nginx load balancer
   - Configure multiple server instances
   - Implement health checks

2. **Database Scaling**
   - Read replicas
   - Sharding strategy
   - Connection pooling

### Vertical Scaling

1. **Server Resources**
   - Increase CPU cores
   - Add more RAM
   - Use SSD storage

2. **Application Optimization**
   - Profile performance bottlenecks
   - Optimize database queries
   - Implement caching

## 📞 Support

For deployment issues:
- Check the documentation
- Review error logs
- Contact support team
- Create GitHub issue

---

**Happy Deploying! 🚀**
