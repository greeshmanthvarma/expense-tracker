# Fintrack AI - Expense Tracker

> A full-stack expense management application with AI-powered receipt processing and intelligent bill splitting for groups and friends.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-316192?logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.11-2D3748?logo=prisma)](https://www.prisma.io/)

---

## Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Key Technical Achievements](#-key-technical-achievements)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Architecture Highlights](#-architecture-highlights)
- [Challenges & Solutions](#-challenges--solutions)
- [Future Improvements](#-future-improvements)
- [License](#-license)

---

## Features

### Personal Expense Management
- Track personal expenses with categories and date filtering
- Visual analytics with charts and statistics
- Multi-currency support (15+ currencies)
- Modern glassmorphism UI with dark/light theme support

### Group Expense Management
- Create and manage expense groups
- Split expenses equally, by percentage, or custom amounts
- Create itemized bills with multiple line items
- Real-time balance calculations and debt tracking
- Partial settlement tracking with audit trails

### AI-Powered Receipt Processing
- Upload receipt images for automatic expense extraction
- Intelligent parsing of itemized bills with multiple line items
- Automatic currency and category detection
- Validation and error handling for malformed receipts

### Social Features
- Friend management system
- Group-based expense sharing
- Per-group expense analytics
- Balance notifications and settlement tracking

---

## Tech Stack

### Frontend
- **React 19** - UI library
- **Material-UI (MUI)** - Component library
- **Shadcn UI** - Additional UI components
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Recharts** - Data visualization
- **Vite** - Build tool and dev server

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JWT** - Authentication
- **Multer** - File upload handling
- **bcryptjs** - Password hashing

### Database
- **PostgreSQL** - Relational database
- **Prisma ORM** - Database toolkit with migrations

### AI/ML
- **Google Gemini 2.5 Flash API** - Receipt processing and bill parsing

### Tools
- **Git** - Version control
- **ESLint** - Code linting
- **npm** - Package management

---

## Key Technical Achievements

### AI Integration
- Implemented dual AI workflows using Google Gemini 2.5 Flash for receipt processing
- Built intelligent parsing system supporting 15+ currencies and 12 expense categories
- Created structured prompt engineering with validation and error handling
- Dual processing modes: single expense extraction vs. itemized bill parsing

### Full-Stack Architecture
- React frontend with Material-UI and Shadcn components
- Complex state management across 15+ components
- Node.js/Express backend with JWT authentication
- 7 modular API routes with RESTful design
- PostgreSQL database with Prisma ORM managing complex many-to-many relationships

### Complex Business Logic
- Advanced expense splitting algorithms (equal, percentage, custom amounts)
- Real-time balance calculations and debt settlement tracking
- Transaction-based operations ensuring data consistency
- Partial settlement support with accumulation logic

### Modern UI/UX
- Glassmorphism design with gradient backgrounds
- Dark/light theme support with smooth transitions
- Responsive design for multiple screen sizes
- Interactive charts and data visualizations

---

## Screenshots

- **Homepage** (Light Mode & Dark Mode)
  - ![Homepage Light Mode](./screenshots/home-light.png)
  - ![Homepage Dark Mode](./screenshots/home-dark.png)
- **Expenses Page** (Dark Mode)
  - ![Expenses Page](./screenshots/expenses-dark.png)
- **Friends Page** (Light Mode)
  - ![Friends Page](./screenshots/friends-light.png)
- **Group Details** (Light Mode)
  - ![Group Details](./screenshots/group-light.png)
- **Add Expense Dialog** (Dark Mode)
  - ![Add Expense Dialog](./screenshots/add-expense-dark.png)
- **Bill Creation Dialog** (Dark Mode)
  - ![Bill Creation Dialog](./screenshots/bill-create-dialog.png)
- **AI-Parsed Bills** (Dark Mode)
  - ![Parsed Bill 1](./screenshots/parsed-bill-1.png)
  - ![Parsed Bill 2](./screenshots/parsed-bill-2.png)

---

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn
- Google Gemini API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/expense-tracker.git
   cd expense-tracker
   ```

2. **Set up the backend**
   ```bash
   cd server
   npm install
   
   # Set up environment variables
   cp .env.example .env
   # Edit .env with your configuration
   
   # Run database migrations
   npx prisma migrate dev
   npx prisma generate
   ```

3. **Set up the frontend**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure environment variables** (`server/.env`)
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/expense_tracker"
   JWT_SECRET="your-super-secret-jwt-key-here"
   GEMINI_API_KEY="your-google-gemini-api-key"
   PORT=5000
   ```

5. **Run the application**
   ```bash
   # Terminal 1 - Start backend server
   cd server
   npm run dev
   
   # Terminal 2 - Start frontend dev server
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173 (or the port Vite assigns)
   - Backend API: http://localhost:5000

---

## Project Structure

```
expense-tracker/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   └── *.jsx          # Page components
│   ├── public/             # Static assets
│   └── package.json
│
├── server/                 # Node.js backend application
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── middleware/    # Express middleware
│   │   ├── aiGetReceiptDetails.js
│   │   ├── aiGenerateBill.js
│   │   └── server.js      # Entry point
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   └── migrations/     # Database migrations
│   └── package.json
│
└── README.md
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Expenses
- `GET /api/expenses` - Get user expenses
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Friends
- `GET /api/friends` - Get user's friends
- `POST /api/friends` - Add friend
- `DELETE /api/friends/:id` - Remove friend

### Groups
- `GET /api/groups` - Get user's groups
- `POST /api/groups` - Create group
- `GET /api/groups/:id` - Get group details
- `PUT /api/groups/:id` - Update group
- `DELETE /api/groups/:id` - Delete group

### Group Expenses
- `GET /api/groupExpenses/:id` - Get group expenses
- `POST /api/groupExpenses` - Create group expense
- `POST /api/groupExpenses/bill` - Create itemized bill
- `GET /api/groupExpenses/bill/:id` - Get group bills

### Settlements
- `POST /api/settlements` - Create settlement
- `PUT /api/settlements/:id` - Update settlement

### Upload
- `POST /api/upload/receipt` - Upload receipt for AI processing
- `POST /api/upload/bill` - Upload bill for AI processing

---

## Architecture Highlights

### Database Design
- **8 normalized tables** with complex many-to-many relationships
- **Transaction-based operations** for data consistency
- **Prisma migrations** for schema version control
- **Optimized queries** with Prisma's type-safe client

### AI Implementation
- **Dual processing workflows**: single expense vs. itemized bills
- **Structured prompt engineering** with validation constraints
- **Error handling** and fallback mechanisms for malformed responses
- **Multi-currency and category detection**

### Security & Performance
- **JWT-based authentication** with secure password hashing
- **Protected API routes** with middleware authorization
- **Input validation** and sanitization
- **Optimized database queries** with Prisma's type-safe client

### Frontend Architecture
- **Component-based architecture** with reusable UI components
- **Context API** for global state management (Auth, Theme)
- **Custom hooks** for data fetching and business logic
- **Responsive design** with mobile-first approach

---

## Challenges & Solutions

### Challenge 1: Complex Balance Calculations
**Problem**: Calculating accurate balances with partial settlements required tracking multiple transactions.

**Solution**: Implemented settlement accumulation logic that tracks all partial payments and calculates remaining balances dynamically.

### Challenge 2: AI Receipt Parsing Accuracy
**Problem**: Receipt images vary in quality and format, making extraction unreliable.

**Solution**: Created structured prompts with validation constraints, implemented dual workflows for different receipt types, and added error handling with fallback mechanisms.

### Challenge 3: Real-time State Synchronization
**Problem**: Keeping UI in sync with backend data across multiple components.

**Solution**: Implemented centralized state management with Context API and proper data fetching patterns with error handling.

### Challenge 4: Complex Expense Splitting Logic
**Problem**: Supporting multiple split methods (equal, percentage, custom) while maintaining data integrity.

**Solution**: Built flexible splitting algorithms with validation to ensure split amounts always match total expense, using database transactions for consistency.

### Challenge 5: Splitting Individual Items on AI-Parsed Bills
**Problem**: Processing AI-parsed itemized bills where the entire bill has one payer, but each line item can have different owers. Required handling imperfect AI parsing while maintaining distinction between bill payer and item owers.

**Solution**: Implemented dual-stage workflow: AI extracts itemized details from receipts, then users assign one payer for the entire bill and multiple owers per item. Created nested data structure with `Bill.payerId` (single payer) and `ExpenseItem.owers` (many-to-many relationship). Added validation ensuring item prices sum to bill total, with database transactions for atomicity and error handling for parsing inconsistencies.


---








