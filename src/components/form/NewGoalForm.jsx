import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "../../styles/datepicker-custom.css";

import { motion } from 'framer-motion';
import { TextInput, Textarea, Button, Checkbox } from '@mantine/core';

export default function NewGoalForm({ onAddGoal }) {
  const [goalData, setGoalData] = useState({
    title: '',
    description: '',
    completeBy: null,
    isDailyGoal: false,
  });
  const [initialTask, setInitialTask] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newGoal = {
      ...goalData,
      createdAt: new Date().toISOString(),
      initialTask: initialTask ? { title: initialTask, completed: false } : null,
    };
    onAddGoal(newGoal);
    setGoalData({ title: '', description: '', completeBy: null, isDailyGoal: false });
    setInitialTask('');
  };

  return (
    <motion.div 
      className="bg-white border border-gray-300 rounded-sm overflow-hidden"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="md:flex ">
        <form onSubmit={handleSubmit} className="p-6 space-y-4 md:w-2/3 ">
          <h2 className="text-lg font-bold text-ascend-green uppercase mb-6 font-archivo-black">Create New Goal</h2>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1 font-archivo-black ">1 - Goal Title</label>
            <TextInput
              id="title"
              placeholder="Enter your goal title"
              value={goalData.title}
              onChange={(e) => setGoalData({...goalData, title: e.target.value})}
              className="w-full p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 font-archivo"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 font-archivo-black">2 - Goal Description</label>
            <Textarea
              id="description"
              placeholder="Describe your goal"
              value={goalData.description}
              onChange={(e) => setGoalData({...goalData, description: e.target.value})}
              className="w-full p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 font-archivo"
            />
          </div>

          <div className="flex flex-col items-end mt-8">
            <div className="flex items-center m-3">
              <label htmlFor="dailyGoal" className="mr-1 text-sm font-semibold text-ascend-black">4 - Daily Goal</label>
              <Checkbox
                id="dailyGoal"
                checked={goalData.isDailyGoal}
                onChange={(e) => setGoalData({...goalData, isDailyGoal: e.target.checked})}
                color="ascend-green"
                className="w-2 h-5 bg-gray-100 border-gray-900 rounded focus:ring-ascend-blue focus:ring-2"
              />
            </div>
            <Button 
              type="submit" 
              className="bg-ascend-blue text-white font-bold font-archivo-black transition duration-200"
            >
              Create Goal
            </Button>
          </div>
        </form>

        <div className="md:w-1/3 p-6 flex items-center justify-center">
          <div>
            <label htmlFor="completeBy" className="block text-sm font-medium text-ascend-black mb-1 font-archivo-black capitalize text-center">3 - Complete By</label>
            
            <DatePicker
              id="completeBy"
              selected={goalData.completeBy}
              onChange={(date) => setGoalData({...goalData, completeBy: date})}
              inline
              className="rounded-lg shadow-md"
            />
            <p className='text-xs text-center text-gray-500'>*Select a date you would like to complete this goal by...*</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}