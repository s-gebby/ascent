import React from 'react';
import { Link } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, setIsOpen, setShowNewGoalForm }) => {
  return (
    <div className={`fixed inset-y-0 left-0 z-50 bg-gray-800 text-white w-64 min-h-screen p-4 
                    md:relative md:translate-x-0
                    transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                    transition-transform duration-300 ease-in-out`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">ASCEND</h2>
        <button onClick={() => setIsOpen(false)} className="text-white md:hidden">
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
      <nav>
        <ul>
          <li className="mb-4">
            <Link to="/dashboard" className="block py-2 px-4 hover:bg-gray-700 rounded">Dashboard</Link>
          </li>
          <li className="mb-4">
            <Link to="/timeline" className="block py-2 px-4 hover:bg-gray-700 rounded">Timeline</Link>
          </li>
          <li className="mb-4">
            <Link to="/calendar" className="block py-2 px-4 hover:bg-gray-700 rounded">Calendar</Link>
          </li>
          <li className="mb-4">
            <Link to="/journal" className="block py-2 px-4 hover:bg-gray-700 rounded">Journal</Link>
          </li>
        </ul>
      </nav>
      <button
        onClick={() => setShowNewGoalForm(true)}
        className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300"
      >
        Create Goal
      </button>
    </div>
  );
};

export default Sidebar;