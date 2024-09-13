import { useState } from 'react'
import { PlusIcon, MinusIcon } from '@heroicons/react/24/solid'
import { motion, AnimatePresence } from 'framer-motion'

export default function NewGoalForm({ onAddGoal, onCancel }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [milestones, setMilestones] = useState([])
  const [newMilestone, setNewMilestone] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (title && description) {
      onAddGoal({
        title,
        description,
        createdAt: new Date().toISOString(),
        progress: '0%',
        milestones: milestones || []
      })
      setTitle('')
      setDescription('')
      setMilestones([])
    }
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
      <div>
        <label htmlFor="milestones" className="block text-sm font-medium text-gray-700 mb-1 font-archivo-black">Milestones</label>
        {/* Add milestone input and list here */}
      </div>
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