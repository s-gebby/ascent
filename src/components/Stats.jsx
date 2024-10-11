import React, { useEffect, useRef, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import { ShareIcon, BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { getAuth } from 'firebase/auth';
import { readGoals, getCompletedGoals } from '../utils/database';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver'
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const timeFrames = [
  { label: '1 Month', days: 30 },
  { label: '3 Months', days: 90 },
  { label: '6 Months', days: 180 },
  { label: '1 Year', days: 365 },
  { label: 'All Time', days: Infinity },
];

const Stats = () => {
  const [stats, setStats] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const chartRef = useRef(null);
  const navigate = useNavigate();


  useEffect(() => {
    fetchStats();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      }
    });

    return () => {
      unsubscribe();
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  const fetchStats = async () => {
    if (auth.currentUser) {
      const activeGoals = await readGoals(auth.currentUser.uid);
      const completedGoals = await getCompletedGoals(auth.currentUser.uid);
      if (activeGoals || completedGoals) {
        const calculatedStats = calculateStats(activeGoals, completedGoals);
        setStats(calculatedStats);
      }
    }
  };

  const calculateStats = (activeGoals, completedGoals) => {
    const now = new Date();
    return timeFrames.reduce((acc, frame) => {
      const cutoffDate = frame.days === Infinity ? new Date(0) : new Date(now.getTime() - frame.days * 24 * 60 * 60 * 1000);
      
      const relevantCompletedGoals = Object.values(completedGoals || {}).filter(goal => {
        const completedDate = goal.completedAt ? new Date(goal.completedAt) : null;
        return completedDate && completedDate > cutoffDate;
      });

      acc[frame.label] = {
        completed: relevantCompletedGoals.length,
        inProgress: Object.values(activeGoals || {}).length,
        total: (Object.values(activeGoals || {}).length + Object.values(completedGoals || {}).length),
      };
      return acc;
    }, {});
  };

  const StatCard = ({ title, value, message, color }) => (
    <motion.div 
      className={`bg-${color} p-3 rounded-lg mb-6`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="font-semibold text-sm">{title}</p>
      <p className="text-xl">{value}</p>
      <p className="text-xs mt-1">{message}</p>
    </motion.div>
  );

  const Button = ({ onClick, icon: Icon, children, color = 'blue' }) => (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ascend-${color} hover:bg-ascend-${color}-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ascend-${color} transition-all duration-200`}
    >
      <Icon className="h-5 w-5 mr-2" aria-hidden="true" />
      {children}
    </button>
  );

  const ExportMenu = ({ onExport }) => (
    <Menu as="div" className="relative inline-block text-left z-50">
      <div>
        <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-ascend-blue rounded-md hover:bg-ascend-blue-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 ">
          <ArrowDownTrayIcon className="h-5 w-5 mr-2" aria-hidden="true" />
          Export
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-ascend-blue text-white' : 'text-gray-900'
                  } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                  onClick={() => onExport('csv')}
                >
                  CSV
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-ascend-blue text-white' : 'text-gray-900'
                  } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                  onClick={() => onExport('pdf')}
                >
                  PDF
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );

  const ActionButtons = ({ stats, timeFrame }) => {
    const handleShare = async () => {
      const shareData = {
        title: 'My Ascend Goal Progress',
        text: `In the last ${timeFrame}, I've completed ${stats.completed} goals out of ${stats.total} total goals!`,
        url: window.location.href
      };

      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    };

    const handleExport = (format) => {
      if (format === 'csv') {
        const csvContent = `Time Frame,Completed Goals,In Progress,Total Goals\n${timeFrame},${stats.completed},${stats.inProgress},${stats.total}`;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `goal_stats_${timeFrame.replace(' ', '_')}.csv`);
      } else if (format === 'pdf') {
        const doc = new jsPDF();
        doc.text(`Goal Statistics for ${timeFrame}`, 10, 10);
        doc.text(`Completed Goals: ${stats.completed}`, 10, 20);
        doc.text(`In Progress: ${stats.inProgress}`, 10, 30);
        doc.text(`Total Goals: ${stats.total}`, 10, 40);
        doc.save(`goal_stats_${timeFrame.replace(' ', '_')}.pdf`);
      }
    };

    return (
      <div className="flex justify-end items-center space-x-4 mt-">
        <Button onClick={handleShare} icon={ShareIcon} color="blue">
          Share Progress
        </Button>
        <ExportMenu onExport={handleExport} />
      </div>
    );
  };

  const data = {
    labels: timeFrames.map(frame => frame.label),
    datasets: [
      {
        label: 'Completed Goals',
        data: timeFrames.map(frame => stats[frame.label]?.completed || 0),
        backgroundColor: "#d63cab",
      },
      {
        label: 'In Progress Goals',
        data: timeFrames.map(frame => stats[frame.label]?.inProgress || 0),
        backgroundColor: "#e09016",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Goal Completion Over Time',
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
  };

  const [newsDropdownOpen, setNewsDropdownOpen] = useState(false);
  
  return (
    <div className="flex h-screen">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
      />
      <div className="flex-1 overflow-auto bg-ascend-white p-8">
      <header className="bg-white z-10 p-2 flex flex-col sm:flex-row justify-between items-center">
        <h2 className="text-3xl ml-2 font-semibold text-ascend-black">Dashboard</h2>
        <div className="flex items-center space-x-4">
        <div className="relative">
            <input
              type="text"
              placeholder="Find..."
              className="pl-8 pr-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ascend-green focus:border-transparent"
            />
            <svg
              className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div className="relative">
            <button
              className="flex items-center text-sm font-medium text-gray-600 hover:text-ascend-green focus:outline-none"
              onClick={() => setNewsDropdownOpen(!newsDropdownOpen)}
            >
              <span>News</span>
              <svg className="ml-1 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {newsDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-gray-300 border border-ascend-black rounded-md shadow-lg py-2 px-4 z-10">
                <h3 className="text-md mb-2 text-center">Latest Updates</h3>
                <p className="text-xs mb-2 text-center">Fixed the completion features when completing a goal!</p>
                <p className="text-xs mb-2 text-center">Questions? <a href="mailto:silasgebhart12@gmail.com" className="text-md font-bold text-ascend-blue hover:underline">
                  Email me!
                </a></p>
                
                
                <h3 className="text-md mb-2 text-center">Feature Announcement</h3>
                <p className="text-xs mb-2 text-center">Coming soon: Artificial Intelligence Accountability Buddy!</p>
                
                <h3 className="text-md mb-2 text-center">Community Highlight</h3>
                <p className="text-xs text-center">We'll be launching to the public here within a couple of days!</p>
              </div>
            )}
          </div>
          {user && (
            <p className="text-xs font-bold text-ascend-black">
              Welcome, {user.displayName || 'Goal Ascender'}!
            </p>
          )}
          {user && user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt="Profile" 
              className="h-8 w-8 mr-2 rounded-full cursor-pointer transition-all duration-300 hover:ring-2 hover:ring-ascend-green"
              onClick={() => navigate('/account')}
            />
          ) : (
            <UserCircleIcon 
              className="h-8 w-8 text-gray-600 cursor-pointer transition-all duration-300 hover:ring-2 hover:ring-ascend-green rounded-full" 
              onClick={() => navigate('/account')}
            />
          )}
          <BellIcon className="h-6 w-6 text-gray-600 duration-1000 mr-2"/>
          </div>
      </header>
        <div className="flex flex-col items-center text-center mb-8">
          <h2 className="text-2xl font-bold text-ascend-black font-archivo mb-4">
            Welcome to Your Performance Dashboard
          </h2>
          <p className="text-ascend-black font-archivo text-base mb-4">
            Track your progress, analyze your goals, and visualize your journey to success.
          </p>
          <p className="text-gray-600 font-archivo text-sm">
            Use the toggles below to explore your goal statistics across different time frames.Export your goal statistics in CSV or PDF format! Share your progress with others and stay motivated.
          </p>
        </div>
        <div className="space-y-4">
          {timeFrames.map((frame) => (
            <Disclosure key={frame.label}>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-ascend-black bg-ascend-white bg-white border border-gray-300 rounded-xl hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75">
                    <span>{frame.label}</span>
                    <ChevronUpIcon
                      className={`${
                        open ? 'transform rotate-180' : ''
                      } w-5 h-5 text-ascend-black`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-ascend-black">
                    <div className="grid grid-cols-3 gap-3">
                      <StatCard 
                        title="Completed Goals" 
                        value={stats[frame.label]?.completed || 0}
                        message={stats[frame.label]?.completed > 0 ? "Great job! Keep pushing forward!" : "You're getting there! One step at a time."}
                      />
                      <StatCard 
                        title="In Progress" 
                        value={stats[frame.label]?.inProgress || 0}
                        message={stats[frame.label]?.inProgress > 0 ? "Stay focused, you're almost there!" : "Start something today!"}
                      />
                      <StatCard 
                        title="Total Goals" 
                        value={stats[frame.label]?.total || 0}
                        message={stats[frame.label]?.total > 0 ? "The more goals, the bigger the achievements!" : "Set a goal to get started on your journey!"}
                      />
                    </div>
                    <ActionButtons stats={stats[frame.label]} timeFrame={frame.label} />
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}

          {/* Graph */}
          <div className="bg-white rounded-sm shadow p-8 flex flex-col items-center justify-center">
            <h4 className="text-lg mb-2">Visualize Goal Completion</h4>
            <div className="h-1/3 w-full">
              <Bar ref={chartRef} options={options} data={data}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
