import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import Login from './pages/Login';
import MainBranchDashboard from './pages/MainBranchDashboard';
import BranchUserDashboard from './pages/BranchUserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TestAdmin from './pages/TestAdmin';
import CreateAnnualPlan from './pages/CreateAnnualPlan';
import ViewAnnualPlan from './pages/ViewAnnualPlan';
import SubmitReport from './pages/SubmitReport';
import BranchComparison from './pages/BranchComparison';
import CreateActions from './pages/CreateActions';
import ActionReports from './pages/ActionReports';
import SubmitActionReport from './pages/SubmitActionReport';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      const parsedUser = JSON.parse(userData);
      console.log('🔍 Loading user from localStorage:', parsedUser);
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    console.log('🔍 Login successful, user data:', userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <LanguageProvider>
      <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} 
        />
        
        <Route 
          path="/" 
          element={
            user ? (
              (() => {
                console.log('🔍 User role check:', { user, role: user.role, roleType: typeof user.role });
                alert(`Debug: User role is "${user.role}" (type: ${typeof user.role})`);
                if (user.role === 'admin') {
                  console.log('✅ Admin detected - redirecting to /admin');
                  alert('Admin detected! Redirecting to admin dashboard...');
                  return <Navigate to="/test-admin" replace />;
                } else if (user.role === 'main_branch') {
                  console.log('✅ Showing MainBranchDashboard');
                  return <MainBranchDashboard user={user} onLogout={handleLogout} />;
                } else {
                  console.log('✅ Showing BranchUserDashboard');
                  return <BranchUserDashboard user={user} onLogout={handleLogout} />;
                }
              })()
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        
        <Route 
          path="/admin" 
          element={user?.role === 'admin' ? <AdminDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" />} 
        />
        
        <Route 
          path="/test-admin" 
          element={user?.role === 'admin' ? <TestAdmin user={user} onLogout={handleLogout} /> : <Navigate to="/" />} 
        />
        
        <Route 
          path="/create-plan" 
          element={user?.role === 'main_branch' ? <CreateAnnualPlan user={user} onLogout={handleLogout} /> : <Navigate to="/" />} 
        />
        
        <Route 
          path="/plan/:id" 
          element={user ? <ViewAnnualPlan user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        
        <Route 
          path="/submit-report/:reportId" 
          element={user?.role === 'branch_user' ? <SubmitReport user={user} onLogout={handleLogout} /> : <Navigate to="/" />} 
        />
        
        <Route 
          path="/comparison/:planId" 
          element={user?.role === 'main_branch' ? <BranchComparison user={user} onLogout={handleLogout} /> : <Navigate to="/" />} 
        />
        
        <Route 
          path="/create-actions/:planId" 
          element={user?.role === 'main_branch' ? <CreateActions user={user} onLogout={handleLogout} /> : <Navigate to="/" />} 
        />
        
        <Route 
          path="/action-reports" 
          element={user?.role === 'branch_user' ? <ActionReports user={user} onLogout={handleLogout} /> : <Navigate to="/" />} 
        />
        
        <Route 
          path="/submit-action/:reportId" 
          element={user?.role === 'branch_user' ? <SubmitActionReport user={user} onLogout={handleLogout} /> : <Navigate to="/" />} 
        />
      </Routes>
    </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
