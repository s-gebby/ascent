import { useState, useEffect } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import { ShareIcon } from '@heroicons/react/24/outline';
import { getAuth } from 'firebase/auth';
import { readGoals } from '../utils/database';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';

const timeFrames = [
  { label: '1 Month', days: 30 },
  { label: '3 Months', days: 90 },
  { label: '6 Months', days: 180 },
  { label: '1 Year', days: 365 },
  { label: 'All Time', days: Infinity },
];

export default function Stats() {
  const [stats, setStats] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    if (auth.currentUser) {
      const goals = await readGoals(auth.currentUser.uid);
      if (goals) {
        const calculatedStats = calculateStats(goals);
        setStats(calculatedStats);
      }
    }
  };

  const calculateStats = (goals) => {
    const now = new Date();
    return timeFrames.reduce((acc, frame) => {
      const cutoffDate = frame.days === Infinity ? new Date(0) : new Date(now.getTime() - frame.days * 24 * 60 * 60 * 1000);
      
      const relevantGoals = Object.values(goals).filter(goal => {
        const completedDate = goal.completedAt ? new Date(goal.completedAt) : null;
        return completedDate && completedDate > cutoffDate;
      });

      acc[frame.label] = {
        completed: relevantGoals.length,
        inProgress: Object.values(goals).filter(goal => !goal.completedAt).length,
        total: Object.values(goals).length,
      };
      return acc;
    }, {});
  };

  const StatCard = ({ title, value, message, color }) => (
    <motion.div 
      className={`bg-${color} p-3 rounded-lg`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="font-semibold text-sm">{title}</p>
      <p className="text-xl">{value}</p>
      <p className="text-xs mt-1">{message}</p>
    </motion.div>
  );

  const ShareButton = ({ stats, timeFrame }) => {
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

    return (
      <button 
        onClick={handleShare}
        className="flex items-center text-ascend-white hover:text-ascend-blue transition-colors duration-200"
      >
        <ShareIcon className="h-5 w-5 mr-1" />
        Share Progress
      </button>
    );
  };

  return (
    <div className="flex h-screen">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
      />
      <div className="flex-1 overflow-auto bg-black bg-opacity-50 text-white p-8">
        <h1 className="text-3xl font-bold mb-8">Goal Statistics</h1>
        <div className="space-y-4">
          {timeFrames.map((frame) => (
            <Disclosure key={frame.label}>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-white bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75">
                    <span>{frame.label}</span>
                    <ChevronUpIcon
                      className={`${
                        open ? 'transform rotate-180' : ''
                      } w-5 h-5 text-white`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-ascend-black">
                    <div className="grid grid-cols-3 gap-3">
                      <StatCard 
                        title="Completed Goals" 
                        value={stats[frame.label]?.completed || 0}
                        message={stats[frame.label]?.completed > 0 ? "Great job! Keep pushing forward!" : "You're getting there! One step at a time."}
                        color="ascend-green"
                      />
                      <StatCard 
                        title="In Progress" 
                        value={stats[frame.label]?.inProgress || 0}
                        message={stats[frame.label]?.inProgress > 0 ? "Stay focused, you're almost there!" : "Start something today!"}
                        color="ascend-pink"
                      />
                      <StatCard 
                        title="Total Goals" 
                        value={stats[frame.label]?.total || 0}
                        message={stats[frame.label]?.total > 0 ? "The more goals, the bigger the achievements!" : "Set a goal to get started on your journey!"}
                        color="ascend-orange"
                      />
                    </div>
                    <div className="mt-4 flex justify-end">
                      <ShareButton stats={stats[frame.label]} timeFrame={frame.label} />
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </div>
      </div>
    </div>
  );
}