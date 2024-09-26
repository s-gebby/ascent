import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { readTasks, createTask, updateTask, deleteTask, createSubtask, updateSubtask, deleteSubtask, getTaskStats } from '../utils/database'
import { TextInput, Button, Checkbox, Select, Textarea, Modal } from '@mantine/core'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import "../styles/datepicker-custom.css"
import { Calendar, Clock, Search, SortAscending, ChevronDown, ChevronUp } from 'tabler-icons-react'


export default function TaskList() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [newTaskCategory, setNewTaskCategory] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState('medium')
  const [newTaskDueDate, setNewTaskDueDate] = useState(null)
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('dueDate')
  const [sortOrder, setSortOrder] = useState('asc')
  const [selectedTask, setSelectedTask] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newSubtask, setNewSubtask] = useState('')
  const [taskStats, setTaskStats] = useState({ totalTasks: 0, completedTasks: 0, incompleteTasks: 0 })
  const auth = getAuth()
  const categoryColors = {
    personal: 'bg-ascend-green',
    work: 'bg-ascend-blue',
    health: 'bg-ascend-pink',
    finance: 'bg-ascend-orange',
    other: 'bg-gray-600'
  };
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchTasks()
        fetchTaskStats()
      } else {
        setTasks([])
        setTaskStats({ totalTasks: 0, completedTasks: 0, incompleteTasks: 0 })
      }
    })

    return () => unsubscribe()
  }, [auth])

  const fetchTasks = async () => {
    if (auth.currentUser) {
      try {
        const fetchedTasks = await readTasks(auth.currentUser.uid)
        if (fetchedTasks) {
          setTasks(Object.entries(fetchedTasks).map(([id, task]) => ({ id, ...task })))
        } else {
          setTasks([])
        }
      } catch (error) {
        console.error("Error fetching tasks:", error)
      }
    }
  }

  const fetchTaskStats = async () => {
    if (auth.currentUser) {
      const stats = await getTaskStats(auth.currentUser.uid)
      setTaskStats(stats)
    }
  }

  const handleAddTask = async (e) => {
    e.preventDefault()
    if (newTask.trim() && auth.currentUser) {
      const taskData = {
        text: newTask,
        completed: false,
        category: newTaskCategory,
        priority: newTaskPriority,
        dueDate: newTaskDueDate ? newTaskDueDate.toISOString() : null,
        description: newTaskDescription,
      }
      const taskId = await createTask(auth.currentUser.uid, taskData)
      setTasks(prevTasks => [...prevTasks, { id: taskId, ...taskData }])
      setNewTask('')
      setNewTaskCategory('')
      setNewTaskPriority('medium')
      setNewTaskDueDate(null)
      setNewTaskDescription('')
      fetchTaskStats()
    }
  }

  const handleToggleTask = async (taskId) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    )
    setTasks(updatedTasks)
    if (auth.currentUser) {
      await updateTask(auth.currentUser.uid, taskId, { completed: !tasks.find(t => t.id === taskId).completed })
      fetchTaskStats()
    }
  }

  const handleDeleteTask = async (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId))
    if (auth.currentUser) {
      await deleteTask(auth.currentUser.uid, taskId)
      fetchTaskStats()
    }
  }

  const handleAddSubtask = async (e) => {
    e.preventDefault()
    if (newSubtask.trim() && selectedTask && auth.currentUser) {
      const subtaskData = { text: newSubtask, completed: false }
      const subtaskId = await createSubtask(auth.currentUser.uid, selectedTask.id, subtaskData)
      setTasks(prevTasks => prevTasks.map(task => 
        task.id === selectedTask.id 
          ? { ...task, subtasks: { ...task.subtasks, [subtaskId]: subtaskData } }
          : task
      ))
      setNewSubtask('')
    }
  }

  const handleToggleSubtask = async (taskId, subtaskId) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            subtasks: { 
              ...task.subtasks, 
              [subtaskId]: { 
                ...task.subtasks[subtaskId], 
                completed: !task.subtasks[subtaskId].completed 
              } 
            } 
          }
        : task
    )
    setTasks(updatedTasks)
    if (auth.currentUser) {
      await updateSubtask(auth.currentUser.uid, taskId, subtaskId, { completed: !tasks.find(t => t.id === taskId).subtasks[subtaskId].completed })
    }
  }

  const handleDeleteSubtask = async (taskId, subtaskId) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === taskId 
        ? { ...task, subtasks: Object.fromEntries(Object.entries(task.subtasks).filter(([id]) => id !== subtaskId)) }
        : task
    ))
    if (auth.currentUser) {
      await deleteSubtask(auth.currentUser.uid, taskId, subtaskId)
    }
  }

  const filteredTasks = tasks
    .filter(task => 
      task.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        return sortOrder === 'asc' 
          ? new Date(a.dueDate) - new Date(b.dueDate)
          : new Date(b.dueDate) - new Date(a.dueDate)
      } else if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return sortOrder === 'asc'
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority]
      } else {
        return sortOrder === 'asc'
          ? a.text.localeCompare(b.text)
          : b.text.localeCompare(a.text)
      }
    })

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
      />
      
      <div className="flex-1 overflow-auto bg-gray-200 p-6">
      <header className="bg-ascend-white border border-gray-300 rounded-xl mb-6 px-4">
        <div className="py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 uppercase">Task List</h1>
          <p className="text-sm text-gray-600 max-w-xl">
            Create and manage your tasks here! Add new tasks, set due dates, and track your progress.
          </p>
        </div>
      </header>
        <div className="md:flex">
          <form onSubmit={handleAddTask} className="p-6 space-y-4 md:w-2/3">
            <h2 className="text-xl font-bold text-ascend-green uppercase mb-6 font-archivo-black">Create New Task</h2>
            
            <div>
              <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700 mb-1 font-archivo-black">1. Task Title</label>
              <TextInput
                id="taskTitle"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter your task title"
                className="w-full p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 font-archivo"
              />
            </div>
            <div>
              <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700 mb-1 font-archivo-black">2. Task Description</label>
              <Textarea
                id="taskDescription"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Describe your task"
                className="w-full p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 font-archivo"
              />
            </div>
            <div>
              <label htmlFor="taskCategory" className="block text-sm font-medium text-gray-700 mb-1 font-archivo-black">3. Task Category</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {[
                  { value: 'personal', label: 'Personal' },
                  { value: 'work', label: 'Work' },
                  { value: 'health', label: 'Health' },
                  { value: 'finance', label: 'Finance' },
                  { value: 'other', label: 'Other' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      setNewTaskCategory(option.value)
                    }}
                    className={`px-3 py-1 rounded-full text-sm ${
                      newTaskCategory === option.value
                        ? `${categoryColors[option.value]} text-white`
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="taskPriority" className="block text-sm font-medium text-gray-700 mb-1 font-archivo-black">4. Task Priority</label>
              <Select
                id="taskPriority"
                value={newTaskPriority}
                onChange={setNewTaskPriority}
                placeholder="Select priority"
                data={[
                  { value: 'high', label: 'High' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'low', label: 'Low' },
                ]}
                className="w-full p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 font-archivo"
              />
            </div>
          </form>

          <div className="md:w-1/3 bg-gray-100 p-6 flex flex-col items-center justify-center">
            <div>
              <label htmlFor="completeBy" className="block text-sm font-medium text-ascend-black mb-1 font-archivo-black capitalize text-center">5. Complete By</label>
              
              <DatePicker
                id="completeBy"
                selected={newTaskDueDate}
                onChange={(date) => setNewTaskDueDate(date)}
                inline
                className="rounded-lg shadow-md"
              />
              <p className='text-xs text-center text-gray-500'>*Select a date you would like to complete this task by...*</p>
            </div>
            <div className="mt-2">
              <Button 
                type="submit" 
                onClick={handleAddTask}
                className="bg-ascend-blue text-white font-bold font-archivo-black transition duration-200"
              >
                Add Task
              </Button>
            </div>
          </div>
        </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6">
              <h1 className='text-xl mb-4 md:mb-0'>All Tasks</h1>
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
                <TextInput
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tasks"
                  icon={<Search size={14} />}
                  className="w-full md:w-auto"
                />
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  data={[
                    { value: 'dueDate', label: 'Due Date' },
                    { value: 'priority', label: 'Priority' },
                    { value: 'alphabetical', label: 'Alphabetical' },
                  ]}
                  icon={<SortAscending size={12} />}
                  className="w-full md:w-auto"
                />
              </div>
            </div>
          <div className="space-y-4">
            {filteredTasks.map(task => (
              <div key={task.id} className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-start md:items-center mb-2 md:mb-0">
                  <Checkbox
                    checked={task.completed}
                    onChange={() => handleToggleTask(task.id)}
                    className="mr-4 mt-1 md:mt-0"
                  />
                  <div>
                    <span className={task.completed ? 'line-through text-gray-500' : ''}>
                      <span className={`inline-block w-2 h-2 rounded-full mr-1 ${categoryColors[task.category]}`}></span>
                      {task.text}
                    </span>
                    <div className="text-sm text-gray-500">
                      <span>{task.category}</span>
                      <span className="mx-2">•</span>
                      <span>{task.priority}</span>
                      {task.dueDate && (
                        <>
                          <span className="mx-2">•</span>
                          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                    {task.subtasks && Object.entries(task.subtasks).map(([subtaskId, subtask]) => (
                      <div key={subtaskId} className="ml-6 mt-2 flex items-center">
                        <Checkbox
                          checked={subtask.completed}
                          onChange={() => handleToggleSubtask(task.id, subtaskId)}
                        />
                        <span className="ml-2">{subtask.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-end mt-2 md:mt-0">
                  <Button 
                    color="ascend-blue" 
                    onClick={() => { setSelectedTask(task); setIsModalOpen(true); }} 
                    className="mr-2 text-xs px-2 py-1"
                    size="xs"
                  >
                    Details
                  </Button>
                  <Button 
                    color="red" 
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-xs px-2 py-1"
                    size="xs"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Modal
          opened={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedTask?.text}
          size="lg"
          fullScreen={window.innerWidth < 768}
        >
          {selectedTask && (
            <div>
              <p>{selectedTask.description}</p>
              <h4 className="mt-4 mb-2 font-semibold">Subtasks</h4>
              <ul className="space-y-2">
                {selectedTask.subtasks && Object.entries(selectedTask.subtasks).map(([id, subtask]) => (
                  <li key={id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Checkbox
                        checked={subtask.completed}
                        onChange={() => handleToggleSubtask(selectedTask.id, id)}
                      />
                      <span className="ml-2">{subtask.text}</span>
                    </div>
                    <Button color="red" onClick={() => handleDeleteSubtask(selectedTask.id, id)}>Delete</Button>
                  </li>
                ))}
              </ul>
              <form onSubmit={handleAddSubtask} className="mt-4">
                <TextInput
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  placeholder="Add a subtask"
                  className="mb-2"
                />
                <Button type="submit" color="ascend-blue">Add Subtask</Button>
              </form>
            </div>
          )}
        </Modal>
      </div>
  )
}
