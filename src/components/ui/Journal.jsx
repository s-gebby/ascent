import { useState, useEffect } from 'react'
import Sidebar from '../Sidebar'
import { getAuth } from 'firebase/auth'
import { ref, push, onValue, remove } from 'firebase/database'
import { database } from '../../firebaseConfig'

export default function Journal() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [entries, setEntries] = useState([])
  const [newEntry, setNewEntry] = useState('')
  const auth = getAuth()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const entriesRef = ref(database, `users/${auth.currentUser.uid}/journal`)
        onValue(entriesRef, (snapshot) => {
          const data = snapshot.val()
          if (data) {
            const entriesArray = Object.entries(data).map(([key, value]) => ({
              id: key,
              ...value
            }))
            setEntries(entriesArray)
          }
        })
      } else {
        setEntries([])
      }
    })

    return () => unsubscribe()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (newEntry.trim() && auth.currentUser) {
      try {
        const entriesRef = ref(database, `users/${auth.currentUser.uid}/journal`)
        await push(entriesRef, {
          text: newEntry,
          date: new Date().toISOString()
        })
        setNewEntry('')
      } catch (error) {
        console.error("Error adding entry:", error)
      }
    }
  }
  const handleDelete = async (entryId) => {
    if (auth.currentUser) {
      try {
        const entryRef = ref(database, `users/${auth.currentUser.uid}/journal/${entryId}`)
        await remove(entryRef)
      } catch (error) {
        console.error("Error deleting entry:", error)
      }
    }
  }
  return (
    <div className="flex h-screen">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
      />
      
      <div className="flex-1 overflow-auto bg-slate-200 p-6">
        <header className="bg-white shadow sm:rounded-lg sm:shadow mb-6 px-4 flex justify-between items-center">
          <div className="py-6 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 uppercase">My Journal</h1>
          </div>
        </header>
        
        <div className="flex flex-col gap-6">
          <div className="w-full">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl p-6 mb-6">
              <textarea
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-green-500"
                rows="4"
                placeholder="Write your thoughts..."
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
              ></textarea>
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
              >
                Save Entry
              </button>
            </form>
          </div>
          
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {entries.map((entry) => (
                <div key={entry.id} className="bg-white rounded-lg shadow-md p-6">
                  <p className="text-gray-800 mb-2">{entry.text}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(entry.date).toLocaleString()}
                  </p>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="mt-4 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}