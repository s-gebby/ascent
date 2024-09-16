import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { XMarkIcon, Bars3Icon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';export default function Sidebar({ isOpen, setIsOpen, setShowNewGoalForm }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDashboardExpanded, setIsDashboardExpanded] = useState(false);

  const handleLogout = () => {
    // Add logout logic
    navigate('/');
  };

  const toggleNestedList = () => {
    setIsDashboardExpanded(!isDashboardExpanded);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-4 right-4 p-2 bg-ascend-black text-white rounded md:hidden z-50"
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>
      <div className={`fixed inset-y-0 left-0 z-40 bg-ascend-black text-white w-64 min-h-screen p-4 
      md:relative md:translate-x-0
      transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      transition-transform duration-300 ease-in-out flex flex-col`}>
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-6">
          <Link to="/" className="text-2xl font-bold font-archivo flex">
            <span className="text-ascend-orange animate-color-change">A</span>
            <span className="text-ascend-pink animate-color-change">S</span>
            <span className="text-ascend-blue animate-color-change">C</span>
            <span className="text-ascend-green animate-color-change">E</span>
            <span className="text-ascend-white animate-color-change">N</span>
            <span className="text-ascend-black animate-color-change">D</span>
          </Link>
            <button onClick={() => setIsOpen(false)} className="text-white md:hidden">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav>
            <ul>
              <li className="mb-4">
                <div className="flex items-center justify-between py-2 px-4 hover:bg-ascend-blue rounded cursor-pointer text-sm">
                  <span onClick={handleDashboardClick}>Dashboard</span>
                  <button onClick={toggleNestedList} className="ml-2">
                    {isDashboardExpanded ? (
                      <ChevronUpIcon className="h-4 w-4" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {isDashboardExpanded && (
                  <ul className="ml-4 mt-2">
                    <li className="mb-2">
                      <Link to="/stats" className="block py-1 px-4 hover:bg-gray-700 rounded text-sm">Stats</Link>
                    </li>
                  </ul>
                )}
              </li>
              <li className="mb-4">
                <Link to="/journal" className="block py-2 px-4 hover:bg-ascend-blue rounded text-sm">Journal</Link>
              </li>
            </ul>
          </nav>
        </div>
        
        <div className="mt-auto">
          <Link to="/account" className="block w-full bg-ascend-blue text-white py-2 px-4 rounded hover:text-gray-300 transition duration-300 mb-2 text-center text-sm">
            Account
          </Link>
          
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-2 px-4 rounded hover:text-gray-300 transition duration-300 text-sm"
          >
            Log Out
          </button>
        </div>
      </div>
    </>
  );
}
