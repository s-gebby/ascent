import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import AuthPage from './components/authorization/AuthPage';
import Company from './components/Company';
import SignUp from './components/authorization/SignUp';


function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <>
      {location.pathname === '/' && <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/company" element={<Company />} />
        <Route path="/signup" element={<SignUp />} />

      </Routes>
    </>
  );
}

export default App;