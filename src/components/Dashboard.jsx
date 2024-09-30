import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClipboardDocumentListIcon, ChatBubbleLeftRightIcon, PencilSquareIcon, ChartBarIcon, ClipboardIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const bentoItems = [
    { title: 'Goals', icon: ClipboardDocumentListIcon, color: 'from-blue-500 to-ascend-blue', link: '/goals', description: 'Set and track your personal objectives' },
    { title: 'Community', icon: ChatBubbleLeftRightIcon, color: 'from-ascend-green to-green-600', link: '/community', description: 'Connect and share with like-minded individuals' },
    { title: 'Journal', icon: PencilSquareIcon, color: 'from-ascend-orange to-orange-600', link: '/journal', description: 'Record your thoughts and reflections' },
    { title: 'Stats', icon: ChartBarIcon, color: 'from-ascend-pink to-pink-600', link: '/stats', description: 'Visualize your progress and achievements' },
    { title: 'Task List', icon: ClipboardIcon, color: 'from-gray-700 to-ascend-black', link: '/tasklist', description: 'Manage your daily tasks and to-dos' },
    { title: 'Accountability Buddy', icon: ClipboardIcon, color: 'bg-ascend-black', link: '/dashboard', description: 'Coming soon...' },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
      />
      <div className="flex-1 overflow-auto bg-gray-200 p-8">
        <header className="bg-white shadow-md rounded-sm mb-8 px-6 py-4">
          <h1 className="text-3xl font-bold text-ascend-black">Welcome to Your Dashboard</h1>
          <p className="text-gray-600 mt-2">Here's an overview of your Ascend journey</p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bentoItems.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              whileTap={{ scale: 0.98 }}
              className={`bg-gradient-to-br ${item.color} rounded-xl shadow-lg overflow-hidden`}
            >
              <Link to={item.link} className="block p-6 h-full">
                <div className="flex flex-col items-center justify-center h-full">
                  <item.icon className="h-12 w-12 text-white mb-4" />
                  <h2 className="text-xl font-semibold text-white mb-2">{item.title}</h2>
                  <p className="text-sm text-white text-center">{item.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}