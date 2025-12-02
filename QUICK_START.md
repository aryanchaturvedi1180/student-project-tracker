# 🚀 Quick Start Guide

Follow these steps to get the Student Project Tracker running in 5 minutes!

## Step 1: Install MongoDB

**Option A: Local MongoDB**
- Download and install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
- Start MongoDB service

**Option B: MongoDB Atlas (Cloud - Recommended)**
- Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Create a free cluster
- Get your connection string

## Step 2: Setup Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
echo "MONGODB_URI=mongodb://localhost:27017/student-project-tracker" > .env
# OR for MongoDB Atlas:
# echo "MONGODB_URI=your-atlas-connection-string" > .env

# Seed database with sample data
npm run seed

# Start backend server
npm start
```

✅ Backend should be running on http://localhost:5000

## Step 3: Setup Frontend

Open a **new terminal window**:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start frontend server
npm run dev
```

✅ Frontend should be running on http://localhost:3000

## Step 4: Open in Browser

Visit: **http://localhost:3000**

You should see:
- ✅ Dashboard with statistics
- ✅ Tasks page with sample tasks
- ✅ Risk page showing risk analysis

## 🎉 You're Done!

The application is now running with:
- 3 sample users
- 5 sample tasks
- Risk calculations working
- All CRUD operations ready

## 🔧 Troubleshooting

**Backend won't start?**
- Check if MongoDB is running
- Verify .env file has correct MONGODB_URI
- Check if port 5000 is available

**Frontend won't connect?**
- Make sure backend is running first
- Check browser console for errors
- Verify proxy settings in vite.config.js

**No data showing?**
- Run `npm run seed` in backend folder
- Check MongoDB connection
- Verify database has data

## 📚 Next Steps

- Read the full README.md for detailed documentation
- Explore the code - everything is commented!
- Try creating, editing, and deleting tasks
- Check how risk scores change with different task states

Happy coding! 🎓


