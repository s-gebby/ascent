import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import AuthPage from './components/authorization/AuthPage';
import Company from './components/ui/Company';
import SignUp from './components/authorization/SignUp';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';
import Journal from './components/ui/Journal';
import Calendar from './components/ui/Calendar.jsx';
import { MantineProvider } from '@mantine/core';


function App() {
  return (
    <MantineProvider>
      <Router>
        <AppContent />
      </Router>
    </MantineProvider>
  );
}

function AppContent() {
  const [user, setUser] = useState(null);
  const [userGoals, setUserGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    // Fetch goals data here
    // When done, setUserGoals(fetchedGoals) and setLoading(false)
  }, []);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-5xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/company" element={<Company />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/journal" element={user ? <Journal /> : <Navigate to="/login" />} />
        <Route path="/calendar" element={user ? <Calendar /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
}export default App;
