import { useState, useEffect } from 'react'
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
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';



export default function GoalPage() {
  const [goals, setGoals] = useState([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentQuote, setCurrentQuote] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const auth = getAuth()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in:", user.uid)
        fetchGoals()
      } else {
        console.log("No user is signed in")
        setGoals([])
      }
    })
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length)
  setCurrentQuote(motivationalQuotes[randomIndex])

    return () => unsubscribe()
  }, [])

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

  const motivationalQuotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "Strive not to be a success, but rather to be of value. - Albert Einstein"
  ];

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
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
      />
      
      <div className="flex-1 overflow-auto bg-gray-200 p-12">
        <header className="bg-ascend-white border border-gray-300 rounded-sm mb-6 px-4 flex justify-between items-center">
          <div className="py-6 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 uppercase">Goals</h1>
          </div>
          <div className="py-6 sm:px-6 lg:px-8 text-sm italic text-gray-600 ml-6 sm:ml-0">
            {currentQuote}
          </div>
        </header>
        
        <div className="flex flex-col gap-6">
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
                      />
                    </Carousel.Slide>
                  ))}
                </Carousel>
              </div>
            </div>
          </div>
        </div>
    </div>  
  )
}