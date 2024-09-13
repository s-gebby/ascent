import { useState } from 'react'
import { PlusIcon, MinusIcon } from '@heroicons/react/24/solid'
import { motion, AnimatePresence } from 'framer-motion'

export default function NewGoalForm({ onAddGoal }) {
  const [isOpen, setIsOpen] = useState(false)
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
        milestones: milestones || [] // Ensure milestones is always an array
      })
      setTitle('')
      setDescription('')
      setMilestones([])
      setIsOpen(false)
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
    <motion.div 
      className="mb-8 overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex px-6 py-3 bg-black text-white font-semibold text-lg rounded-md font-archivo-black"
        >
        <span>{isOpen ? 'Close Form' : 'Create New Goal'}</span>
        <div>
          {isOpen ? <MinusIcon className="h-6 w-6 ml-2" /> : <PlusIcon className="h-6 w-6 ml-2" />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.form 
            onSubmit={handleSubmit} 
            className="p-6 space-y-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
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
            {/* ... existing form fields ... */}
            <div>
              <label htmlFor="milestones" className="block text-sm font-medium text-gray-700 mb-1 font-archivo-black">Milestones</label>
              {/* ... (add the milestone input and list as described earlier) ... */}
            </div>
            <button 
              type="submit" 
              className="w-1/8 bg-black text-white font-bold py-2 px-4 rounded-md font-archivo-black"
            >
              Add Goal
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
