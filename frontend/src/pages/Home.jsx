// Premium Dashboard Page Component - Modern SaaS-style dashboard with charts and insights
import { useState, useEffect } from 'react';
import { getDashboard, getAllTasks } from '../services/api';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Home() {
  // State management
  const [dashboardData, setDashboardData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to safely get user name from assignedTo
  const getAssignedUserName = (assignedTo) => {
    if (assignedTo && typeof assignedTo === 'object' && assignedTo.name) {
      return assignedTo.name;
    }
    return 'Unknown';
  };

  // Fetch dashboard data and tasks when component mounts
  useEffect(() => {
    fetchDashboardData();
    fetchTasks();
  }, []);

  // Function to fetch dashboard statistics
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await getDashboard();
      setDashboardData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch all tasks for charts
  const fetchTasks = async () => {
    try {
      const response = await getAllTasks();
      setTasks(response.data || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  // Calculate task distribution for pie chart
  const getTaskDistribution = () => {
    if (!tasks || tasks.length === 0) return [];
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const notStarted = tasks.filter(t => t.status === 'not-started').length;
    
    return [
      { name: 'Completed', value: completed, color: '#10b981' },
      { name: 'In Progress', value: inProgress, color: '#3b82f6' },
      { name: 'Not Started', value: notStarted, color: '#f59e0b' }
    ];
  };

  // Generate progress chart data (last 7 days simulation)
  const getProgressChartData = () => {
    const data = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayTasks = tasks.filter(t => {
        const taskDate = new Date(t.createdAt || t.updatedAt || Date.now());
        return taskDate.toDateString() === date.toDateString();
      });
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        completed: dayTasks.filter(t => t.status === 'completed').length,
        pending: dayTasks.filter(t => t.status !== 'completed').length
      });
    }
    return data;
  };

  // Get urgency tag color based on deadline
  const getUrgencyColor = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const daysUntil = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 0) return 'bg-red-100 text-red-700 border-red-300';
    if (daysUntil <= 2) return 'bg-red-100 text-red-700 border-red-300';
    if (daysUntil <= 5) return 'bg-orange-100 text-orange-700 border-orange-300';
    return 'bg-green-100 text-green-700 border-green-300';
  };

  // Get urgency label
  const getUrgencyLabel = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const daysUntil = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 0) return 'Overdue';
    if (daysUntil <= 2) return 'Urgent';
    if (daysUntil <= 5) return 'Near';
    return 'Safe';
  };

  // Generate activity feed (mock data based on tasks)
  const getActivityFeed = () => {
    const activities = [];
    const recentTasks = [...tasks].sort((a, b) => 
      new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
    ).slice(0, 5);

    recentTasks.forEach(task => {
      const userName = getAssignedUserName(task.assignedTo);
      const date = new Date(task.updatedAt || task.createdAt);
      const timeAgo = Math.floor((Date.now() - date) / (1000 * 60));
      
      let activity = '';
      if (task.status === 'completed') {
        activity = `${userName} completed task "${task.title}"`;
      } else if (task.updatedAt && task.updatedAt !== task.createdAt) {
        activity = `Task "${task.title}" was updated`;
      } else {
        activity = `${userName} created task "${task.title}"`;
      }

      activities.push({
        id: task._id,
        text: activity,
        time: timeAgo < 60 ? `${timeAgo}m ago` : `${Math.floor(timeAgo / 60)}h ago`,
        icon: task.status === 'completed' ? '✅' : '📝'
      });
    });

    // Add risk recalculation activity
    if (dashboardData?.riskScore !== undefined) {
      activities.unshift({
        id: 'risk',
        text: 'Risk score recalculated',
        time: 'Just now',
        icon: '⚠️'
      });
    }

    return activities.slice(0, 6);
  };

  // Skeleton Loading Component
  const SkeletonCard = () => (
    <div className="bg-white/70 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20 animate-pulse">
      <div className="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
      <div className="h-8 bg-slate-200 rounded w-1/2"></div>
    </div>
  );

  // Loading State
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-8">
          <div className="h-10 bg-slate-200 rounded-xl w-64 animate-pulse"></div>
          <div className="h-10 w-32 bg-slate-200 rounded-xl animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-r-xl shadow-sm flex items-center gap-3">
        <span className="text-xl">⚠️</span>
        <span>{error}</span>
      </div>
    );
  }

  const taskDistribution = getTaskDistribution();
  const progressChartData = getProgressChartData();
  const activityFeed = getActivityFeed();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800 mb-2">Dashboard Overview</h2>
          <p className="text-slate-600">Monitor your project progress and stay on track</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/70 backdrop-blur-md rounded-xl px-4 py-2 shadow-md border border-white/20">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards - Premium Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Tasks Card */}
        <div className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer border border-blue-400/20">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <span className="text-3xl">📋</span>
            </div>
          </div>
          <p className="text-white/80 text-sm font-medium mb-1">Total Tasks</p>
          <p className="text-4xl font-bold text-white">{dashboardData?.totalTasks || 0}</p>
        </div>

        {/* Completed Tasks Card */}
        <div className="group bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer border border-green-400/20">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <span className="text-3xl">✅</span>
            </div>
          </div>
          <p className="text-white/80 text-sm font-medium mb-1">Completed</p>
          <p className="text-4xl font-bold text-white">{dashboardData?.completedTasks || 0}</p>
        </div>

        {/* Pending Tasks Card */}
        <div className="group bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer border border-orange-400/20">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <span className="text-3xl">⏳</span>
            </div>
          </div>
          <p className="text-white/80 text-sm font-medium mb-1">Pending</p>
          <p className="text-4xl font-bold text-white">{dashboardData?.pendingTasks || 0}</p>
        </div>

        {/* Risk Score Card */}
        <div className={`group rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer border ${
          (dashboardData?.riskScore || 0) >= 70 
            ? 'bg-gradient-to-br from-red-500 to-red-600 border-red-400/20'
            : (dashboardData?.riskScore || 0) >= 50
            ? 'bg-gradient-to-br from-orange-500 to-orange-600 border-orange-400/20'
            : 'bg-gradient-to-br from-green-500 to-green-600 border-green-400/20'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <span className="text-3xl">⚠️</span>
            </div>
          </div>
          <p className="text-white/80 text-sm font-medium mb-1">Risk Score</p>
          <p className="text-4xl font-bold text-white">{dashboardData?.riskScore || 0}</p>
        </div>
      </div>

      {/* Charts Section - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Chart - Glassmorphism Card */}
        <div className="bg-white/70 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">Progress Trend</h3>
              <p className="text-sm text-slate-600">Last 7 days activity</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <span className="text-2xl">📈</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={progressChartData}>
              <defs>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '8px 12px'
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="completed" stroke="#10b981" fillOpacity={1} fill="url(#colorCompleted)" name="Completed" />
              <Area type="monotone" dataKey="pending" stroke="#f59e0b" fillOpacity={1} fill="url(#colorPending)" name="Pending" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Task Distribution Pie Chart */}
        <div className="bg-white/70 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">Task Distribution</h3>
              <p className="text-sm text-slate-600">Status breakdown</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-lg">
              <span className="text-2xl">🥧</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={taskDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {taskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '8px 12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            {taskDistribution.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-slate-600">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines - Modern Timeline */}
        <div className="bg-white/70 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">⏰ Upcoming Deadlines</h3>
              <p className="text-sm text-slate-600">Next 7 days</p>
            </div>
          </div>
          {dashboardData?.upcomingDeadlines && dashboardData.upcomingDeadlines.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.upcomingDeadlines.map((task, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-white border border-slate-200 hover:border-blue-300 transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-semibold text-slate-800 truncate">{task.title}</h4>
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold border ${getUrgencyColor(task.deadline)} whitespace-nowrap`}>
                        {getUrgencyLabel(task.deadline)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">
                      📅 {new Date(task.deadline).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>👤 {getAssignedUserName(task.assignedTo)}</span>
                      <span>📊 {task.progress}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">🎉</div>
              <p className="text-slate-600 font-medium">No upcoming deadlines!</p>
              <p className="text-sm text-slate-500 mt-1">You're all caught up</p>
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="bg-white/70 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">📝 Recent Activity</h3>
              <p className="text-sm text-slate-600">Latest updates</p>
            </div>
          </div>
          {activityFeed.length > 0 ? (
            <div className="space-y-4">
              {activityFeed.map((activity, index) => (
                <div
                  key={activity.id || index}
                  className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-white border border-slate-200 hover:border-blue-300 transition-all duration-200"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-lg">
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">{activity.text}</p>
                    <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">📭</div>
              <p className="text-slate-600 font-medium">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
