import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import { getAuth } from 'firebase/auth'
import { ref, push, onValue, remove } from 'firebase/database'
import { database } from '../firebaseConfig'

export default function Journal() {
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
  const handleDelete = (entryId) => {
    if (auth.currentUser) {
      const entryRef = ref(database, `journal/${auth.currentUser.uid}/${entryId}`)
      remove(entryRef)
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">My Journal</h1>
            <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
              <form onSubmit={handleSubmit} className="mb-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </main>
      </div>
    </div>
  )
}
