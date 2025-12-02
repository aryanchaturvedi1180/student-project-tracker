# 📊 Student Project Tracker with Early Risk Prediction

A full-stack web application designed to help students manage their project tasks, track progress, and receive early warnings about potential delays. This system uses rule-based AI logic to predict project risks.

## 🏗️ Tech Stack

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **AI Logic**: Basic rule-based risk calculation formula

## 🎯 Features

### 1️⃣ User Module
- Dummy login system (no authentication required)
- User model with: name, role (student/team-leader/project-manager), email

### 2️⃣ Task Management Module
- **Full CRUD Operations**:
  - ✅ Create Task
  - ✅ Read/Get All Tasks
  - ✅ Update Task
  - ✅ Delete Task
- **Task Fields**:
  - title
  - description
  - assignedTo (user reference)
  - deadline
  - status (not-started, in-progress, completed)
  - progress (0-100%)

### 3️⃣ Risk Calculation (AI Logic)
- Rule-based risk prediction algorithm
- Calculates risk score (0-100) based on:
  - Task progress
  - Deadline proximity
  - Task status
- **Risk Rules**:
  - Overdue tasks → Risk: 90
  - Low progress (<50%) + Near deadline (<3 days) → Risk: 75
  - Low progress (<30%) + Approaching deadline (<7 days) → Risk: 60
  - Moderate progress (30-50%) + Near deadline (<5 days) → Risk: 50
  - Good progress (>50%) but very near deadline (<2 days) → Risk: 40
  - Completed tasks → Risk: 0
  - Tasks on track → Risk: 20

### 4️⃣ Risk API
- **Endpoint**: `GET /api/risk/project`
- Returns:
  ```json
  {
    "overallRisk": 45,
    "highRiskTasks": [...],
    "message": "Early warning: project may be delayed"
  }
  ```

### 5️⃣ Dashboard API
- **Endpoint**: `GET /api/dashboard`
- Returns:
  ```json
  {
    "totalTasks": 5,
    "completedTasks": 1,
    "pendingTasks": 4,
    "overallProgress": 45,
    "upcomingDeadlines": [...],
    "riskScore": 45
  }
  ```

## 📁 Project Structure

```
Monitoring App/
├── backend/
│   ├── models/
│   │   ├── User.js          # User model
│   │   ├── Task.js          # Task model
│   │   └── RiskLog.js       # Risk log model (optional)
│   ├── controllers/
│   │   ├── taskController.js    # Task CRUD operations
│   │   ├── riskController.js    # Risk calculation
│   │   └── dashboardController.js # Dashboard stats
│   ├── routes/
│   │   ├── taskRoutes.js    # Task API routes
│   │   ├── riskRoutes.js    # Risk API routes
│   │   └── dashboardRoutes.js # Dashboard routes
│   ├── utils/
│   │   └── riskCalculator.js # Risk calculation logic
│   ├── scripts/
│   │   └── seedData.js      # Sample data seeding
│   ├── server.js            # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/
│   │   │   ├── Home.jsx     # Dashboard page
│   │   │   ├── Tasks.jsx    # Task management page
│   │   │   └── Risk.jsx     # Risk analysis page
│   │   ├── services/
│   │   │   └── api.js       # API service layer
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Installation Steps

#### 1. Clone or Navigate to Project Directory

```bash
cd "Monitoring App"
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example if available)
# Add your MongoDB connection string:
# MONGODB_URI=mongodb://localhost:27017/student-project-tracker
# PORT=5000

# Seed the database with sample data
npm run seed

# Start the backend server
npm start
# Or for development with auto-reload:
npm run dev
```

The backend server will run on `http://localhost:5000`

#### 3. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:3000`

### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 📝 API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a single task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Users
- `GET /api/users` - Get all users (for dropdown selection)
- `GET /api/users/:id` - Get a single user

### Risk
- `GET /api/risk/project` - Get overall project risk assessment

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

### Health Check
- `GET /api/health` - Check if server is running

## 🧪 Sample Data

The seed script creates:
- **3 Sample Users**:
  - John Doe (student)
  - Jane Smith (team-leader)
  - Bob Johnson (project-manager)
- **5 Sample Tasks** with different scenarios:
  - Overdue task
  - High-risk task (low progress + near deadline)
  - Medium-risk task
  - Low-risk task (good progress)
  - Not started task

## 💻 Usage

### Home Page (Dashboard)
- View total tasks, completed tasks, pending tasks
- See overall progress percentage
- Check risk score
- View upcoming deadlines (next 7 days)

### Tasks Page
- Create new tasks with form
- View all tasks in a list
- Update task status and progress inline
- Edit task details
- Delete tasks

### Risk Page
- View overall project risk score
- See high-risk tasks (risk score ≥ 60)
- Understand risk calculation rules
- Refresh risk data

## 🔧 Configuration

### MongoDB Connection

Update the `.env` file in the backend directory:

**Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/student-project-tracker
```

**MongoDB Atlas:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/student-project-tracker
```

### Port Configuration

- Backend: Port 5000 (default)
- Frontend: Port 3000 (default)

You can change these in:
- Backend: `.env` file or `server.js`
- Frontend: `vite.config.js`

## 📊 Example API Responses

### Get Dashboard
```json
{
  "success": true,
  "data": {
    "totalTasks": 5,
    "completedTasks": 1,
    "pendingTasks": 4,
    "overallProgress": 45,
    "upcomingDeadlines": [
      {
        "_id": "...",
        "title": "Design Database Schema",
        "deadline": "2024-01-15T00:00:00.000Z",
        "progress": 60,
        "assignedTo": {
          "name": "John Doe",
          "email": "john.doe@example.com"
        }
      }
    ],
    "riskScore": 45
  }
}
```

### Get Project Risk
```json
{
  "success": true,
  "data": {
    "overallRisk": 45,
    "highRiskTasks": [
      {
        "_id": "...",
        "title": "Implement User Authentication",
        "description": "Build login and registration system",
        "deadline": "2024-01-16T00:00:00.000Z",
        "status": "in-progress",
        "progress": 30,
        "riskScore": 75,
        "assignedTo": {
          "name": "Jane Smith",
          "email": "jane.smith@example.com"
        }
      }
    ],
    "message": "⚠️ Early Warning: Project may be delayed. Take action now."
  }
}
```

## 🐛 Troubleshooting

### Backend Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running locally, or
   - Check your MongoDB Atlas connection string
   - Verify network connectivity

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Or kill the process using port 5000

### Frontend Issues

1. **Cannot Connect to Backend**
   - Ensure backend server is running
   - Check `vite.config.js` proxy settings
   - Verify backend URL in `src/services/api.js`

2. **CORS Errors**
   - Backend should have CORS enabled (already configured)
   - Check if backend is running on correct port

## 📚 Code Comments

All code files include detailed comments explaining:
- What each function does
- How the risk calculation works
- API endpoint purposes
- Component functionality

## 🎓 Learning Resources

This project demonstrates:
- RESTful API design
- CRUD operations
- MongoDB/Mongoose usage
- React hooks (useState, useEffect)
- React Router
- TailwindCSS styling
- Risk calculation algorithms
- Full-stack integration

## 📄 License

This project is created for educational purposes.

## 🤝 Contributing

This is a learning project. Feel free to:
- Add authentication
- Improve risk calculation algorithm
- Add more features
- Enhance UI/UX

## 📞 Support

For issues or questions, check the code comments or review the API documentation above.

---

**Happy Coding! 🚀**

