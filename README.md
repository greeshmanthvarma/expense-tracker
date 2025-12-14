# Fintrack AI - Expense Tracker

**A personal project for managing group expenses with intelligent receipt processing and automated bill splitting.**

## Key Technical Achievements

**🤖 AI Integration**
- Implemented dual AI workflows using Google Gemini 2.5 Flash for receipt processing
- Built intelligent parsing system supporting 15+ currencies and 12 expense categories
- Created structured prompt engineering with validation and error handling

**⚡ Full-Stack Architecture**
- React frontend with Material-UI,Shadcn components and complex state management across 15+ components
- Node.js/Express backend with JWT authentication and 7 modular API routes
- PostgreSQL database with Prisma ORM managing complex many-to-many relationships

**💡 Complex Business Logic**
- Advanced expense splitting algorithms (equal, percentage, custom amounts)
- Real-time balance calculations and debt settlement tracking
- Transaction-based operations ensuring data consistency

## Tech Stack

**Frontend:** React 19, Material-UI, Tailwind CSS, React Router, Vite  
**Backend:** Node.js, Express.js, JWT Authentication, Multer, bcryptjs  
**Database:** PostgreSQL, Prisma ORM with migrations  
**AI/ML:** Google Gemini 2.5 Flash API  
**Tools:** Git, npm, ESLint

## Quick Start

```bash
# Clone and install dependencies
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker

# Server setup
cd server && npm install
npx prisma migrate dev && npx prisma generate

# Client setup  
cd ../client && npm install

# Environment variables (server/.env)
DATABASE_URL="postgresql://username:password@localhost:5432/expense_tracker"
JWT_SECRET="your-jwt-secret"
GEMINI_API_KEY="your-google-ai-key"

# Run application
npm run dev  # (in server directory)
```

## Architecture Highlights

**Database Design**
- 8 normalized tables with complex many-to-many relationships
- Transaction-based operations for data consistency
- Prisma migrations for schema version control

**AI Implementation**
- Dual processing workflows: single expense vs. itemized bills
- Structured prompt engineering with validation constraints
- Error handling and fallback mechanisms for malformed responses

**Security & Performance**
- JWT-based authentication with secure password hashing
- Protected API routes with middleware authorization
- Optimized database queries with Prisma's type-safe client

## Project Scope

This application demonstrates:
- **Full-stack development** with modern JavaScript ecosystem
- **Complex state management** across multiple React components  
- **Advanced database relationships** and transaction handling
- **AI integration** with real-world business logic
- **Production-ready patterns** including authentication, validation, and error handling

A personal project solving real-world expense splitting challenges with modern web technologies.
