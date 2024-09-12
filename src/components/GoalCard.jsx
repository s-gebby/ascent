import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

export default function GoalCard({ goal, onEdit, onDelete }) {
  const truncateDescription = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...'
    }
    return text
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 w-full h-48 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold mb-2">{goal.title}</h3>
        <p className="text-gray-600 mb-4 overflow-hidden break-words">
          {truncateDescription(goal.description, 80)}
        </p>
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => onEdit(goal)}
          className="text-yellow-500 hover:text-yellow-600 mr-2"
        >
          <PencilIcon className="h-5 w-5" />
        </button>
        <button
          onClick={() => onDelete(goal.id)}
          className="text-red-500 hover:text-red-700"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}