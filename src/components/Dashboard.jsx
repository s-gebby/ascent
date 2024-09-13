import { useState, useEffect } from 'react'
import GoalCard from './GoalCard'
import NewGoalForm from './NewGoalForm'
import Sidebar from './Sidebar'

import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { readGoals, createGoal, updateGoal, deleteGoal } from '../utils/database'
export default function Dashboard() {
  const [goals, setGoals] = useState([])
  const [showNewGoalForm, setShowNewGoalForm] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const auth = getAuth()

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in:", user.uid)
        fetchGoals()
      } else {
        console.log("No user is signed in")
        setGoals([])
      }
    })

    return () => unsubscribe()
  }, [])

  const fetchGoals = async () => {
    const auth = getAuth()
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
    const auth = getAuth();
    if (auth.currentUser) {
      const goalId = await createGoal(auth.currentUser.uid, newGoal);
      setGoals(prevGoals => [...prevGoals, { id: goalId, ...newGoal }]);
      setShowNewGoalForm(false);
    }
  };
  
  const handleEditGoal = (goal) => {
    // Implement edit functionality
    console.log('Edit goal:', goal)
  }

  const handleDeleteGoal = (goalId) => {
    setGoals(goals.filter(goal => goal.id !== goalId))
  }
  return (
    <div className="flex h-screen">
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden fixed top-4 right-4 p-2 bg-ascend-black text-white rounded font-archivo font-semibold text-sm" 
      >
        Menu
      </button>
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        setShowNewGoalForm={setShowNewGoalForm}
      />
      
      <div className="flex-1 overflow-auto bg-slate-200">
      <header className="bg-white shadow sm:rounded-lg sm:shadow max-w-[220px] mt-6 px-4 ml-8 text-center">
  <div className="py-6 sm:px-6 lg:px-8">
    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Goals</h1>
  </div>
</header>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {showNewGoalForm && (
            <NewGoalForm 
              onAddGoal={(newGoal) => {
                handleAddGoal(newGoal)
                setShowNewGoalForm(false)
              }} 
              onCancel={() => setShowNewGoalForm(false)}
            />
          )}
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
        </main>
      </div>
    </div>
  )
}