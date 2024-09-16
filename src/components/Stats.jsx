import { useState, useEffect } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import { getAuth } from 'firebase/auth';
import { readGoals } from '../utils/database';
import Sidebar from './Sidebar';

const timeFrames = [
  { label: '1 Month', days: 30 },
  { label: '3 Months', days: 90 },
  { label: '6 Months', days: 180 },
  { label: '1 Year', days: 365 },
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
      const calculatedStats = calculateStats(goals);
      setStats(calculatedStats);
    }
  };

  const calculateStats = (goals) => {
    // Implement logic to calculate stats for each time frame
    return timeFrames.reduce((acc, frame) => {
      acc[frame.label] = {
        completed: Math.floor(Math.random() * 10),
        inProgress: Math.floor(Math.random() * 10),
        total: Math.floor(Math.random() * 20),
      };
      return acc;
    }, {});
  };

  return (
    <div className="flex h-screen">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
      />
      
      <div className="flex-1 overflow-auto bg-black bg-opacity-50 text-white p-8">
        <h1 className="text-3xl font-bold mb-8">Goal Progress Statistics</h1>
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
                        <div className="bg-ascend-green p-3 rounded-lg">
                        <p className="font-semibold text-sm">Completed Goals</p>
                        <p className="text-xl">{stats[frame.label]?.completed || 0}</p>
                        <p className="text-xs mt-1">
                            {stats[frame.label]?.completed > 0 ? "Great job! Keep pushing forward!" : "You're getting there! One step at a time."}
                        </p>
                        </div>
                        <div className="bg-ascend-pink p-3 rounded-lg">
                        <p className="font-semibold text-sm">In Progress</p>
                        <p className="text-xl">{stats[frame.label]?.inProgress || 0}</p>
                        <p className="text-xs mt-1">
                            {stats[frame.label]?.inProgress > 0 ? "Stay focused, you're almost there!" : "Start something today!"}
                        </p>
                        </div>
                        <div className="bg-ascend-orange p-3 rounded-lg">
                        <p className="font-semibold text-sm">Total Goals</p>
                        <p className="text-xl">{stats[frame.label]?.total || 0}</p>
                        <p className="text-xs mt-1">
                            {stats[frame.label]?.total > 0 ? "The more goals, the bigger the achievements!" : "Set a goal to get started on your journey!"}
                        </p>
                        </div>
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