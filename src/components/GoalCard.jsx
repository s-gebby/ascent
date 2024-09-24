import { useState } from 'react'
import { PencilIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { getAuth } from 'firebase/auth'
import { updateGoal, moveGoalToCompleted } from '../utils/database'
import Confetti from 'react-confetti'
import { Modal, Button, Tooltip } from '@mantine/core'
import { MapIcon } from '@heroicons/react/24/outline'


export default function GoalCard({ goal, onEdit, onDelete }) {
  const auth = getAuth()
  const [showConfetti, setShowConfetti] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const truncateDescription = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...'
    }
    return text
  }

  const handleDelete = async () => {
    if (auth.currentUser) {
      await deleteGoal(auth.currentUser.uid, goal.id)
      onDelete(goal.id)
    }
  }

  const handleComplete = async () => {
    if (auth.currentUser) {
      const updates = {
        completed: true,
        completedAt: new Date().toISOString()
      }
      await updateGoal(auth.currentUser.uid, goal.id, updates)
      setShowConfetti(true)
      setTimeout(() => {
        setShowConfetti(false)
        setShowPopup(true)
      }, 4000); // Show confetti for 4 seconds
    }
  }

  const handleConfirmDelete = async () => {
    if (auth.currentUser) {
      await moveGoalToCompleted(auth.currentUser.uid, goal.id)
      onDelete(goal.id)
    }
    setShowPopup(false)
  }

  const handleViewDetails = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      {showConfetti && <Confetti />}
      <div className="flex max-w-xl flex-col items-start justify-between bg-white border border-gray-300 rounded-xl overflow-hidden">
        <div className="flex items-center gap-x-4 text-xs py-2 px-4 bg-gray-50 w-full border-b border-gray-300">
          <time dateTime={goal.createdAt} className="text-gray-500">
            {new Date(goal.createdAt).toLocaleDateString()}
          </time>
          <span className="relative z-10 rounded-full bg-green-100 px-3 py-1.5 font-medium text-green-600">
            {goal.isDailyGoal ? 'Daily Goal' : 'One-time Goal'}
          </span>
        </div>
          <div className="group relative p-4 flex-grow">
            <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
              {goal.title}
            </h3>
            <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
              {truncateDescription(goal.description, 150)}
            </p>
            {goal.milestones && goal.milestones.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-sm text-gray-700">Milestones:</h4>
                <ul className="mt-2">
                  {goal.milestones.map((milestone, index) => (
                    <li key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={milestone.completed}
                        onChange={() => handleMilestoneToggle(index)}
                        className="mr-2"
                      />
                      <span className={milestone.completed ? 'line-through' : ''}>{milestone.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        <div className="flex items-center justify-between w-full px-4 py-2 border-t border-gray-300">
        <div className="flex items-center">
    <Tooltip label="View Details" withArrow>
      <button
        onClick={handleViewDetails}
        className="text-ascend-blue hover:text-blue-400 transition-colors duration-300 px-2"
      >
        <MapIcon className="h-5 w-5" />
      </button>
    </Tooltip>
    <Tooltip label="Mark as Complete" withArrow>
      <button
        onClick={handleComplete}
        className="text-green-500 hover:text-green-600 px-2"
      >
        <CheckCircleIcon className="h-5 w-5" />
      </button>
    </Tooltip>
    <Tooltip label="Edit Goal" withArrow>
      <button
        onClick={() => onEdit(goal)}
        className="text-yellow-500 hover:text-yellow-600 px-2"
      >
        <PencilIcon className="h-5 w-5" />
      </button>
    </Tooltip>
    <Tooltip label="Delete Goal" withArrow>
      <button
        onClick={handleDelete}
        className="text-red-500 hover:text-red-700 px-2"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    </Tooltip>
  </div>
        </div>
      </div>
      {showPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">LET'S GOOO!</h3>
            <p className="mb-4">Congrats on completing your goal! You're making real progress.</p>
            <p className="mb-4">Would you like to delete your<br></br><span className='font-archivo-black uppercase text-sm'>completed</span> goal?</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowPopup(false)}
                className="px-3 py-1 bg-gray-300 text-black text-sm rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3 py-1 bg-red-500 text-sm text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={goal.title}
        size="lg"
      >
        <div>
          <h3 className="font-semibold mb-2">Description:</h3>
          <p className="mb-4">{goal.description}</p>
          
          <h3 className="font-semibold mb-2">Linked Journal Entries:</h3>
          <ul className="list-disc pl-5 mb-4">
            {goal.linkedJournalEntries && goal.linkedJournalEntries.map(entry => (
              <li key={entry.id}>{entry.title}</li>
            ))}
          </ul>
          
          <h3 className="font-semibold mb-2">Linked Tasks:</h3>
          <ul className="list-disc pl-5 mb-4">
            {goal.linkedTasks && goal.linkedTasks.map(task => (
              <li key={task.id}>{task.text}</li>
            ))}
          </ul>
        </div>
      </Modal>
    </>
  )
}
