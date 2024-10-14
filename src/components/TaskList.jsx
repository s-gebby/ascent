import { useState, useEffect, useCallback } from 'react';
import { getAuth } from 'firebase/auth';
import { readTasks, createTask, updateTask, deleteTask, readGoals } from '../utils/database';
import { TextInput, Button, Select, Textarea, Modal, Checkbox, ActionIcon, Tooltip, Paper, Group, Text, Badge, Progress } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import { BellIcon, UserCircleIcon, TrashIcon, PencilIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [goals, setGoals] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', goalId: null, dueDate: null });
  const [opened, { open, close }] = useDisclosure(false);
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
        const fetchedTasks = await readTasks(auth.currentUser.uid);
        setTasks(fetchedTasks || []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasks([]);
      }
    } else {
      setTasks([]);
    }
  }, [auth.currentUser]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
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

  const handleAddTask = async () => {
    if (newTask.title && newTask.goalId && auth.currentUser) {
      try {
        const taskData = {
          ...newTask,
          completed: false,
          createdAt: new Date().toISOString()
        };
        await createTask(auth.currentUser.uid, taskData);
        setNewTask({ title: '', description: '', goalId: null, dueDate: null });
        close();
        fetchTasks();
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };
const [showCompletionModal, setShowCompletionModal] = useState(false);
const [taskToComplete, setTaskToComplete] = useState(null);

const handleToggleTask = (taskId) => {
  const task = tasks.find(t => t.id === taskId);
  if (task && !task.completed) {
    setTaskToComplete(task);
    setShowCompletionModal(true);
  } else {
    // If unchecking, move back to active tasks immediately
    moveTaskToActive(taskId);
  }
};

const moveTaskToCompleted = () => {
  if (taskToComplete) {
    setCompletedTasks([...completedTasks, {...taskToComplete, completed: true}]);
    setTasks(tasks.filter(t => t.id !== taskToComplete.id));
    setShowCompletionModal(false);
    setTaskToComplete(null);
  }
};

const moveTaskToActive = (taskId) => {
  const task = completedTasks.find(t => t.id === taskId);
  if (task) {
    setTasks([...tasks, {...task, completed: false}]);
    setCompletedTasks(completedTasks.filter(t => t.id !== taskId));
  }
};
  const handleDeleteTask = async (taskId) => {
    await deleteTask(auth.currentUser.uid, taskId);
    fetchTasks();
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    open();
  };

  const handleUpdateTask = async () => {
    if (editingTask && auth.currentUser) {
      try {
        await updateTask(auth.currentUser.uid, editingTask.id, editingTask);
        close();
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

  const calculateCountdown = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const difference = due - now;
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  };

  return (
    <div className="flex h-screen bg-ascend-white">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white z-10 p-2 flex justify-between items-center">
          <h2 className="text-3xl font-semibold text-ascend-black">Task List</h2>
          <div className="flex items-center space-x-4">
            <TextInput
              placeholder="Find..."
              icon={<svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
              className="w-48"
            />
            {user && (
              <Text size="sm" weight={700} className="text-ascend-black">
                Welcome, {user.displayName || 'Goal Ascender'}!
              </Text>
            )}
            {user && user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Profile" 
                className="h-8 w-8 rounded-full cursor-pointer transition-all duration-300 hover:ring-2 hover:ring-ascend-green"
                onClick={() => navigate('/account')}
              />
            ) : (
              <UserCircleIcon 
                className="h-8 w-8 text-gray-600 cursor-pointer transition-all duration-300 hover:text-ascend-green" 
                onClick={() => navigate('/account')}
              />
            )}
            <BellIcon className="h-6 w-6 text-gray-600 transition-all duration-300 hover:text-ascend-green cursor-pointer"/>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
        <Paper className="mb-6 text-ascend-black max-w-4xl mx-auto">
          <h1 className="text-2xl mb-2 text-center text-ascend-black">
            Why Tasks?
          </h1>
          <div className="p-1 rounded-lg">
            <p className="mb-2 text-center text-md text-ascend-black"> 
              Breaking down your goals into manageable tasks is a proven strategy for success.
            </p>
            <div className="flex items-center justify-center mb-2">
              <div className="w-16 h-1 bg-ascend-green rounded"></div>
            </div>
            <div className='flex flex-row mb-4 text-ascend-black text-sm ml-16'>
            <ul className="list-none space-y-4 p-2 mb-4 ml-16">
              {[
                "Clear, actionable steps towards your objectives",
                "A sense of progress and accomplishment",
                "Improved focus and time management",
                "Increased motivation as you complete each task"
              ].map((item, index) => (
                <li key={index} className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-ascend-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <ul className="list-none space-y-4 p-2 mb-4 text-ascend-black text-sm ml-16">
              {[
                "Better prioritization of your daily activities",
                "Enhanced ability to track and measure your progress",
                "Improved accountability to yourself and others",
                "Reduce stress by breaking large goals into smaller, manageable pieces",
              ].map((item, index) => (
                <li key={index} className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-ascend-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            </div>
            <p className='text-center text-md font-semibold text-ascend-blue italic'>
              Remember: Every task completed is a step closer to achieving your goals.
            </p>
          </div>
        </Paper>
          <Group position="apart" className="mb-6">
            <Button onClick={open}>
            Add New Task
            </Button>
            <Group>
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
            </Group>
          </Group>
          
          <AnimatePresence>
            {sortedAndFilteredTasks.map(task => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Paper p="md" withBorder className="mb-4 transition-all duration-300 hover:shadow-md">
                  <Group position="apart">
                    <Group>
                      <Checkbox
                        checked={task.completed}
                        onChange={() => handleToggleTask(task.id)}
                        className="cursor-pointer"
                      />
                      <div>
                        <Text size="lg" weight={500} className={task.completed ? 'line-through text-gray-500' : 'text-ascend-black'}>
                          {task.title}
                        </Text>
                        <Text size="sm" color="dimmed">{task.description}</Text>
                        <Badge color="ascend-blue" size="sm" className="mt-2">
                          {goals && goals[task.goalId] ? goals[task.goalId].title : 'No associated goal'}
                        </Badge>
                      </div>
                    </Group>
                    <Group spacing="xs">
                      <Tooltip label="Edit Task">
                        <ActionIcon onClick={() => handleEditTask(task)} color="ascend-orange" variant="light">
                          <PencilIcon className="h-4 w-4" />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Delete Task">
                        <ActionIcon onClick={() => handleDeleteTask(task.id)} color="red" variant="light">
                          <TrashIcon className="h-4 w-4" />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Group>
                </Paper>
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="flex space-x-6 mt-8">
            <Paper p="md" withBorder className="flex-1">
              <Text size="lg" weight={700} className="mb-4">Upcoming Tasks</Text>
              {tasks
                .filter(task => !task.completed && task.dueDate)
                .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                .slice(0, 5)
                .map(task => (
                  <Group key={task.id} position="apart" className="mb-2">
                    <Text size="sm">{task.title}</Text>
                    <Badge leftSection={<CalendarIcon className="h-3 w-3" />} color="ascend-pink" size="sm">
                      Due in {calculateCountdown(task.dueDate)}
                    </Badge>
                  </Group>
                ))}
            </Paper>
            
            {/* Task Statistics */}
            <Paper p="md" withBorder className="flex-1">
              <Text size="lg" weight={700} className="mb-4">Task Statistics</Text>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <Text size="xl" weight={700} color="blue">{tasks.length + completedTasks.length}</Text>
                  <Text size="sm" color="dimmed">Total Tasks</Text>
                </div>
                <div className="text-center">
                  <Text size="xl" weight={700} color="green">{completedTasks.length}</Text>
                  <Text size="sm" color="dimmed">Completed</Text>
                </div>
                <div className="text-center">
                  <Text size="xl" weight={700} color="orange">{tasks.length}</Text>
                  <Text size="sm" color="dimmed">Pending</Text>
                </div>
              </div>
              <Progress
                sections={[
                  { value: (completedTasks.length / (tasks.length + completedTasks.length)) * 100, color: 'green' },
                  { value: (tasks.length / (tasks.length + completedTasks.length)) * 100, color: 'orange' },
                ]}
                size="lg"
                className="mt-4"
              />
            </Paper>
          </div>

          <Paper p="md" withBorder className="mt-6">
            <Text size="lg" weight={700} className="mb-4">Completed Tasks</Text>
            {completedTasks.map(task => (
              <Group key={task.id} position="apart" className="mb-2">
                <Text size="sm">{task.title}</Text>
                <Checkbox
                  checked={true}
                  onChange={() => moveTaskToActive(task.id)}
                  className="cursor-pointer"
                />
              </Group>
            ))}
          </Paper>
        </main>
      </div>

      <Modal opened={opened} onClose={close} title={editingTask ? "Edit Task" : "Add New Task"}>
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
        <TextInput
          label="Due Date"
          type="date"
          value={editingTask ? editingTask.dueDate || '' : newTask.dueDate || ''}
          onChange={(e) => editingTask ? setEditingTask({...editingTask, dueDate: e.target.value}) : setNewTask({...newTask, dueDate: e.target.value})}
          className="mb-4"
        />
        <Button 
          onClick={editingTask ? handleUpdateTask : handleAddTask}
          className="bg-ascend-green hover:bg-ascend-green-dark transition-colors duration-300"
          fullWidth
        >
          {editingTask ? "Update Task" : "Add Task"}
        </Button>
      </Modal>

      <Modal
        opened={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        title="Complete Task"
      >
        <Text>Are you sure you want to move this task to the completed section?</Text>
        <Group position="right" mt="md">
          <Button onClick={() => setShowCompletionModal(false)}>Cancel</Button>
          <Button color="green" onClick={moveTaskToCompleted}>Confirm</Button>
        </Group>
      </Modal>
    </div>
  );
}
