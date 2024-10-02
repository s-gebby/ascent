import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { getAuth } from 'firebase/auth';
import { readGoals } from '../utils/database';
import { BellIcon, UserCircleIcon, BookOpenIcon, UserGroupIcon, PencilSquareIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; 

export default function Dashboard() {
  const [totalGoals, setTotalGoals] = useState(0);
  const [user, setUser] = useState(null);
  const [goals, setGoals] = useState([])
  const auth = getAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);
  const handleJournalPromptClick = () => {
    navigate('/journal');
  };

  const [randomPrompt, setRandomPrompt] = useState('');

  useEffect(() => {
    setRandomPrompt(journalPrompts[Math.floor(Math.random() * journalPrompts.length)]);
  }, []);

  const journalPrompts = [
    "What's one small step you can take today towards your biggest goal?",
    "Reflect on a recent challenge you overcame. What did you learn?",
    "Describe your ideal day. How does it align with your current goals?",
    "What's a skill you'd like to develop this month? Why is it important to you?",
    "Write about a person who inspires you. How can you embody their qualities?",
    "What are three things you're grateful for today?",
    "If you could give advice to your younger self, what would it be?",
    "Describe a recent accomplishment. How did it make you feel?",
    "What's a fear you'd like to overcome? What's one step you can take towards facing it?",
    "Imagine your life in 5 years. What do you hope to have achieved?"
  ];
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchGoals(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchGoals = async () => {
      if (auth.currentUser) {
        const fetchedGoals = await readGoals(auth.currentUser.uid);
        setGoals(fetchedGoals ? Object.values(fetchedGoals) : []);
      }
    };
    fetchGoals();
  }, [auth.currentUser]);

  const fetchGoals = async (uid) => {
    const goals = await readGoals(uid);
    setTotalGoals(goals ? Object.keys(goals).length : 0);
  };
  {/* Placeholders for tableData */}
  const tableData = [
    { id: 1, goal: 'Learn React', progress: '75%', status: 'In Progress' },
    { id: 2, goal: 'Run a Marathon', progress: '30%', status: 'In Progress' },
    { id: 3, goal: 'Write a Book', progress: '100%', status: 'Completed' },
    { id: 4, goal: 'Travel to Japan', progress: '0%', status: 'Not Started' },
  ];

  return (
    <div className="flex h-screen bg-ascend-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10 p-4 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
          <div className="flex items-center space-x-4">
          {user && (
            <p className="text-xs font-bold text-ascend-black">
              Greetings, {user.displayName || 'Ascender'}!
            </p>
          )}
            {user && user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Profile" 
                className="h-8 w-8 rounded-full cursor-pointer"
                onClick={() => navigate('/account')}
              />
            ) : (
              <UserCircleIcon 
                className="h-8 w-8 text-gray-600 cursor-pointer" 
                onClick={() => navigate('/account')}
              />
            )}
            <BellIcon className="h-6 w-6 text-gray-600" />
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-ascend-white p-4">
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2 text-center">🚨Important🚨</h3>
              {user && (
                <p className="text-sm text-center m-4 font-bold text-ascend-black">
                  Hello, {user.displayName || 'Ascender'}!
                </p>
              )}
              <p className="mb-4 text-sm text-center">This application is currently under construction. Some features may not be fully functional.</p>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-ascend-blue text-xs text-white rounded hover:bg-ascend-blue-dark mx-auto block"
              >
                Understood
              </button>
            </div>
          </div>
        )}
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 ">
            {/* Current goals table */}
            <div className="lg:col-span-2 bg-white rounded-sm p-4 border border-gray-300">
              <h4 className="text-lg font-semibold mb-2">Current Goals</h4>
              <div className="overflow-x-auto max-h-64">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goal</th>
                      <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                      <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.goal}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.progress}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                            item.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:col-span-1 bg-white rounded-sm p-4 cursor-pointer border border-gray-300">
            <h4 className="text-lg font-semibold mb-2">Journal Prompt</h4>
            <div className="p-4 bg-ascend-blue-light rounded-md">
              <p className="text-sm text-ascend-blue" 
              onClick={handleJournalPromptClick}>
                "{randomPrompt}"
              </p>
            </div>
          </div>

            {/* Quick Links */}
            <div className="lg:col-span-2 bg-white rounded-sm shadow p-4 border border-gray-300">
              <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <Link to="/goals" className="flex items-center p-2 text-ascend-black">
                  <ChartBarIcon className="h-5 w-5 mr-2" />
                  <span>Goals</span>
                </Link>
                <Link to="/journal" className="flex items-center p-2 text-ascend-black">
                  <PencilSquareIcon className="h-5 w-5 mr-2" />
                  <span>Journal</span>
                </Link>
                <Link to="/community" className="flex items-center p-2 text-ascend-black">
                  <UserGroupIcon className="h-5 w-5 mr-2" />
                  <span>Community</span>
                </Link>
                <Link to="/resources" className="flex items-center p-2 text-ascend-black">
                  <BookOpenIcon className="h-5 w-5 mr-2" />
                  <span>Resources</span>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}