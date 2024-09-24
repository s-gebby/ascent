import { useState, useEffect } from 'react'
import GoalCard from './GoalCard'
import NewGoalForm from './form/NewGoalForm'
import Sidebar from './Sidebar'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { readGoals, createGoal, updateGoal, deleteGoal } from '../utils/database'

export default function Dashboard() {
  const [goals, setGoals] = useState([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentQuote, setCurrentQuote] = useState('')
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

  return (
    <div className="flex h-screen">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
      />
      
      <div className="flex-1 overflow-auto bg-white p-6">
        <header className="bg-ascend-white border border-gray-300 rounded-xl mb-6 px-4 flex justify-between items-center">
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
          
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {goals.map(goal => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onEdit={handleEditGoal}
                  onDelete={handleDeleteGoal}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
