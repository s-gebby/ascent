import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { motion, AnimatePresence } from 'framer-motion'

export default function NewGoalForm({ onAddGoal, onCancel }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [completeBy, setCompleteBy] = useState(null)
  const [isDailyGoal, setIsDailyGoal] = useState(false)
  const [milestones, setMilestones] = useState([])
  const [newMilestone, setNewMilestone] = useState('')
  const [formError, setFormError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title || !description) {
      setFormError('Please fill in the title and description.')
      return
    }
    if (!isDailyGoal && !completeBy) {
      setFormError('Please select either a completion date or mark as a daily goal.')
      return
    }
    onAddGoal({
      title,
      description,
      createdAt: new Date().toISOString(),
      isDailyGoal,
      completeBy,
      milestones: milestones || []
    })
    // Reset form fields
    setTitle('')
    setDescription('')
    setCompleteBy(null)
    setIsDailyGoal(false)
    setMilestones([])
    setFormError('')
  }

  const addMilestone = () => {
    if (newMilestone.trim() !== '') {
      setMilestones([...milestones, { text: newMilestone, completed: false }]);
      setNewMilestone('');
    }
  };
  
  const removeMilestone = (index) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1 font-archivo-black">Goal Title</label>
        <input
          id="title"
          type="text"
          placeholder="Enter your goal title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 font-archivo"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 font-archivo-black">Goal Description</label>
        <textarea
          id="description"
          placeholder="Describe your goal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 h-32 font-archivo"
        />
      </div>
      <div className="relative">
        <label htmlFor="completeBy" className="block text-sm font-medium text-gray-700 mb-1 font-archivo-black">Complete by</label>
        <DatePicker
          id="completeBy"
          selected={completeBy}
          onChange={(date) => setCompleteBy(date)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 font-archivo"
          popperClassName="z-50"
          popperPlacement="bottom-start"
        />
      </div>
      <div className="flex items-center mb-4">
        <input
          id="dailyGoal"
          type="checkbox"
          checked={isDailyGoal}
          onChange={(e) => setIsDailyGoal(e.target.checked)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label htmlFor="dailyGoal" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
          Daily Goal
        </label>
      </div>
      <div>
        <label htmlFor="milestones" className="block text-sm font-medium text-gray-700 mb-1 font-archivo-black">Milestones</label>
        {/* Add milestone input and list here */}
      </div>
      
      {formError && (
        <p className="text-red-500 text-sm">{formError}</p>
      )}
      
      <div className="flex justify-between">
        <button 
          type="submit" 
          className="bg-black text-white font-bold py-2 px-4 rounded-md font-archivo-black"
        >
          Add Goal
        </button>
        <button 
          type="button" 
          onClick={onCancel}
          className="bg-gray-300 text-black font-bold py-2 px-4 rounded-md font-archivo-black"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
