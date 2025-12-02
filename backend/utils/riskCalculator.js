// Risk Calculator - Simple rule-based AI logic for early risk prediction
// This function calculates risk score based on task progress and deadline proximity

/**
 * Calculate risk score for a single task
 * @param {Object} task - Task object with deadline, progress, and status
 * @returns {Number} Risk score from 0-100 (higher = more risk)
 */
function calculateTaskRisk(task) {
  const now = new Date();
  const deadline = new Date(task.deadline);
  const daysUntilDeadline = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24)); // Convert to days
  
  // Rule 1: If task is overdue (deadline has passed) → very high risk
  if (daysUntilDeadline < 0) {
    return 90; // Very high risk for overdue tasks
  }
  
  // Rule 2: If task is completed → no risk
  if (task.status === 'completed' || task.progress === 100) {
    return 0; // No risk for completed tasks
  }
  
  // Rule 3: If progress is low (<50%) AND deadline is very near (<3 days) → high risk
  if (task.progress < 50 && daysUntilDeadline < 3) {
    return 75; // High risk for low progress + near deadline
  }
  
  // Rule 4: If progress is low (<30%) AND deadline is approaching (<7 days) → medium-high risk
  if (task.progress < 30 && daysUntilDeadline < 7) {
    return 60; // Medium-high risk
  }
  
  // Rule 5: If progress is moderate (30-50%) AND deadline is near (<5 days) → medium risk
  if (task.progress >= 30 && task.progress < 50 && daysUntilDeadline < 5) {
    return 50; // Medium risk
  }
  
  // Rule 6: If progress is good (>50%) but deadline is very near (<2 days) → medium risk
  if (task.progress >= 50 && daysUntilDeadline < 2) {
    return 40; // Medium risk even with good progress if deadline is very close
  }
  
  // Rule 7: Default low risk for tasks that don't match above conditions
  return 20; // Low risk for tasks on track
}

/**
 * Calculate overall project risk based on all tasks
 * @param {Array} tasks - Array of all tasks
 * @returns {Object} Object containing overall risk, high risk tasks, and message
 */
function calculateProjectRisk(tasks) {
  // If no tasks, return low risk
  if (!tasks || tasks.length === 0) {
    return {
      overallRisk: 0,
      highRiskTasks: [],
      message: 'No tasks found'
    };
  }
  
  // Calculate risk for each task
  const tasksWithRisk = tasks.map(task => ({
    ...task.toObject(), // Convert mongoose document to plain object
    riskScore: calculateTaskRisk(task)
  }));
  
  // Calculate overall risk as average of all task risks
  const totalRisk = tasksWithRisk.reduce((sum, task) => sum + task.riskScore, 0);
  const overallRisk = Math.round(totalRisk / tasksWithRisk.length);
  
  // Find high-risk tasks (risk score >= 60)
  const highRiskTasks = tasksWithRisk
    .filter(task => task.riskScore >= 60)
    .sort((a, b) => b.riskScore - a.riskScore); // Sort by risk score (highest first)
  
  // Generate warning message based on overall risk
  let message = '';
  if (overallRisk >= 70) {
    message = '⚠️ Critical Warning: Project is at high risk of delay!';
  } else if (overallRisk >= 50) {
    message = '⚠️ Early Warning: Project may be delayed. Take action now.';
  } else if (overallRisk >= 30) {
    message = '⚠️ Moderate Risk: Monitor tasks closely.';
  } else {
    message = '✅ Project is on track.';
  }
  
  return {
    overallRisk,
    highRiskTasks,
    message
  };
}

// Export functions so they can be used in other files
module.exports = {
  calculateTaskRisk,
  calculateProjectRisk
};


