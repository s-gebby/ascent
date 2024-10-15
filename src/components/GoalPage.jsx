import { useState, useEffect } from 'react'
import Confetti from 'react-confetti'
import { Modal } from '@mantine/core'
import GoalCard from './GoalCard'
import NewGoalForm from './form/NewGoalForm'
import Sidebar from './Sidebar'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { readGoals, createGoal, updateGoal, deleteGoal } from '../utils/database'
import { Carousel } from '@mantine/carousel'
import { TextInput } from '@mantine/core'
import { Search } from 'tabler-icons-react'
import '@mantine/carousel/styles.css';
import '@mantine/carousel/styles.css';
import { ChevronLeftIcon, ChevronRightIcon, BellIcon, UserCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';


export default function GoalPage() {
  const [user, setUser] = useState(null)
  const [goals, setGoals] = useState([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [completedGoal, setCompletedGoal] = useState(null)
  const navigate = useNavigate()
  const auth = getAuth()
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        console.log("User is signed in:", currentUser.uid)
        fetchGoals()
      } else {
        console.log("No user is signed in")
        setGoals([])
      }
    })

    return () => unsubscribe()
  }, [])

  const handleGoalComplete = (goal) => {
    setShowConfetti(true)
    setCompletedGoal(goal)
    setIsModalOpen(true)
    setTimeout(() => {
      setShowConfetti(false)
    }, 6000)
  }
  const fetchGoals = async () => {
    if (auth.currentUser) {
      try {
        console.log("Current user UID:", auth.currentUser.uid)
        const fetchedGoals = await readGoals(auth.currentUser.uid)
        if (fetchedGoals) {
          setGoals(Object.entries(fetchedGoals).map(([id, goal]) => ({ id, ...goal })))
        } else {
          setGoals([])
        }
      } catch (error) {
        console.error("Error fetching goals:", error)
      }
    } else {
      console.log("No authenticated user")
    }
  }

  const handleAddGoal = async (newGoal) => {
    if (auth.currentUser) {
      const goalId = await createGoal(auth.currentUser.uid, newGoal);
      setGoals(prevGoals => [...prevGoals, { id: goalId, ...newGoal }]);
    }
  };
  
  const handleEditGoal = (goal) => {
    // Implement edit functionality
    console.log('Edit goal:', goal)
  }

  const handleDeleteGoal = (goalId) => {
    setGoals(goals.filter(goal => goal.id !== goalId))
  }

  const filteredGoals = goals.filter(goal =>
    goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    goal.description.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  const CustomPrevControl = ({ onClick }) => (
    <button 
      onClick={onClick} 
      className="absolute left-[-60px] top-1/2 -translate-y-1/2 bg-ascend-black rounded-full p-2 shadow-lg hover:bg-ascend-blue transition-all duration-300 z-10"
    >
      <ChevronLeftIcon className="h-6 w-6 text-ascend-white" />
    </button>
  );
  
  const CustomNextControl = ({ onClick }) => (
    <button 
      onClick={onClick} 
      className="absolute right-[-70px] top-1/2 -translate-y-1/2 bg-ascend-black rounded-full p-2 shadow-lg hover:bg-ascend-blue transition-all duration-300 z-10"
    >
      <ChevronRightIcon className="h-6 w-6 text-ascend-white" />
    </button>
  );
  return (
    <div className="flex h-screen">
      {showConfetti && <Confetti />}
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
      />
      
    
      <div className="flex-1 overflow-auto bg-ascend-white">
      <header className="bg-white z-10 p-4 shadow-md">
        <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-center">
          <h2 className="text-2xl font-semibold text-ascend-black">Goals</h2>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 items-center">
            <div className="w-full sm:w-auto">
              <input
                type="text"
                placeholder="Find..."
                className="w-full sm:w-auto pl-2 pr-8 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ascend-green focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <p className="text-xs font-bold text-ascend-black">
                  Welcome, {user.displayName || 'Goal Ascender'}!
                </p>
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
                  className="h-8 w-8 text-gray-600 cursor-pointer transition-all duration-300 hover:ring-2 hover:ring-ascend-green rounded-full" 
                  onClick={() => navigate('/account')}
                />
              )}
              <BellIcon className="h-6 w-6 text-gray-600 "/>
            </div>
          </div>
        </div>
      </header>
        
        <div className="flex flex-col gap-6 p-8">
          <div className="w-full">
            <NewGoalForm onAddGoal={handleAddGoal} />
          </div>
        
          <TextInput
            placeholder="Search Title/Description"
            icon={<Search size={14} />}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.currentTarget.value)}
            className="mb-1 mx-auto"
          />
          <div className="w-full">
              <div className="group relative">
                <Carousel
                  slideSize="33.333333%"
                  slideGap="md"
                  align="start"
                  slidesToScroll={1}
                  loop
                  withControls={filteredGoals.length > 3}
                  nextControlIcon={<CustomNextControl />}
                  previousControlIcon={<CustomPrevControl />}
                  styles={{
                    control: {
                      '&[dataInactive]': {
                        opacity: 0,
                        cursor: 'default',
                      },
                    },
                  }}
                  classNames={{
                    root: 'carousel-root mx-12 relative',
                  }}
                >
                  {filteredGoals.map(goal => (
                    <Carousel.Slide key={goal.id} className="px-2">
                      <GoalCard
                        goal={goal}
                        onEdit={handleEditGoal}
                        onDelete={handleDeleteGoal}
                        onComplete={handleGoalComplete}
                      />
                    </Carousel.Slide>
                  ))}
                </Carousel>
              </div>
            </div>
          </div>
        </div>
        <Modal
          opened={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={<h2 className="text-2xl font-bold text-ascend-black">Goal Completed!</h2>}
          size="lg"
          centered
          classNames={{
            header: 'bg-ascend-white p-4',
            body: 'p-6',
            close: 'text-ascend-blue hover:bg-ascend-blue hover:bg-opacity-10 transition-colors duration-200',
          }}
        >
          <div className="text-center">
            <div className="mb-4">
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-ascend-black">{completedGoal?.title}</h3>
            <p className="mb-4 text-ascend-black">{completedGoal?.description}</p>
          </div>
        </Modal>
    </div>
  )}
