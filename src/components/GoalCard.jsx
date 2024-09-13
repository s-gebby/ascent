import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { getAuth } from 'firebase/auth'
import { updateGoal, deleteGoal } from '../utils/database'

export default function GoalCard({ goal, onEdit, onDelete }) {
  const auth = getAuth()

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

  return (
    <div className="flex max-w-xl flex-col items-start justify-between bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex items-center gap-x-4 text-xs p-4 bg-gray-50 w-full">
        <time dateTime={goal.createdAt} className="text-gray-500">
          {new Date(goal.createdAt).toLocaleDateString()}
        </time>
        <span className="relative z-10 rounded-full bg-green-100 px-3 py-1.5 font-medium text-green-600">
          Goal</span>
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
      <div className="relative mt-4 flex items-center gap-x-4 p-4 border-t border-gray-200 w-full">
        <div className="text-sm leading-6 flex-grow">
          <p className="font-semibold text-gray-900">Progress</p>
          <p className="text-gray-600">{goal.progress || '0%'} Complete</p>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => onEdit(goal)}
            className="text-yellow-500 hover:text-yellow-600 mr-2"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
