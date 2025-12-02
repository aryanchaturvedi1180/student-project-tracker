// Main App Component - Sets up routing and navigation
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import Risk from './pages/Risk';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
        {/* Modern Navigation Bar with Gradient */}
        <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 text-white shadow-xl border-b border-blue-800/20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Student Project Tracker</h1>
                  <p className="text-xs text-blue-100">Early Risk Prediction System</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Navigation Links */}
                <Link 
                  to="/" 
                  className="px-5 py-2.5 rounded-xl hover:bg-white/20 transition-all duration-200 font-medium flex items-center gap-2 backdrop-blur-sm"
                >
                  <span>🏠</span> Home
                </Link>
                <Link 
                  to="/tasks" 
                  className="px-5 py-2.5 rounded-xl hover:bg-white/20 transition-all duration-200 font-medium flex items-center gap-2 backdrop-blur-sm"
                >
                  <span>📋</span> Tasks
                </Link>
                <Link 
                  to="/risk" 
                  className="px-5 py-2.5 rounded-xl hover:bg-white/20 transition-all duration-200 font-medium flex items-center gap-2 backdrop-blur-sm"
                >
                  <span>⚠️</span> Risk Analysis
                </Link>
                {/* User Avatar */}
                <div className="ml-4 pl-4 border-l border-white/20">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold cursor-pointer hover:bg-white/30 transition-all duration-200 border-2 border-white/30">
                    A
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <Routes>
            {/* Define routes for different pages */}
            <Route path="/" element={<Home />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/risk" element={<Risk />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-white text-center py-6 mt-12 border-t border-slate-700">
          <p className="text-slate-300">Student Project Tracker with Early Risk Prediction © 2024</p>
          <p className="text-slate-400 text-sm mt-1">Built with React, Node.js, and MongoDB</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;

