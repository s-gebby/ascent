import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { getAuth } from 'firebase/auth';
import { readGoals } from '../utils/database';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [totalGoals, setTotalGoals] = useState(0);
  const [user, setUser] = useState(null);
  const [goals, setGoals] = useState([])
  const auth = getAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);

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

  const SimpleGoalCard = ({ goal }) => (
    <div className="bg-white rounded-sm shadow p-4">
      <h3 className="text-lg font-semibold mb-2">{goal.title}</h3>
      <p className="text-sm text-gray-600 mb-2">{truncateDescription(goal.description, 50)}</p>
      <div className="flex justify-between items-center">
        <span className={`px-2 py-1 text-xs rounded-full ${
          goal.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {goal.completed ? 'Completed' : 'In Progress'}
        </span>
        <span className="text-sm text-gray-500">{new Date(goal.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );

  {/* Placeholders for chartData */}
  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Goals Completed',
        data: [3, 5, 2, 8, 6, 7, 4],
        borderColor: '#1556bf',
        tension: 0.1
      },
    ],
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
            <BellIcon className="h-6 w-6 text-gray-600" />
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
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-ascend-white p-4">
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2 text-center">🚨Important🚨</h3>
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Goal cards */}
            <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {goals.slice(0, 8).map(goal => (
                <SimpleGoalCard key={goal.id} goal={goal} />
              ))}
            </div>
            {/* Graph */}
            <div className="lg:col-span-2 bg-white rounded-sm shadow p-4">
              <h4 className="text-lg font-semibold mb-2">Goal Completion Trend</h4>
              <div className="h-64">
                <Line data={chartData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
            {/* Current goals table */}
            <div className="lg:col-span-2 bg-white rounded-sm shadow p-4">
              <h4 className="text-lg font-semibold mb-2">Current Goals</h4>
              <div className="overflow-x-auto max-h-64">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goal</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
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
          </div>
        </main>
      </div>
    </div>
  );
}

function truncateDescription(text, maxLength) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  }
  return text;
}
