import { useState, useEffect, useCallback } from 'react';
import { getAuth } from 'firebase/auth';
import { readTasks, createTask, updateTask, deleteTask, readGoals } from '../utils/database';
import { TextInput, Button, Select, Textarea, Modal, Checkbox, ActionIcon, Tooltip, Transition } from '@mantine/core';
import Sidebar from './Sidebar';
import { BellIcon, UserCircleIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [goals, setGoals] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', goalId: null });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [sortBy, setSortBy] = useState('createdAt');
  const [filterCompleted, setFilterCompleted] = useState('all');
  
  const auth = getAuth();
  const navigate = useNavigate();

  const fetchTasks = useCallback(async () => {
    if (auth.currentUser) {
      try {
        console.log("Fetching tasks for user:", auth.currentUser.uid);
        const fetchedTasks = await readTasks(auth.currentUser.uid);
        console.log("Fetched tasks:", fetchedTasks);
        setTasks(fetchedTasks || []);
      } catch (error) {
        console.error("Error fetching tasks:", error.message, error.stack);
        setTasks([]);
      }
    } else {
      console.log("No authenticated user");
      setTasks([]);
    }
  }, [auth.currentUser]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      console.log("Auth state changed. Current user:", currentUser?.uid);
      setUser(currentUser);
      if (currentUser) {
        fetchTasks();
      }
    });

    return () => unsubscribe();
  }, [auth, fetchTasks]);

  useEffect(() => {
    const fetchGoals = async () => {
      if (auth.currentUser) {
        try {
          const fetchedGoals = await readGoals(auth.currentUser.uid);
          setGoals(fetchedGoals || []);
        } catch (error) {
          console.error("Error fetching goals:", error);
        }
      }
    };
    fetchGoals();
  }, [auth.currentUser]);


  const [isAddingTask] = useState(false);

  const handleAddTask = async () => {
    if (newTask.title && newTask.goalId && auth.currentUser) {
      try {
        const taskData = {
          ...newTask,
          completed: false,
          createdAt: new Date().toISOString()
        };
        await createTask(auth.currentUser.uid, taskData);
        setNewTask({ title: '', description: '', goalId: null });
        setIsModalOpen(false);
        fetchTasks();
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  const handleToggleTask = async (taskId) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (taskToUpdate) {
      const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };
      await updateTask(auth.currentUser.uid, taskId, updatedTask);
      fetchTasks();
    }
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(auth.currentUser.uid, taskId);
    fetchTasks();
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleUpdateTask = async () => {
    if (editingTask && auth.currentUser) {
      try {
        await updateTask(auth.currentUser.uid, editingTask.id, editingTask);
        setIsModalOpen(false);
        setEditingTask(null);
        fetchTasks();
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
  };

  const sortedAndFilteredTasks = tasks
    .filter(task => {
      if (filterCompleted === 'all') return true;
      return filterCompleted === 'completed' ? task.completed : !task.completed;
    })
    .sort((a, b) => {
      if (sortBy === 'createdAt') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });
  return (
    <div className="flex h-screen bg-ascend-white">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10 p-2 flex flex-col sm:flex-row justify-between items-center">
          <h2 className="text-3xl ml-2 font-semibold text-ascend-black">Task List</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Find..."
                className="pl-8 pr-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ascend-green focus:border-transparent"
              />
              <svg
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            {user && (
              <p className="text-xs font-bold text-ascend-black">
                Welcome, {user.displayName || 'Goal Ascender'}!
              </p>
            )}
            {user && user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Profile" 
                className="h-8 w-8 mr-2 rounded-full cursor-pointer transition-all duration-300 hover:ring-2 hover:ring-ascend-green"
                onClick={() => navigate('/account')}
              />
            ) : (
              <UserCircleIcon 
                className="h-8 w-8 text-gray-600 cursor-pointer transition-all duration-300 hover:ring-2 hover:ring-ascend-green rounded-full" 
                onClick={() => navigate('/account')}
              />
            )}
            <BellIcon className="h-6 w-6 text-gray-600 duration-1000 mr-2"/>
          </div>
        </header>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-ascend-white p-6">
          <div className="mb-6 flex justify-between items-center">
            <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 transition-colors duration-300">
              Add New Task
            </Button>
            <div className="flex space-x-4">
              <Select
                placeholder="Sort by"
                data={[
                  { value: 'createdAt', label: 'Date Created' },
                  { value: 'title', label: 'Title' },
                ]}
                value={sortBy}
                onChange={setSortBy}
              />
              <Select
                placeholder="Filter"
                data={[
                  { value: 'all', label: 'All Tasks' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'active', label: 'Active' },
                ]}
                value={filterCompleted}
                onChange={setFilterCompleted}
              />
            </div>
          </div>
          
          <Transition
            mounted={isModalOpen}
            transition="fade"
            duration={400}
            timingFunction="ease"
          >
            {(styles) => (
              <Modal opened={isModalOpen} onClose={() => {setIsModalOpen(false); setEditingTask(null);}} title={editingTask ? "Edit Task" : "Add New Task"} styles={styles}>
                <TextInput
                  label="Task Title"
                  value={editingTask ? editingTask.title : newTask.title}
                  onChange={(e) => editingTask ? setEditingTask({...editingTask, title: e.target.value}) : setNewTask({...newTask, title: e.target.value})}
                  className="mb-4"
                />
                <Textarea
                  label="Task Description"
                  value={editingTask ? editingTask.description : newTask.description}
                  onChange={(e) => editingTask ? setEditingTask({...editingTask, description: e.target.value}) : setNewTask({...newTask, description: e.target.value})}
                  className="mb-4"
                />
                <Select
                  label="Associated Goal"
                  data={Object.entries(goals).map(([id, goal]) => ({ value: id, label: goal.title }))}
                  value={editingTask ? editingTask.goalId : newTask.goalId}
                  onChange={(value) => editingTask ? setEditingTask({...editingTask, goalId: value}) : setNewTask({...newTask, goalId: value})}
                  className="mb-4"
                />
                <Button 
                  onClick={editingTask ? handleUpdateTask : handleAddTask}
                  loading={isAddingTask}
                  className="bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
                >
                  {editingTask ? "Update Task" : "Add Task"}
                </Button>
              </Modal>
            )}
          </Transition>

          <div className="space-y-4">
            {sortedAndFilteredTasks.map(task => (
              <div key={task.id} className="bg-white p-4 rounded-sm border border-gray-300 flex items-center justify-between transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center space-x-4">
                  <Checkbox
                    checked={task.completed}
                    onChange={() => handleToggleTask(task.id)}
                    className="cursor-pointer"
                  />
                  <div>
                    <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>{task.title}</h3>
                    <p className="text-sm text-gray-600">{task.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Goal: {goals && goals[task.goalId] ? goals[task.goalId].title : 'No associated goal'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Tooltip label="Edit Task" position="top">
                    <ActionIcon onClick={() => handleEditTask(task)} color="blue" variant="subtle">
                      <PencilIcon className="h-5 w-5" />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Delete Task" position="top">
                    <ActionIcon onClick={() => handleDeleteTask(task.id)} color="red" variant="subtle">
                      <TrashIcon className="h-5 w-5" />
                    </ActionIcon>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}