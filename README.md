# 🛍️ NearBuy - E-Commerce Platform

> **Status**: ✅ Backend & Frontend Fully Connected | No Errors | Ready for Development

A modern, full-stack e-commerce platform connecting local vendors with customers. Built with React and Express.js, featuring real-time inventory management, order processing, and notifications.

---

## 🚀 Quick Start

### Option 1: PowerShell Script (Windows - Recommended)
```powershell
.\start.ps1
```

### Option 2: npm Scripts
```bash
npm install concurrently
npm run dev
```

### Option 3: Manual
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

**Access**: 
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Documentation](#-documentation)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## ✨ Features

### For Customers
- ✅ User registration and authentication
- ✅ Browse products by category
- ✅ Search and filter products
- ✅ Shopping cart management
- ✅ Order placement and tracking
- ✅ Real-time notifications
- ✅ Order history
- ✅ User profile management

### For Vendors
- ✅ Vendor registration
- ✅ Product management (CRUD)
- ✅ Inventory tracking
- ✅ Order management
- ✅ Sales analytics ready

### Technical Features
- ✅ RESTful API
- ✅ JWT-ready authentication
- ✅ Password hashing (bcrypt)
- ✅ CORS configured
- ✅ Input validation
- ✅ Error handling
- ✅ Responsive design
- ✅ State management
- ✅ Protected routes

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19.2.3
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 4.1.18
- **Routing**: React Router DOM 7.10.1
- **Icons**: Lucide React
- **State**: Context API

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5.1.0
- **Database**: PostgreSQL
- **ORM**: Sequelize 6.37.7
- **Auth**: bcrypt 6.0.0
- **CORS**: cors 2.8.5

### Development Tools
- **Frontend Dev**: Vite
- **Backend Dev**: Nodemon
- **Linting**: ESLint
- **Version Control**: Git

---

## 📁 Project Structure

```
NearBuy/
├── backend/                    # Express.js backend
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── controllers/       # Request handlers
│   │   ├── models/            # Database models
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Custom middleware
│   │   └── index.js           # Server entry point
│   ├── .env                   # Environment variables
│   └── package.json
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── assets/            # Static assets
│   │   ├── component/         # Reusable components
│   │   ├── context/           # React contexts
│   │   ├── hooks/             # Custom hooks
│   │   ├── pages/             # Page components
│   │   ├── services/          # API service layer
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # Entry point
│   ├── .env                   # Environment variables
│   ├── vite.config.js         # Vite configuration
│   └── package.json
│
├── docs/                       # Documentation
│   ├── ARCHITECTURE.md        # System architecture
│   ├── CONNECTION_GUIDE.md    # API connection guide
│   ├── INTEGRATION_COMPLETE.md # Integration details
│   ├── QUICK_REFERENCE.md     # Quick reference
│   └── SETUP_GUIDE.md         # Setup guide
│
├── start.ps1                   # Windows quick start
├── package.json                # Root package
└── README.md                   # This file
```

---

## 💻 Installation

### Prerequisites
- Node.js (v18+)
- PostgreSQL database
- npm or yarn

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd NearBuy
```

### Step 2: Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### Step 3: Configure Environment

**Backend** (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
JWT_SECRET=your_secret_key_here
FRONTEND_URL=http://localhost:5173
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Setup Database
1. Create PostgreSQL database
2. Update DATABASE_URL in backend/.env
3. Run migrations (if available)

### Step 5: Start Application
```bash
npm run dev
```

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | 5000 |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `JWT_SECRET` | Secret for JWT tokens | - |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 |
| `VITE_API_URL` | Backend API URL | http://localhost:5000/api |

### Ports
- Backend: 5000
- Frontend: 5173
- Database: 5432 (PostgreSQL default)

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Authentication
```
POST   /customers/login           # Login
POST   /customers/register        # Register
```

#### Products
```
GET    /products                  # All products
GET    /products/:id              # Single product
GET    /products/search?title=    # Search
POST   /products                  # Create product
PUT    /products/:id              # Update product
DELETE /products/:id              # Delete product
```

#### Orders
```
POST   /orders                    # Create order
GET    /orders/customer/:id       # Customer orders
GET    /orders/:id                # Single order
PATCH  /orders/:id/status         # Update status
```

#### Vendors
```
GET    /vendors                   # All vendors
GET    /vendors/:id               # Single vendor
POST   /vendors/register          # Register vendor
```

#### Notifications
```
GET    /notifications/customer/:id
PATCH  /notifications/:id/read
DELETE /notifications/:id
```

**For complete API documentation, see [CONNECTION_GUIDE.md](CONNECTION_GUIDE.md)**

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [QUICK_REFERENCE.md](QUICK_REFERENCE.md) | Quick commands and snippets |
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | Complete setup instructions |
| [CONNECTION_GUIDE.md](CONNECTION_GUIDE.md) | API connection details |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System architecture |
| [INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md) | Integration summary |
| [README_INTEGRATION.md](README_INTEGRATION.md) | Integration status |

---

## 👨‍💻 Development

### Available Scripts

#### Root Directory
```bash
npm run dev              # Run both servers
npm run dev:backend      # Backend only
npm run dev:frontend     # Frontend only
npm run install:all      # Install all dependencies
```

#### Backend
```bash
npm run dev    # Development with nodemon
npm start      # Production
```

#### Frontend
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview build
npm run lint     # Run linter
```

### Code Examples

#### Using API Service
```javascript
import { customerAPI, productAPI } from './services/api';

// Login
const result = await customerAPI.login(email, password);

// Get products
const products = await productAPI.getAll();
```

#### Using Custom Hooks
```javascript
import { useProducts } from './hooks/useProducts';

const { products, loading, error } = useProducts();
```

#### Using Auth Context
```javascript
import { useAuth } from './context/AuthContext';

const { user, login, logout, isAuthenticated } = useAuth();
```

---

## 🚢 Deployment

### Backend Deployment
1. Set NODE_ENV=production
2. Use production database
3. Set secure JWT_SECRET
4. Enable HTTPS
5. Add rate limiting
6. Deploy to Heroku/Railway/AWS

### Frontend Deployment
1. Run `npm run build`
2. Deploy `dist/` to Vercel/Netlify
3. Set production API URL
4. Configure environment variables

**For detailed deployment guide, see [SETUP_GUIDE.md](SETUP_GUIDE.md)**

---

## 🧪 Testing

### Manual Testing
1. Start both servers
2. Register new user
3. Login with credentials
4. Browse products
5. Add to cart
6. Create order
7. Check notifications

### API Testing
- Use included Postman collection
- Located at `backend/NearBuy_Notifications_API.postman_collection.json`

---

## 🔐 Security

### Current Implementation
- ✅ Password hashing (bcrypt)
- ✅ CORS configured
- ✅ Environment variables
- ✅ Input validation

### Recommended for Production
- ⚠️ JWT authentication
- ⚠️ Rate limiting
- ⚠️ HTTPS
- ⚠️ Input sanitization
- ⚠️ Security headers
- ⚠️ CSRF protection

---

## 🐛 Troubleshooting

### Common Issues

**CORS Error**
- Ensure backend is running
- Check FRONTEND_URL in .env
- Verify Vite proxy config

**Can't Connect to API**
- Check both servers are running
- Verify .env configuration
- Check browser console

**Login Fails**
- Ensure user is registered
- Check database connection
- Verify password hashing

**Port Already in Use**
```bash
npx kill-port 5000
npx kill-port 5173
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the ISC License.

---

## 👥 Authors

- Your Name - Initial work

---

## 🙏 Acknowledgments

- React team for amazing framework
- Express.js for robust backend
- Tailwind CSS for styling
- PostgreSQL for database
- All open-source contributors

---

## 📞 Support

For support:
1. Check documentation files
2. Review troubleshooting section
3. Open an issue on GitHub
4. Contact maintainers

---

## 🗺️ Roadmap

### Phase 1 (Current) ✅
- [x] User authentication
- [x] Product management
- [x] Order processing
- [x] Notifications
- [x] API integration

### Phase 2 (Upcoming)
- [ ] JWT authentication
- [ ] Payment gateway
- [ ] Email notifications
- [ ] Advanced search
- [ ] Product reviews

### Phase 3 (Future)
- [ ] Admin dashboard
- [ ] Analytics
- [ ] Mobile app
- [ ] AI recommendations
- [ ] Multi-language support

---

## ✅ Status

- **Backend**: ✅ Complete & Connected
- **Frontend**: ✅ Complete & Connected
- **Integration**: ✅ Complete
- **Documentation**: ✅ Complete
- **Errors**: ✅ None
- **Production Ready**: ✅ For Development

---

## 📊 Project Stats

- **Files Created**: 15+ integration files
- **API Endpoints**: 25+ endpoints
- **Components**: 10+ React components
- **Hooks**: 4 custom hooks
- **Context Providers**: 2
- **Documentation**: 6 comprehensive guides

---

**Made with ❤️ for NearBuy**

**Last Updated**: December 2025  
**Version**: 1.0.0  
**Status**: Active Development
