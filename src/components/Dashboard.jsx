import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { getAuth } from 'firebase/auth';
import { readGoals, getRecentPosts } from '../utils/database';
import { BellIcon, UserCircleIcon, BookOpenIcon, PencilSquareIcon, ClipboardDocumentListIcon, UserGroupIcon, VideoCameraIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Checkbox } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import MotivationalVideo from './MotivationalVideo';
import { readTasks, updateTask } from '../utils/database';


export default function Dashboard() {
  const [totalGoals, setTotalGoals] = useState(0);
  const [user, setUser] = useState(null);
  const [goals, setGoals] = useState([])
  const [recentPosts, setRecentPosts] = useState([]);
  const auth = getAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);{/* Switch to "true" to show under construction modal on login */}
  const handleJournalPromptClick = () => {
    navigate('/journal');
  };
  const [tasks, setTasks] = useState([]);
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

    const fetchRecentPosts = async () => {
      const posts = await getRecentPosts();
      setRecentPosts(posts);
    };

    fetchRecentPosts();

    return () => unsubscribe();
  }, []);

  const fetchTasks = async () => {
    if (auth.currentUser) {
      const fetchedTasks = await readTasks(auth.currentUser.uid);
      if (fetchedTasks) {
        setTasks(Object.entries(fetchedTasks).map(([id, task]) => ({ id, ...task })));
      }
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchGoals(user.uid);
        fetchTasks();
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

  const handleToggleTask = async (taskId) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    if (auth.currentUser) {
      await updateTask(auth.currentUser.uid, taskId, { completed: !tasks.find(t => t.id === taskId).completed });
    }
  };

  return (
    <div className="flex h-screen bg-ascend-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10 p-4 flex flex-col sm:flex-row justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2 sm:mb-0">Dashboard</h2>
          <div className="flex items-center space-x-4">
          {user && (
            <p className="text-xs font-bold text-ascend-black">
              Welcome, {user.displayName || 'Goal Ascender'}!
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
        
        {/* Under Construction Modal */}
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Current goals table */}
            <div className="lg:col-span-2 md:col-span-1 bg-white rounded-sm p-4 border border-gray-300">
              <h4 className="text-lg text-ascend-black mb-4 flex items-center">
                <ClipboardDocumentListIcon className="w-6 h-6 mr-2 text-ascend-black" />
                Current Goals
              </h4>
              <div className="overflow-x-auto max-h-64">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b pb-1">Goal</th>
                      <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b pb-1">Progress</th>
                      <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b pb-1">Status</th>
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


            {/* Recent Posts */}
            <div className="lg:col-span-1 md:col-span-1 bg-white rounded-sm p-4 border border-gray-300">
              <h4 className="text-lg text-ascend-black mb-4 flex items-center">
                <UserGroupIcon className="w-6 h-6 mr-2 text-ascend-black" />
                Recent Posts
              </h4>
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div key={post.id} className="border-b pb-2">
                    <div className="flex items-center mb-1">
                      <img 
                        src={post.authorPhotoURL || ' https://t3.ftcdn.net/jpg/06/33/54/78/360_F_633547842_AugYzexTpMJ9z1YcpTKUBoqBF0CUCk10.jpg'} 
                        alt={post.authorName} 
                        className="w-6 h-6 rounded-full mr-2"
                      />
                      <p className="font-semibold">{post.authorName}</p>
                    </div>
                    <p className="text-sm text-gray-600">
                      {post.content.length > 50 ? post.content.substring(0, 50) + '...' : post.content}
                    </p>
                    <p className="text-xs text-gray-400">{new Date(post.timestamp).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Prompt */}
            <div className="lg:col-span-1 md:col-span-1 rounded-sm p-4 border border-gray-300 transition-all duration-300 hover:shadow-md">
              <h4 className="text-base sm:text-lg text-ascend-black mb-2 sm:mb-4 flex items-center">
                <BookOpenIcon className="w-6 h-6 mr-2 text-ascend-black" />
                Daily Prompt
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-4">Reflect on your journey and learn from your experiences:</p>
              <div className="bg-white p-6 rounded-md shadow-sm">
                <p className="text-sm text-ascend-black italic leading-relaxed">
                  "{randomPrompt}"
                </p>
              </div>
              <button 
                onClick={handleJournalPromptClick}
                className="mt-4 sm:mt-6 w-full bg-ascend-black text-white py-1 sm:py-2 px-2 sm:px-4 rounded-md text-xs sm:text-sm flex items-center justify-center"
              >
                <PencilSquareIcon className="w-5 h-5 mr-2" />
                Start Writing
              </button>
            </div>
            
            {/* Recent Tasks */}
            <div className="lg:col-span-2 md:col-span-1 bg-white rounded-sm p-4 border border-gray-300 shadow-md">
              <h4 className="text-lg text-ascend-black mb-4 flex items-center">
                <ClipboardDocumentListIcon className="w-6 h-6 mr-2 text-ascend-black" />
                Recent Tasks
              </h4>
              <div className="overflow-y-auto max-h-64">
                {tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center justify-between py-2 border-b">
                    <div className="flex items-center">
                      <Checkbox
                        checked={task.completed}
                        onChange={() => handleToggleTask(task.id)}
                        className="mr-2"
                      />
                      <span className={task.completed ? 'line-through text-gray-500' : ''}>
                        {task.text}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('/tasklist')}
                className="mt-4 w-full bg-ascend-black text-white py-2 px-4 rounded-md text-sm flex items-center justify-center"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                View All Tasks
              </button>
            </div>

            {/* Motivational Video */}
            <div className="lg:col-span-2 md:col-span-2 bg-white rounded-sm p-4 border border-gray-300 shadow-md">
              <h4 className="text-lg text-ascend-black mb-4 flex items-center">
                <VideoCameraIcon className="w-8 h-8 mr-3 text-ascend-black" />
                Daily Inspiration
              </h4>
              <div>
                <MotivationalVideo />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
