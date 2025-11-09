# StyleCart - E-Commerce System Project Summary

## 📋 Project Overview

**StyleCart** is a complete, modern E-Commerce System built with the MERN stack, featuring both retail and wholesale ordering capabilities. The system includes user authentication, product management, shopping cart, order processing, and an admin dashboard.

**Tagline:** "Your Style. Your Cart. Your Marketplace."

---

## 🛠️ Technology Stack

### Frontend
- **React** (with Vite)
- **React Router** (v6) - Client-side routing
- **Axios** - HTTP client for API calls
- **Custom CSS** - Orange (#FF7A00) and white theme
- **LocalStorage** - Client-side state persistence
- **React Context API** - Global state management (Cart, Wishlist)

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose** ODM
- **Multer** - File upload handling (product images)
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration
- **Nodemon** - Development server

### Database
- **MongoDB Atlas** (Cloud database)

---

## 🎨 Design Theme

- **Primary Color:** #FF7A00 (Orange)
- **Secondary Color:** #ffede0 (Soft light orange)
- **Text Color:** #333333
- **Background:** #ffffff
- **Typography:** Poppins (Google Fonts)
- **Design Style:** Modern, minimal, responsive with smooth transitions

---

## 📁 Project Structure

```
Project/
├── Backend/
│   ├── models/          # MongoDB schemas
│   ├── controllers/     # Business logic
│   ├── routes/          # API routes
│   ├── public/         # Static files (uploaded images)
│   └── app.js          # Express app configuration
├── Frontend/
│   ├── src/
│   │   ├── pages/      # Page components
│   │   ├── components/ # Reusable components
│   │   ├── state/      # Context providers (Cart, Wishlist)
│   │   ├── api.js     # Axios configuration
│   │   └── main.jsx   # Root component & routing
│   └── index.html
└── PROJECT_SUMMARY.md  # This file
```

---

## 🚀 Features & Functionality

### 1. User Authentication
- **Registration:** Users can create accounts with name, email, and password
- **Login:** Email and password authentication
- **Profile Management:** Users can view and update their profile
- **Home Address:** Optional saved address for faster checkout
- **Guest Mode:** Guests can browse but cannot add to cart or place orders

### 2. Product Management (Admin)
- **CRUD Operations:** Create, Read, Update, Delete products
- **Product Fields:**
  - Name, Description, Price (₹)
  - Category, Stock quantity
  - Product image upload (local storage)
- **Search Functionality:** Real-time search by product name in product display
- **Category Filter:** Filter products by category in admin panel
- **Edit Feature:** 
  - Auto-populates form with product data
  - Auto-scrolls to form when edit is clicked
  - Smooth user experience
- **Delete Protection:** 
  - Confirmation dialog before deletion
  - Prevents deletion if product exists in any orders (retail or wholesale)
  - Shows appropriate error messages
- **Image Management:** Upload and display product images

### 3. Product Display (Customer)
- **Catalog Page:**
  - View all products in grid layout
  - Search functionality (debounced)
  - Category dropdown filter
  - Sort options: Newest, Oldest, Price (Low to High, High to Low)
  - Product cards with images, name, price, category
- **Product Detail Page:**
  - Detailed product information
  - Large product image
  - Add to cart functionality
  - Wishlist toggle
- **Wholesale Recommendation:** Alert when adding 10+ items suggesting wholesale feature

### 4. Shopping Cart
- **Add/Remove Items:** Add products to cart, remove items
- **Quantity Management:** Increase/decrease item quantities with +/- buttons
- **Stock Validation:** Shows "Only X left in stock" warnings
- **Cart Badge:** Navbar shows cart item count
- **Wholesale Suggestion:** Recommends wholesale for quantities ≥10
- **Guest Restriction:** Login required to add items

### 5. Wishlist
- **Add/Remove:** Toggle products in wishlist
- **Persistent:** Saved in localStorage
- **Wishlist Page:** View all wishlisted products
- **Integration:** Wishlist buttons on catalog and product detail pages

### 6. Checkout Process
- **Address Management:**
  - Option to use saved home address
  - Option to deliver to different location
  - Auto-fill from profile if home address exists
- **Order Placement:**
  - Retail orders via `/api/orders`
  - Wholesale orders via `/api/wholesale/place`
  - Mock payment gateway simulation
- **Order Confirmation:** Shows order ID after successful placement

### 7. Order Management

#### Customer Orders
- **My Orders Page:** View all past orders (retail + wholesale)
- **Order Details:**
  - Order ID, Status, Total amount
  - Product images, names, quantities, prices
  - Order date and time
  - Wholesale badge for bulk orders
- **Order Status:** pending, shipped, out_for_delivery, delivered, cancelled
- **Cancel Order:** Users can cancel non-delivered orders
- **Stock Restoration:** Stock restored when order is cancelled
- **Refund Message:** Shows refund confirmation on cancellation

#### Admin Order Management
- **View All Orders:** Retail and wholesale orders combined
- **Filters:**
  - Status filter (pending, shipped, out_for_delivery, delivered, cancelled)
  - Date range filter (from/to dates)
  - Amount range filter (min/max ₹)
- **Status Updates:** Admin can update order status
- **Order Protection:** Cancelled orders cannot be changed to other statuses
- **Stock Management:** Stock restored when admin cancels order

### 8. Wholesale Bulk Ordering
- **Minimum Quantity:** 10 items per product
- **Stock Requirement:** Products with stock <10 cannot be purchased wholesale
- **Discount:** 25% flat discount on wholesale orders
- **Bulk Order Interface:**
  - Add multiple products with quantities
  - Get quote with discount calculation
  - Available stock display
  - Proceed to checkout
- **Wholesale Orders:** Stored in separate `BulkOrder` collection
- **Integration:** Wholesale orders appear in user's orders and admin management

### 9. Admin Dashboard
- **Admin Login:** Username: "Aum Shah", Password: "bobby26"
- **Admin Logout:** Logout button in top-right corner with confirmation
- **Product Management Tab:**
  - Full-width add/edit product form
  - Product list with search bar and category filter
  - Edit and delete functionality
  - Real-time product search
- **Order Management Tab:**
  - View all orders with filters
  - Update order status
  - Cancel orders with stock restoration

### 10. User Interface Features
- **Responsive Design:** Mobile-friendly layout
- **Sticky Navbar:** Orange-themed navigation bar
- **Sidebar:** Hamburger menu with quick links (Cart, Orders, Wishlist)
- **Profile Icon:** Circular profile button in navbar (when logged in)
- **Login/Logout Button:** Dynamic button based on login status
- **Modern UI:** Smooth transitions, hover effects, pill-shaped nav links

---

## 🌐 Frontend Routes

| Route | Component | Description | Auth Required |
|-------|-----------|-------------|---------------|
| `/` | `Home` | Landing page with hero section | No |
| `/auth` | `App` | Login/Register page | No |
| `/catalog` | `Catalog` | Product catalog with filters | No |
| `/product/:id` | `ProductDetail` | Individual product details | No |
| `/cart` | `Cart` | Shopping cart | No (but login required to add items) |
| `/checkout` | `Checkout` | Checkout page | Yes |
| `/orders` | `MyOrders` | User's order history | Yes |
| `/wishlist` | `Wishlist` | User's wishlist | No |
| `/wholesale` | `Wholesale` | Wholesale bulk order interface | Yes |
| `/admin` | `Admin` | Admin dashboard (Products & Orders) | Yes (Admin) |
| `/profile` | `Profile` | User profile and address management | Yes |

---

## 🔌 Backend API Routes

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Body/Query |
|--------|----------|-------------|------------|
| POST | `/api/auth/register` | Register new user | `{ name, email, password, role? }` |
| POST | `/api/auth/login` | User login | `{ email, password }` |
| GET | `/api/auth/profile` | Get user profile | Query: `email` |
| PUT | `/api/auth/profile` | Update user profile | Query: `email`, Body: `{ name?, phone?, address? }` |

### Product Routes (`/api/products`)

| Method | Endpoint | Description | Body/Query |
|--------|----------|-------------|------------|
| GET | `/api/products` | List all products | Query: `q?`, `category?`, `sort?` |
| GET | `/api/products/:id` | Get product by ID | Params: `id` |
| POST | `/api/products` | Create product | FormData: `name, price, stock, category, description, image?` |
| PUT | `/api/products/:id` | Update product | FormData: `name?, price?, stock?, category?, description?, image?` |
| DELETE | `/api/products/:id` | Delete product (checks if in orders) | Params: `id` |
| GET | `/api/products/meta/categories/list` | Get all categories | None |

### Order Routes (`/api/orders`)

| Method | Endpoint | Description | Body/Query |
|--------|----------|-------------|------------|
| POST | `/api/orders` | Create retail order | `{ customerEmail?, items, address }` |
| GET | `/api/orders/mine` | Get user's orders | Query: `email` |
| GET | `/api/orders` | Get all orders (Admin) | Query: `status?`, `from?`, `to?`, `min?`, `max?` |
| PUT | `/api/orders/:id/status` | Update order status | Params: `id`, Body: `{ status }` |
| PUT | `/api/orders/:id/cancel` | Cancel user's order | Params: `id`, Query: `email` |

### Wholesale Routes (`/api/wholesale`)

| Method | Endpoint | Description | Body/Query |
|--------|----------|-------------|------------|
| POST | `/api/wholesale/quote` | Get wholesale quote | `{ items: [{ productId, qty }] }` |
| POST | `/api/wholesale/place` | Place wholesale order | `{ buyerEmail?, items, address }` |
| GET | `/api/wholesale` | Get wholesale orders | Query: `email?` |

### Admin Routes (`/api/admin`)

| Method | Endpoint | Description | Body/Query |
|--------|----------|-------------|------------|
| POST | `/api/admin/login` | Admin login | `{ username, password }` |

---

## 🗄️ Database Models

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String,
  role: String (enum: 'admin', 'customer', 'wholesale', default: 'customer'),
  phone: String (optional),
  address: {
    line1, line2, city, state, postalCode, country
  } (optional),
  isWholesaleAccount: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model
```javascript
{
  name: String (required),
  description: String,
  price: Number (required),
  category: String,
  stock: Number (required),
  imageUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model (Retail)
```javascript
{
  customerEmail: String,
  items: [{
    productId: ObjectId (ref: Product),
    name: String,
    price: Number,
    qty: Number,
    imageUrl: String
  }],
  address: {
    line1, line2, city, state, postalCode, country
  },
  amount: Number (required),
  status: String (enum: 'pending', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'),
  type: String (enum: 'retail', 'wholesale', default: 'retail'),
  createdAt: Date,
  updatedAt: Date
}
```

### BulkOrder Model (Wholesale)
```javascript
{
  buyerEmail: String,
  items: [{
    productId: ObjectId (ref: Product),
    name: String,
    qty: Number (min: 10),
    basePrice: Number,
    discountPercent: Number,
    unitPrice: Number,
    lineTotal: Number,
    imageUrl: String
  }],
  totalAmount: Number (required),
  address: {
    line1, line2, city, state, postalCode, country
  },
  status: String (enum: 'pending', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'),
  createdAt: Date,
  updatedAt: Date
}
```

### Admin Model
```javascript
{
  username: String (required),
  password: String (required)
}
```

---

## 🔑 Key Features Breakdown

### Stock Management
- **Atomic Updates:** Stock decremented atomically when orders are placed
- **Stock Validation:** Checks stock availability before order placement
- **Stock Restoration:** Stock restored when orders are cancelled
- **Wholesale Stock Check:** Products with <10 stock cannot be purchased wholesale

### Order Status Flow
1. **pending** → Order placed, awaiting processing
2. **shipped** → Order shipped from warehouse
3. **out_for_delivery** → Order out for delivery
4. **delivered** → Order successfully delivered
5. **cancelled** → Order cancelled (stock restored, refund message shown)

### Wholesale Pricing
- **Minimum Quantity:** 10 items per product
- **Discount:** 25% flat discount on all wholesale items
- **Tiered Pricing:** Calculated based on quantity
- **Stock Requirement:** Minimum 10 stock required for wholesale purchase

### Security & Validation
- **Guest Restrictions:** Guests cannot add to cart or place orders
- **Login Required:** Checkout and order placement require authentication
- **Order Cancellation:** Users can only cancel their own orders
- **Status Protection:** Cancelled orders cannot be reactivated
- **Stock Validation:** Real-time stock checks before order placement
- **Product Deletion Protection:** Products cannot be deleted if they exist in any orders (retail or wholesale)
- **Data Integrity:** Prevents deletion of products that are part of active or completed orders

### User Experience
- **Responsive Design:** Works on mobile, tablet, and desktop
- **Real-time Updates:** Cart count, login status update automatically
- **Smooth Transitions:** Hover effects, animations, modern UI
- **Error Handling:** User-friendly error messages
- **Loading States:** Loading indicators during API calls
- **Form Validation:** Required fields, proper input types

---

## 📝 Environment Variables

### Backend (.env)
```
PORT=3000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173
```

### Frontend
- API base URL configured in `src/api.js`
- Default: `http://localhost:3000/api`

---

## 🚦 Getting Started

### Backend Setup
```bash
cd Backend
npm install
# Create .env file with required variables
npm run dev  # Starts on port 3000
```

### Frontend Setup
```bash
cd Frontend
npm install
npm run dev  # Starts on port 5173
```

### Default Admin Credentials
- **Username:** Aum Shah
- **Password:** bobby26

---

## 📊 Project Statistics

- **Total Frontend Pages:** 11
- **Total Backend API Endpoints:** 20+
- **Database Collections:** 5 (Users, Products, Orders, BulkOrders, Admins)
- **Features Implemented:** 10 major feature sets
- **Responsive Breakpoints:** Mobile, Tablet, Desktop

---

## 🎯 Future Enhancements (Optional)

- JWT-based authentication (currently using localStorage)
- Email notifications for order confirmations
- Product ratings and reviews
- Payment gateway integration (Razorpay/Stripe)
- Advanced analytics dashboard
- Search autocomplete
- Product image optimization
- Multi-image support for products
- Order tracking with real-time updates
- Wishlist sharing
- Product recommendations

---

## 📄 License & Credits

**Project:** StyleCart E-Commerce System  
**Developer:** 23CS085 Aum Shah  
**Stack:** MERN (MongoDB, Express, React, Node.js)  
**Theme:** Orange (#FF7A00) and White

---

*This project demonstrates a complete full-stack e-commerce solution with modern UI/UX, robust backend APIs, and comprehensive order management system.*

