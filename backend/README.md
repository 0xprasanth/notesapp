# NotesApp - Task Management API

A robust task management backend API built with Node.js, Express, TypeScript, and MongoDB. This application provides user authentication, task management, and automated email reminders for upcoming task deadlines.

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT-based authentication
- **Task Management**: Create, read, update, and delete tasks with deadlines
- **Automatic Reminders**: Automated email reminders sent 24 hours before task deadlines (configurable)
- **Task Filtering**: Filter tasks by completion status
- **Task Completion**: Mark tasks as completed with automatic reminder cleanup
- **Security**: Helmet.js for security headers, bcrypt for password hashing
- **Validation**: Request validation using express-validator
- **Error Handling**: Comprehensive error handling with custom error classes
- **Cron Jobs**: Automated reminder processing using node-cron
- **Email Service**: HTML email notifications for task reminders

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Email**: Nodemailer
- **Validation**: express-validator, Zod
- **Security**: Helmet.js
- **Logging**: Morgan
- **Cron Jobs**: node-cron
- **Package Manager**: pnpm

## 📁 Project Structure

```
notesapp/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.ts    # Authentication request handlers
│   │   │   │   ├── auth.route.ts         # Auth routes
│   │   │   │   └── auth.service.ts       # Auth business logic
│   │   │   ├── tasks/
│   │   │   │   ├── tasks.controller.ts   # Task request handlers
│   │   │   │   ├── tasks.route.ts        # Task routes
│   │   │   │   └── tasks.service.ts      # Task business logic
│   │   │   └── reminder/
│   │   │       └── reminder.service.ts   # Reminder processing logic
│   │   ├── config/
│   │   │   ├── db.ts                     # MongoDB connection
│   │   │   └── env.ts                    # Environment configuration
│   │   ├── jobs/
│   │   │   └── reminderCron.ts           # Cron job for reminders
│   │   ├── middlewares/
│   │   │   ├── auth.ts                   # JWT authentication middleware
│   │   │   └── errorHandler.ts           # Error handling middleware
│   │   ├── models/
│   │   │   ├── User.ts                   # User model
│   │   │   ├── Task.ts                   # Task model
│   │   │   └── Reminder.ts               # Reminder model
│   │   ├── utils/
│   │   │   └── emailService.ts           # Email sending utility
│   │   ├── routes.ts                     # Route registration
│   │   ├── app.ts                        # Express app configuration
│   │   └── server.ts                     # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── nodemon.json
└── frontend/                             # Frontend directory
  ├── src/
  │   ├── app/                         # Next.js app (app router)
  │   ├── components/                  # UI components
  │   ├── services/                    # API service wrappers
  │   ├── store/                       # Zustand stores
  │   ├── styles/                      # Tailwind CSS / global styles
  │   └── public/                       # Static assets
  ├── package.json
  ├── tsconfig.json
  └── next.config.js
```

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- pnpm (or npm/yarn)
- Email service credentials (for reminders)

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd notesapp
   ```

2. **Install dependencies**
   ```bash
   cd backend
   pnpm install
   ```

  Frontend dependencies (from project root):
  ```bash
  cd frontend
  pnpm install
  ```

3. **Set up environment variables**
   
   Create environment files in the `backend/` directory:
   - `.env.development` (for development)
   - `.env.production` (for production)
   - `.env.stage` (for staging)

   Example `.env.development`:
   ```env
   NODE_ENV=development
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/notesapp_platform
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_SECRET_EXPIRATION=1h
   CORS_PATH=http://localhost:3000,http://localhost:3001
   REMINDER_HOURS_BEFORE=24
   
   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   EMAIL_FROM=noreply@notesapp.com
   
   # Frontend URL (for email links)
   FRONTEND_URL=http://localhost:3000
   ```

  Frontend environment (create `.env` in `frontend/`):
  ```env
  NEXT_PUBLIC_API_URL=http://localhost:3001/api
  # Add other frontend-specific variables as needed (e.g. analytics)
  ```

4. **Start MongoDB**
   
   If using local MongoDB:
   ```bash
   mongod
   ```
   
   Or use MongoDB Atlas cloud service.

5. **Run the application**
   
   Development mode:
   ```bash
   pnpm dev
   ```
   
   Production mode:
   ```bash
   pnpm build
   pnpm start:prod
   ```

## 🌐 API Endpoints

### Base URL
```
http://localhost:3001/api
```

### Health Check
- **GET** `/api/health` - Check API health status

### Authentication

#### Register User
- **POST** `/api/auth/register`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "token": "jwt_token_here"
    }
  }
  ```

#### Login
- **POST** `/api/auth/login`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "token": "jwt_token_here"
    }
  }
  ```

### Tasks (All require authentication)

#### Create Task
- **POST** `/api/tasks`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "title": "Complete project documentation",
    "description": "Write comprehensive README and API docs",
    "deadline": "2024-12-31T23:59:59.000Z"
  }
  ```

#### Get All Tasks
- **GET** `/api/tasks`
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters** (optional):
  - `isCompleted=true` - Filter completed tasks
  - `isCompleted=false` - Filter incomplete tasks

#### Get Task by ID
- **GET** `/api/tasks/:id`
- **Headers**: `Authorization: Bearer <token>`

#### Update Task
- **PUT** `/api/tasks/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body** (all fields optional):
  ```json
  {
    "title": "Updated title",
    "description": "Updated description",
    "deadline": "2024-12-31T23:59:59.000Z",
    "isCompleted": false
  }
  ```

#### Complete Task
- **PATCH** `/api/tasks/:id/complete`
- **Headers**: `Authorization: Bearer <token>`

#### Delete Task
- **DELETE** `/api/tasks/:id`
- **Headers**: `Authorization: Bearer <token>`

## 📊 Database Models

### User
- `name` (String, required, 2-50 chars)
- `email` (String, required, unique, lowercase)
- `password` (String, required, min 6 chars, hashed)
- `createdAt` (Date)
- `updatedAt` (Date)

### Task
- `title` (String, required, 3-200 chars)
- `description` (String, optional, max 1000 chars)
- `deadline` (Date, required, must be future date)
- `isCompleted` (Boolean, default: false)
- `userId` (ObjectId, ref: User, indexed)
- `createdAt` (Date)
- `updatedAt` (Date)

### Reminder
- `taskId` (ObjectId, ref: Task, indexed)
- `userId` (ObjectId, ref: User, indexed)
- `scheduledAt` (Date, indexed)
- `status` (Enum: 'pending', 'sent', 'failed', default: 'pending')
- `errorMessage` (String, optional)
- `sentAt` (Date, optional)
- `createdAt` (Date)
- `updatedAt` (Date)

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens expire after 1 hour (configurable via `JWT_SECRET_EXPIRATION`).

## 📧 Email Reminders

- Reminders are automatically created when a task is created
- Default reminder time: 24 hours before deadline (configurable via `REMINDER_HOURS_BEFORE`)
- Cron job runs every 15 minutes to process pending reminders
- Reminders are automatically deleted when tasks are completed
- Reminders are updated when task deadlines are modified

## 🛡️ Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Helmet.js**: Security headers protection
- **CORS**: Configurable cross-origin resource sharing
- **Input Validation**: Request validation using express-validator
- **Error Handling**: Secure error messages (stack traces only in development)

## 🧪 Testing

Run tests:
```bash
pnpm test
```

Watch mode:
```bash
pnpm test:watch
```

With coverage:
```bash
pnpm test:coverage
```

## 📝 Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build TypeScript to JavaScript
- `pnpm start:prod` - Start production server
- `pnpm start:stage` - Start staging server
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage
- `pnpm prod` - Build and start production server

## 🔄 Development Workflow

1. Make changes to TypeScript files in `src/`
2. nodemon automatically restarts the server on file changes
3. Check logs for errors
4. Test endpoints using Postman, curl, or any HTTP client

## 📦 Deployment

1. Build the project:
   ```bash
   pnpm build
   ```

2. Set production environment variables

3. Start the server:
   ```bash
   pnpm start:prod
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

## 📄 License

MIT

## 👤 Author

NotesApp Development Team

## 🔮 Future Enhancements

- [ ] User profile management
- [ ] Task categories/tags
- [ ] Task priorities
- [ ] Recurring tasks
- [ ] Task sharing/collaboration
- [ ] Push notifications
- [ ] File attachments
- [ ] Task search and advanced filtering
- [ ] Analytics and reporting
- [ ] Mobile app integration

---

For more information or support, please open an issue on the repository.


