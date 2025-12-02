// Tasks Page Component - Handles task CRUD operations
import { useState, useEffect } from 'react';
import { getAllTasks, createTask, updateTask, deleteTask, getAllUsers } from '../services/api';

function Tasks() {
  // State management
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]); // Store users for dropdown
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Form state for creating/editing tasks
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '', // In real app, this would be a user ID from a dropdown
    deadline: '',
    status: 'not-started',
    progress: 0
  });

  // Fetch all tasks and users when component mounts
  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  // Function to fetch all users from API
  const fetchUsers = async () => {
    try {
      console.log('🔄 Fetching users from API...');
      const response = await getAllUsers();
      const usersList = response.data || [];
      
      console.log('✅ Users loaded:', usersList);
      console.log(`📊 Total users received: ${usersList.length}`);
      
      if (usersList.length === 0) {
        console.warn('⚠️ No users found in database!');
        console.warn('💡 Solution: Run "npm run seed" in the backend directory');
        setError('No users available. Please run "npm run seed" in the backend directory to create sample users.');
      } else {
        // Clear error if users are loaded successfully
        if (error && error.includes('No users available')) {
          setError(null);
        }
        console.log('✅ Users successfully loaded for dropdown');
      }
      
      setUsers(usersList);
    } catch (err) {
      console.error('❌ Error fetching users:', err);
      console.error('Error details:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || err.message || 'Unknown error';
      setError(`Failed to load users: ${errorMessage}. Please check your backend connection.`);
      setUsers([]); // Set empty array on error
    }
  };

  // Helper function to safely get user name from assignedTo
  // Handles both cases: when assignedTo is an ID string or a populated user object
  const getAssignedUserName = (assignedTo, usersList = users) => {
    // If assignedTo is a populated object with name property
    if (assignedTo && typeof assignedTo === 'object' && assignedTo.name) {
      return assignedTo.name;
    }
    // If assignedTo is an ID string, find the user in the users list
    if (assignedTo && typeof assignedTo === 'string') {
      const user = usersList.find(u => u._id === assignedTo);
      return user ? user.name : 'Unknown';
    }
    // Fallback
    return 'Unknown';
  };

  // Helper function to safely get user ID from assignedTo
  // Handles both cases: when assignedTo is an ID string or a populated user object
  const getAssignedUserId = (assignedTo) => {
    // If assignedTo is a populated object with _id property
    if (assignedTo && typeof assignedTo === 'object' && assignedTo._id) {
      return assignedTo._id;
    }
    // If assignedTo is already an ID string
    if (assignedTo && typeof assignedTo === 'string') {
      return assignedTo;
    }
    // Fallback
    return '';
  };

  // Function to fetch all tasks from API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await getAllTasks();
      setTasks(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'progress' ? parseInt(value) || 0 : value
    });
  };

  // Function to handle form submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure assignedTo is always sent as a user ID (not a populated object)
      const assignedToId = formData.assignedTo;
      
      console.log('Form submission - assignedTo value:', assignedToId);
      console.log('Available users:', users);
      
      if (!assignedToId) {
        setError('Please select a user to assign the task to');
        return;
      }

      // Validate that the selected user exists
      const selectedUser = users.find(u => u._id === assignedToId);
      if (!selectedUser) {
        setError('Selected user not found. Please refresh and try again.');
        console.error('Selected user ID not found in users list:', assignedToId);
        return;
      }

      // Prepare task data with only the user ID (normalize to ensure it's a string)
      const taskData = {
        title: formData.title,
        description: formData.description,
        assignedTo: String(assignedToId), // Ensure it's a string, not an object
        deadline: formData.deadline,
        status: formData.status,
        progress: formData.progress
      };

      console.log('Submitting task data:', taskData);

      if (editingTask) {
        // Update existing task - ensure we only send the ID
        await updateTask(editingTask._id, taskData);
      } else {
        // Create new task
        await createTask(taskData);
      }
      // Reset form and refresh tasks
      resetForm();
      fetchTasks();
    } catch (err) {
      setError('Failed to save task: ' + (err.response?.data?.message || err.message));
      console.error('Task submission error:', err);
    }
  };

  // Function to handle task deletion
  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        fetchTasks();
      } catch (err) {
        setError('Failed to delete task');
        console.error(err);
      }
    }
  };

  // Function to start editing a task
  const handleEdit = (task) => {
    setEditingTask(task);
    // Safely extract user ID whether assignedTo is populated object or ID string
    const assignedToId = getAssignedUserId(task.assignedTo);
    
    console.log('Editing task:', task);
    console.log('Extracted assignedTo ID:', assignedToId);
    console.log('Available users for dropdown:', users);
    
    setFormData({
      title: task.title,
      description: task.description || '',
      assignedTo: String(assignedToId), // Normalize to string, ensure it's not an object
      deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '',
      status: task.status,
      progress: task.progress
    });
    setShowForm(true);
  };

  // Function to reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      assignedTo: '',
      deadline: '',
      status: 'not-started',
      progress: 0
    });
    setEditingTask(null);
    setShowForm(false);
  };

  // Function to update task status quickly
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      fetchTasks();
    } catch (err) {
      setError('Failed to update task status');
      console.error(err);
    }
  };

  // Function to update task progress quickly
  const handleProgressChange = async (taskId, newProgress) => {
    try {
      await updateTask(taskId, { progress: parseInt(newProgress) });
      fetchTasks();
    } catch (err) {
      setError('Failed to update task progress');
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800 mb-2">Task Management</h2>
          <p className="text-slate-600">Create, update, and manage your project tasks</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold flex items-center gap-2"
        >
          {showForm ? (
            <>
              <span>✕</span> Cancel
            </>
          ) : (
            <>
              <span>+</span> Add New Task
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-r-xl mb-6 shadow-sm flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Task Form - Modern Two-Column Layout */}
      {showForm && (
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-8 border border-slate-100">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-800 mb-1">
              {editingTask ? '✏️ Edit Task' : '✨ Create New Task'}
            </h3>
            <p className="text-slate-500 text-sm">Fill in the details below to {editingTask ? 'update' : 'create'} your task</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Title (Full Width) */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <span>📝</span> Task Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Enter task title..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-slate-700 placeholder-slate-400"
              />
            </div>

            {/* Row 2: Description (Full Width) */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <span>📄</span> Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter task description..."
                rows="3"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-slate-700 placeholder-slate-400 resize-none"
              />
            </div>

            {/* Row 3: Two-Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Assign To */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <span>👤</span> Assign To
                </label>
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleInputChange}
                  required
                  disabled={users.length === 0}
                  className={`w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-slate-700 bg-white cursor-pointer ${
                    users.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <option value="">
                    {users.length > 0 ? 'Select a user...' : 'No users available'}
                  </option>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name} — {user.role}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>Run "npm run seed" in backend</option>
                  )}
                </select>
                {users.length === 0 && (
                  <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800 font-semibold mb-1">⚠️ No users found in database</p>
                    <p className="text-xs text-yellow-700">
                      To fix this, run: <code className="bg-yellow-100 px-2 py-1 rounded">npm run seed</code> in the backend directory
                    </p>
                  </div>
                )}
              </div>

              {/* Deadline */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <span>📅</span> Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-slate-700 cursor-pointer"
                />
              </div>
            </div>

            {/* Row 4: Two-Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <span>📊</span> Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-slate-700 bg-white cursor-pointer"
                >
                  <option value="not-started">⏸️ Not Started</option>
                  <option value="in-progress">🔄 In Progress</option>
                  <option value="completed">✅ Completed</option>
                </select>
              </div>

              {/* Progress */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <span>📈</span> Progress: <span className="text-blue-600 font-bold">{formData.progress}%</span>
                </label>
                <div className="relative">
                  <input
                    type="range"
                    name="progress"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={handleInputChange}
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${formData.progress}%, #e2e8f0 ${formData.progress}%, #e2e8f0 100%)`
                    }}
                  />
                  <style>{`
                    .slider::-webkit-slider-thumb {
                      appearance: none;
                      width: 20px;
                      height: 20px;
                      border-radius: 50%;
                      background: #3b82f6;
                      cursor: pointer;
                      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                      transition: all 0.2s;
                    }
                    .slider::-webkit-slider-thumb:hover {
                      transform: scale(1.1);
                      box-shadow: 0 4px 8px rgba(59,130,246,0.4);
                    }
                    .slider::-moz-range-thumb {
                      width: 20px;
                      height: 20px;
                      border-radius: 50%;
                      background: #3b82f6;
                      cursor: pointer;
                      border: none;
                      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                      transition: all 0.2s;
                    }
                    .slider::-moz-range-thumb:hover {
                      transform: scale(1.1);
                      box-shadow: 0 4px 8px rgba(59,130,246,0.4);
                    }
                  `}</style>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-semibold flex items-center justify-center gap-2"
              >
                {editingTask ? (
                  <>
                    <span>💾</span> Update Task
                  </>
                ) : (
                  <>
                    <span>✨</span> Create Task
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 rounded-xl border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tasks List */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-slate-100">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-xl font-semibold text-slate-700 mb-2">No tasks found</p>
          <p className="text-slate-500">Create your first task to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {tasks.map((task) => {
            const statusColors = {
              'not-started': 'bg-slate-100 text-slate-700',
              'in-progress': 'bg-blue-100 text-blue-700',
              'completed': 'bg-green-100 text-green-700'
            };
            const statusIcons = {
              'not-started': '⏸️',
              'in-progress': '🔄',
              'completed': '✅'
            };
            
            return (
              <div 
                key={task._id} 
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 border border-slate-100"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Main Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">{task.title}</h3>
                        <p className="text-slate-600 mb-4">{task.description || 'No description provided'}</p>
                      </div>
                    </div>

                    {/* Task Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-slate-700">
                        <span className="text-lg">👤</span>
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Assigned To</p>
                          <p className="font-semibold">{getAssignedUserName(task.assignedTo)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <span className="text-lg">📅</span>
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Deadline</p>
                          <p className="font-semibold">{new Date(task.deadline).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{statusIcons[task.status]}</span>
                        <div className="flex-1">
                          <p className="text-xs text-slate-500 font-medium mb-1">Status</p>
                          <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                            className={`w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-sm font-semibold cursor-pointer ${statusColors[task.status]}`}
                          >
                            <option value="not-started">⏸️ Not Started</option>
                            <option value="in-progress">🔄 In Progress</option>
                            <option value="completed">✅ Completed</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📈</span>
                        <div className="flex-1">
                          <p className="text-xs text-slate-500 font-medium mb-1">Progress</p>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={task.progress}
                              onChange={(e) => handleProgressChange(task._id, e.target.value)}
                              className="w-16 px-2 py-1.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-sm font-semibold text-slate-700"
                            />
                            <span className="text-sm font-bold text-slate-600">%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-600">Task Progress</span>
                        <span className="text-xs font-bold text-slate-700">{task.progress}%</span>
                      </div>
                      <div className="bg-slate-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-3 rounded-full transition-all duration-300 ${
                            task.progress === 100
                              ? 'bg-gradient-to-r from-green-500 to-green-600'
                              : task.progress >= 50
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                              : 'bg-gradient-to-r from-orange-500 to-orange-600'
                          }`}
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex lg:flex-col gap-2 lg:min-w-[120px]">
                    <button
                      onClick={() => handleEdit(task)}
                      className="flex-1 lg:flex-none bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold text-sm flex items-center justify-center gap-2"
                    >
                      <span>✏️</span> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="flex-1 lg:flex-none bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold text-sm flex items-center justify-center gap-2"
                    >
                      <span>🗑️</span> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Tasks;

