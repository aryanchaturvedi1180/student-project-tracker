// Seed Data Script - Populates database with sample users and tasks for testing
const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Task = require('../models/Task');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-project-tracker';

/**
 * Seed the database with sample data
 * Creates users and tasks with different deadlines and progress values
 * If users already exist, it will skip creating duplicates
 */
async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB for seeding');

    // Check if users already exist
    const existingUsers = await User.find();
    if (existingUsers.length > 0) {
      console.log(`⚠️  Found ${existingUsers.length} existing users in database.`);
      console.log('   To re-seed, delete existing users first or use --force flag');
      console.log('\n📊 Existing Users:');
      existingUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name} (${user.email}) - ${user.role}`);
      });
      
      // Ask if user wants to continue (in non-interactive mode, just skip)
      const forceReseed = process.argv.includes('--force');
      if (!forceReseed) {
        console.log('\n✅ Skipping user creation. Use --force to re-seed.');
        await mongoose.connection.close();
        process.exit(0);
      } else {
        console.log('\n🔄 Force flag detected. Clearing existing data...');
        await User.deleteMany({});
        await Task.deleteMany({});
        console.log('🗑️  Cleared existing data');
      }
    } else {
      console.log('📝 No existing users found. Creating new users...');
    }

    // Create sample users (including Aryan as requested)
    const usersToCreate = [
      {
        name: 'Aryan Chaturvedi',
        email: 'aryan.chaturvedi@example.com',
        role: 'student'
      },
      {
        name: 'Shivani',
        email: 'shivani.tiwari@example.com',
        role: 'team-leader'
      },
      {
        name: 'Indresh',
        email: 'indresh.upadhyay@example.com',
        role: 'project-manager'
      },
      {
        name: 'Abhishek',
        email: 'abhishek@example.com',
        role: 'student'
      }
    ];

    const users = await User.insertMany(usersToCreate);
    console.log(`✅ Created ${users.length} sample users:`);
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name} (${user.email}) - ${user.role}`);
    });

    // Get user IDs for task assignment
    const [john, jane, bob] = users;

    // Create dates for deadlines (some past, some future)
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1 day ago (overdue)
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 1 day from now
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days from now
    const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    const twoWeeksLater = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days from now

    // Create 5 sample tasks with different scenarios for risk calculation
    const tasks = await Task.insertMany([
      {
        title: 'Design Database Schema',
        description: 'Create ER diagram and design database tables',
        assignedTo: john._id,
        deadline: yesterday, // Overdue task - should have high risk
        status: 'in-progress',
        progress: 60
      },
      {
        title: 'Implement User Authentication',
        description: 'Build login and registration system',
        assignedTo: jane._id,
        deadline: tomorrow, // Very near deadline - should have high risk
        status: 'in-progress',
        progress: 30 // Low progress + near deadline = high risk
      },
      {
        title: 'Create API Endpoints',
        description: 'Develop REST API for task management',
        assignedTo: bob._id,
        deadline: threeDaysLater, // Near deadline
        status: 'in-progress',
        progress: 45 // Medium progress
      },
      {
        title: 'Write Unit Tests',
        description: 'Create test cases for all modules',
        assignedTo: john._id,
        deadline: oneWeekLater, // Moderate deadline
        status: 'in-progress',
        progress: 70 // Good progress
      },
      {
        title: 'Deploy Application',
        description: 'Deploy to production server',
        assignedTo: jane._id,
        deadline: twoWeeksLater, // Future deadline
        status: 'not-started',
        progress: 0 // Not started
      }
    ]);
    console.log('✅ Created 5 sample tasks');

    console.log('\n📊 Sample Data Summary:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Tasks: ${tasks.length}`);
    console.log('\n✅ Database seeded successfully!');
    console.log('\n💡 Next steps:');
    console.log('   1. Start your backend server: npm start');
    console.log('   2. Start your frontend: cd ../frontend && npm run dev');
    console.log('   3. Open http://localhost:3000 and check the "Assign To" dropdown');
    console.log('\n📝 Users are now available in the dropdown!');

    // Close connection
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    if (error.code === 11000) {
      console.error('   Duplicate key error - user with this email already exists');
    }
    if (error.name === 'ValidationError') {
      console.error('   Validation error:', error.message);
    }
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run seed function
seedData();

