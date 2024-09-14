import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import AuthPage from './components/authorization/AuthPage';
import Company from './components/ui/Company';
import SignUp from './components/authorization/SignUp';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';
import Journal from './components/ui/Journal';
import { MantineProvider } from '@mantine/core';
import { motion } from 'framer-motion';


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
      // Introduce a delay before setting loading to false
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    });
  
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    // Fetch goals data here
    // When done, setUserGoals(fetchedGoals) and setLoading(false)
  }, []);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-ascend-black">
        <motion.div
          className="text-6xl font-bold font-archivo-black"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        >
          <span className="text-ascend-orange">A</span>
          <span className="text-ascend-pink">S</span>
          <span className="text-ascend-blue">C</span>
          <span className="text-ascend-green">E</span>
          <span className="text-ascend-white">N</span>
          <span className="text-ascend-orange">D</span>
        </motion.div>
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
      </Routes>
    </>
  );
}export default App;
