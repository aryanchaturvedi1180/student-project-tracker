// Premium Risk Analysis Dashboard - Modern SaaS-style analytics page
import { useState, useEffect } from 'react';
import { getProjectRisk } from '../services/api';

function Risk() {
  // State management
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Helper function to safely get user name from assignedTo
  const getAssignedUserName = (assignedTo) => {
    if (assignedTo && typeof assignedTo === 'object' && assignedTo.name) {
      return assignedTo.name;
    }
    return 'Unknown';
  };

  // Fetch risk data when component mounts
  useEffect(() => {
    fetchRiskData();
  }, []);

  // Function to fetch risk assessment from API
  const fetchRiskData = async () => {
    try {
      setLoading(true);
      const response = await getProjectRisk();
      setRiskData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load risk data');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle refresh with animation
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRiskData();
  };

  // Get risk level configuration
  const getRiskConfig = (score) => {
    if (score >= 70) {
      return {
        label: 'Critical',
        color: 'purple',
        gradient: 'from-purple-500 to-purple-700',
        bgGradient: 'from-purple-50 to-purple-100',
        textColor: 'text-purple-700',
        borderColor: 'border-purple-300',
        gaugeColor: '#a855f7'
      };
    }
    if (score >= 50) {
      return {
        label: 'High',
        color: 'red',
        gradient: 'from-red-500 to-red-700',
        bgGradient: 'from-red-50 to-red-100',
        textColor: 'text-red-700',
        borderColor: 'border-red-300',
        gaugeColor: '#ef4444'
      };
    }
    if (score >= 30) {
      return {
        label: 'Medium',
        color: 'amber',
        gradient: 'from-amber-500 to-amber-700',
        bgGradient: 'from-amber-50 to-amber-100',
        textColor: 'text-amber-700',
        borderColor: 'border-amber-300',
        gaugeColor: '#f59e0b'
      };
    }
    return {
      label: 'Low',
      color: 'green',
      gradient: 'from-green-500 to-green-700',
      bgGradient: 'from-green-50 to-green-100',
      textColor: 'text-green-700',
      borderColor: 'border-green-300',
      gaugeColor: '#10b981'
    };
  };

  // Calculate risk category distribution
  const getRiskCategories = () => {
    if (!riskData?.highRiskTasks) return { low: 0, medium: 0, high: 0, critical: 0 };
    
    const tasks = riskData.highRiskTasks;
    return {
      low: tasks.filter(t => t.riskScore < 30).length,
      medium: tasks.filter(t => t.riskScore >= 30 && t.riskScore < 50).length,
      high: tasks.filter(t => t.riskScore >= 50 && t.riskScore < 70).length,
      critical: tasks.filter(t => t.riskScore >= 70).length
    };
  };

  // Circular Gauge Component
  const CircularGauge = ({ score, size = 280 }) => {
    const config = getRiskConfig(score);
    const radius = size / 2 - 20;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const strokeWidth = 24;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="none"
            className="opacity-30"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={config.gaugeColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${config.gaugeColor}40)`
            }}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-6xl font-bold ${config.textColor} mb-2`}>
            {score}
          </div>
          <div className={`text-xl font-semibold ${config.textColor}`}>
            {config.label} Risk
          </div>
        </div>
      </div>
    );
  };

  // Animated Progress Bar Component
  const AnimatedProgressBar = ({ label, value, max, color, gradient, delay = 0 }) => {
    const percentage = Math.min((value / max) * 100, 100);
    
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-slate-700">{label}</span>
          <span className="text-sm font-bold text-slate-600">{value}</span>
        </div>
        <div className="relative h-4 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-1000 ease-out`}
            style={{
              width: `${percentage}%`,
              transitionDelay: `${delay}ms`,
              boxShadow: `0 0 10px ${color}40`
            }}
          />
        </div>
      </div>
    );
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

  const riskScore = riskData?.overallRisk || 0;
  const config = getRiskConfig(riskScore);
  const categories = getRiskCategories();
  const totalHighRiskTasks = riskData?.highRiskTasks?.length || 0;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800 mb-2">Risk Analysis</h2>
          <p className="text-slate-600">Monitor project health and identify potential delays</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className={`bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold flex items-center gap-2 ${
            refreshing ? 'opacity-75 cursor-not-allowed' : 'hover:from-blue-700 hover:to-blue-800'
          }`}
        >
          <span className={`text-xl transition-transform duration-500 ${refreshing ? 'animate-spin' : ''}`}>
            🔄
          </span>
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Main Risk Gauge Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Circular Gauge Card */}
        <div className={`bg-gradient-to-br ${config.bgGradient} rounded-2xl p-8 shadow-xl border-2 ${config.borderColor} hover:shadow-2xl transition-all duration-300`}>
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Overall Project Risk</h3>
            <CircularGauge score={riskScore} size={280} />
            <div className="mt-6 text-center">
              <p className={`text-xl font-semibold ${config.textColor} mb-2`}>
                {riskData?.message || 'No risk data available'}
              </p>
              <p className="text-sm text-slate-600">
                Risk score ranges from 0 (no risk) to 100 (critical risk)
              </p>
            </div>
          </div>
        </div>

        {/* Risk Category Bars Card */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Risk Distribution</h3>
            <p className="text-sm text-slate-600">Breakdown by risk category</p>
          </div>
          <div className="space-y-4">
            <AnimatedProgressBar
              label="Low Risk (0-30)"
              value={categories.low}
              max={totalHighRiskTasks || 1}
              color="green"
              gradient="from-green-500 to-green-600"
              delay={0}
            />
            <AnimatedProgressBar
              label="Medium Risk (30-50)"
              value={categories.medium}
              max={totalHighRiskTasks || 1}
              color="amber"
              gradient="from-amber-500 to-amber-600"
              delay={200}
            />
            <AnimatedProgressBar
              label="High Risk (50-70)"
              value={categories.high}
              max={totalHighRiskTasks || 1}
              color="red"
              gradient="from-red-500 to-red-600"
              delay={400}
            />
            <AnimatedProgressBar
              label="Critical Risk (70-100)"
              value={categories.critical}
              max={totalHighRiskTasks || 1}
              color="purple"
              gradient="from-purple-500 to-purple-600"
              delay={600}
            />
          </div>
          {totalHighRiskTasks === 0 && (
            <div className="text-center py-8 text-slate-500">
              <div className="text-4xl mb-2">✅</div>
              <p className="font-medium">No high-risk tasks detected</p>
            </div>
          )}
        </div>
      </div>

      {/* High-Risk Tasks Section */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-1">
              ⚠️ High-Risk Tasks
            </h3>
            <p className="text-sm text-slate-600">
              {totalHighRiskTasks} task{totalHighRiskTasks !== 1 ? 's' : ''} requiring immediate attention
            </p>
          </div>
          <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${config.gradient} text-white font-bold shadow-lg`}>
            {totalHighRiskTasks}
          </div>
        </div>

        {riskData?.highRiskTasks && riskData.highRiskTasks.length > 0 ? (
          <div className="space-y-4">
            {riskData.highRiskTasks.map((task, index) => {
              const daysUntilDeadline = Math.ceil(
                (new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24)
              );
              const isOverdue = daysUntilDeadline < 0;
              const taskRiskConfig = getRiskConfig(task.riskScore);
              const statusColors = {
                'not-started': 'bg-slate-100 text-slate-700',
                'in-progress': 'bg-blue-100 text-blue-700',
                'completed': 'bg-green-100 text-green-700'
              };

              return (
                <div
                  key={index}
                  className={`bg-gradient-to-r from-white to-slate-50 rounded-xl p-6 border-2 ${taskRiskConfig.borderColor} hover:shadow-lg transition-all duration-200 hover:scale-[1.01]`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Task Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-slate-800 mb-1">{task.title}</h4>
                          <p className="text-slate-600 text-sm mb-3">{task.description || 'No description'}</p>
                        </div>
                        {/* Risk Score Badge */}
                        <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${taskRiskConfig.gradient} text-white font-bold shadow-md min-w-[80px] text-center`}>
                          <div className="text-2xl">{task.riskScore}</div>
                          <div className="text-xs opacity-90">Risk</div>
                        </div>
                      </div>

                      {/* Task Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">👤</span>
                          <div>
                            <p className="text-xs text-slate-500">Assigned</p>
                            <p className="text-sm font-semibold text-slate-700">{getAssignedUserName(task.assignedTo)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">📅</span>
                          <div>
                            <p className="text-xs text-slate-500">Deadline</p>
                            <p className={`text-sm font-semibold ${isOverdue ? 'text-red-600' : 'text-slate-700'}`}>
                              {new Date(task.deadline).toLocaleDateString()}
                              {isOverdue && ' ⚠️'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">📊</span>
                          <div>
                            <p className="text-xs text-slate-500">Progress</p>
                            <p className="text-sm font-semibold text-slate-700">{task.progress}%</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">📈</span>
                          <div>
                            <p className="text-xs text-slate-500">Status</p>
                            <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${statusColors[task.status] || 'bg-slate-100 text-slate-700'}`}>
                              {task.status.replace('-', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-500">Task Progress</span>
                          <span className="text-xs font-semibold text-slate-700">{task.progress}%</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${taskRiskConfig.gradient} rounded-full transition-all duration-500`}
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-xl font-semibold text-slate-700 mb-2">No high-risk tasks found!</p>
            <p className="text-slate-600">All tasks are on track. Great work! 🚀</p>
          </div>
        )}
      </div>

      {/* Risk Calculation Info Card - Notion Style */}
      <div className={`bg-gradient-to-br ${config.bgGradient} border-2 ${config.borderColor} rounded-2xl p-6 shadow-lg`}>
        <div className="flex items-start gap-4">
          <div className={`bg-white/50 backdrop-blur-sm p-3 rounded-xl ${config.textColor} text-2xl`}>
            📊
          </div>
          <div className="flex-1">
            <h4 className={`text-xl font-bold ${config.textColor} mb-4`}>
              How Risk is Calculated
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className={`bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/40`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-red-600 font-bold">90</span>
                  <span className="text-sm font-semibold text-slate-700">Overdue tasks</span>
                </div>
              </div>
              <div className={`bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/40`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-red-600 font-bold">75</span>
                  <span className="text-sm font-semibold text-slate-700">Low progress (&lt;50%) + Near deadline (&lt;3 days)</span>
                </div>
              </div>
              <div className={`bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/40`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-amber-600 font-bold">60</span>
                  <span className="text-sm font-semibold text-slate-700">Low progress (&lt;30%) + Approaching deadline (&lt;7 days)</span>
                </div>
              </div>
              <div className={`bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/40`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-amber-600 font-bold">50</span>
                  <span className="text-sm font-semibold text-slate-700">Moderate progress (30-50%) + Near deadline (&lt;5 days)</span>
                </div>
              </div>
              <div className={`bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/40`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-blue-600 font-bold">40</span>
                  <span className="text-sm font-semibold text-slate-700">Good progress (&gt;50%) but very near deadline (&lt;2 days)</span>
                </div>
              </div>
              <div className={`bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/40`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-green-600 font-bold">0</span>
                  <span className="text-sm font-semibold text-slate-700">Completed tasks</span>
                </div>
              </div>
              <div className={`bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/40`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-green-600 font-bold">20</span>
                  <span className="text-sm font-semibold text-slate-700">Tasks on track</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Risk;
