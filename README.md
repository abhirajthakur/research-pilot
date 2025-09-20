# Research Pilot 🚀

An AI-powered research automation platform that helps users conduct comprehensive research on any topic using advanced AI models and web scraping capabilities.

## 🌟 Features

- **🔐 User Authentication**: Secure JWT-based authentication system
- **🤖 AI-Powered Research**: Automated research using Google Gemini AI
- **📰 Article Extraction**: Intelligent web scraping and content extraction
- **⚡ Background Processing**: Asynchronous job processing with Bull.js queues
- **📊 Real-time Updates**: Live status tracking of research requests
- **🎨 Modern UI**: Clean, responsive interface built with Next.js and Tailwind CSS
- **🐳 Docker Ready**: Full containerization support for easy deployment

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Worker        │
│   (Next.js)     │◄──►│   (Express)     │◄──►│   (Bull.js)     │
│                 │    │                 │    │                 │
│ • Authentication│    │ • JWT Auth      │    │ • AI Processing │
│ • Research Form │    │ • API Routes    │    │ • Web Scraping  │
│ • Results View  │    │ • Queue Jobs    │    │ • Data Storage  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐    ┌─────────────────┐
                    │   PostgreSQL    │    │     Redis       │
                    │   (Database)    │    │   (Queue)       │
                    │                 │    │                 │
                    │ • User Data     │    │ • Job Queue     │
                    │ • Research Data │    │ • Session Store │
                    │ • Results       │    │ • Cache         │
                    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ or **Bun**
- **Docker** & **Docker Compose** (recommended)
- **PostgreSQL** 15+
- **Redis** 7+

### Option 1: Backend with Docker Compose (Recommended)

1. **Clone the repository**

   ```bash
   git clone https://github.com/abhirajthakur/research-pilot
   cd research-pilot
   ```

2. **Set up backend environment variables**

   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

3. **Start backend services**

   ```bash
   docker-compose up -d
   ```

4. **Setup and run frontend locally**

   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   # Edit .env.local with your backend URL
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Health Check: http://localhost:8000/health

### Option 2: Manual Setup

1. **Clone and setup backend**

   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration

   # Start PostgreSQL and Redis
   docker run -d --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=mysecretpassword postgres:17-alpine
   docker run -d --name redis -p 6379:6379 redis:7-alpine

   # Run database migrations
   npm run db:migrate

   # Start backend services
   npm run dev
   ```

2. **Setup frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📋 Environment Configuration

### Backend (.env)

```bash
# Database Configuration
DATABASE_URL=postgresql://postgres:mysecretpassword@localhost:5432/postgres

# Redis Configuration
REDIS_URL=redis://127.0.0.1:6379

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secure-jwt-secret-here

# External API Keys
NEWS_API_KEY=your-news-api-key-here
GOOGLE_API_KEY=your-google-gemini-api-key-here

# Application Configuration
NODE_ENV=development
PORT=8000
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🔧 Development

### Recommended Docker Development Workflow

For the best local development experience with Docker, follow this workflow:

1. **Start databases first**

   ```bash
   docker-compose up -d postgres redis
   ```

2. **Run migrations locally** (make sure you have dev dependencies installed)

   ```bash
   cd backend
   pnpm install
   DATABASE_URL=postgresql://postgres:mysecretpassword@localhost:5432/postgres pnpm run db:migrate
   ```

3. **Start application services**

   ```bash
   docker-compose up api worker
   ```

4. **Or start everything at once** (after migrations are done)
   ```bash
   docker-compose up
   ```

This approach allows you to:

- Run databases in containers for consistency
- Execute migrations with your local development tools
- Start application services with live reloading
- Maintain full control over the development environment

### Backend Development

```bash
cd backend

# Install dependencies
npm install

# Development (API + Worker)
npm run dev

# Run API server only
npm run dev:api

# Run worker process only
npm run dev:worker

# Database operations
npm run db:generate    # Generate migrations
npm run db:migrate     # Run migrations
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

```

```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| POST   | `/auth/register` | Register new user |
| POST   | `/auth/login`    | Login user        |

### Research Endpoints

| Method | Endpoint        | Description                   |
| ------ | --------------- | ----------------------------- |
| POST   | `/research`     | Create research request       |
| GET    | `/research`     | Get user's research requests  |
| GET    | `/research/:id` | Get specific research request |

### Health Check

| Method | Endpoint  | Description       |
| ------ | --------- | ----------------- |
| GET    | `/health` | API health status |

## 🔄 Research Workflow

1. **Input Parsing**: User submits research topic through the web interface
2. **Authentication**: System validates user credentials and permissions
3. **Job Creation**: Research request is queued for background processing
4. **Data Gathering**: Automated web search and article collection
5. **Content Extraction**: Intelligent parsing and cleaning of web content
6. **AI Processing**: Google Gemini analyzes and summarizes collected content
7. **Result Compilation**: Structured research results with summaries, keywords, and sources
8. **Persistence**: Results stored in database with full audit trail
9. **Notification**: User receives real-time updates on research progress

## 🛠️ Technology Stack

### Frontend

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Component library
- **Sonner** - Toast notifications

### Backend

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Drizzle ORM** - Database ORM
- **Bull.js** - Job queue system
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Database & Infrastructure

- **PostgreSQL** - Primary database
- **Redis** - Queue and cache storage
- **Docker** - Containerization

### AI & External Services

- **Google Gemini** - AI text processing
- **News API** - Article sourcing

## 🔒 Security Considerations

- JWT tokens for stateless authentication
- Password hashing with bcrypt
- Environment variable protection
- CORS configuration
- Input validation and sanitization

### 📖 [Architecture Guide](ARCHITECTURE.md) - Detailed system architecture and design decisions
