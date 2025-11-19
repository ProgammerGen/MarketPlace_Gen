# Marketplace Frontend

A modern React application built with TypeScript and Tailwind CSS for the Marketplace assessment.

## Features

- ✅ **Authentication**: Login with JWT token management
- ✅ **Product Listing**: Browse all available products
- ✅ **Product Details**: View detailed product information
- ✅ **Shopping Cart**: Add, update, and remove items from cart
- ✅ **Protected Routes**: Secure access to authenticated pages
- ✅ **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client
- **Context API** - State management

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx
│   ├── ProductCard.tsx
│   ├── LoadingSpinner.tsx
│   ├── ErrorMessage.tsx
│   └── ProtectedRoute.tsx
├── contexts/            # React Context providers
│   ├── AuthContext.tsx
│   └── CartContext.tsx
├── pages/               # Page components
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Products.tsx
│   ├── ProductDetail.tsx
│   └── Cart.tsx
├── services/            # API services
│   └── api.ts
├── types/               # TypeScript type definitions
│   └── index.ts
├── utils/               # Utility functions
│   └── storage.ts
├── App.tsx              # Main app component
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Backend server running on `http://localhost:3000`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

## Test Credentials

- **Email**: `john.doe@example.com`
- **Password**: `password123`

## Features Implementation

### Authentication
- Login page with form validation
- JWT token storage in localStorage
- Protected routes that redirect to login if not authenticated
- Logout functionality

### Products
- Product listing page with grid layout
- Product detail page with full information
- Loading states and error handling
- Add to cart from both listing and detail pages

### Shopping Cart
- Add items to cart
- Update item quantities
- Remove items from cart
- View cart total and item count
- Persistent cart (stored in localStorage)

## API Integration

The app integrates with the backend API at `http://localhost:3000/api`:

- `POST /api/auth/login` - User authentication
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details

## Development

The project uses:
- **Vite** for fast development and building
- **TypeScript** for type safety
- **Tailwind CSS** for utility-first styling
- **ESLint** for code quality

## License

ISC

