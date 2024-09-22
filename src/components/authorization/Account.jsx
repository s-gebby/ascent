import { useState, useEffect } from 'react'
import { useAuth } from "../../contexts/AuthContext.jsx";

import { readUserData, updateUserData } from '../../utils/database'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { updateProfile } from 'firebase/auth'
import Sidebar from '../Sidebar.jsx';

export default function Account() {
  const { currentUser } = useAuth()
  const [userData, setUserData] = useState(null)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [profilePicture, setProfilePicture] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const data = await readUserData(currentUser.uid)
        setUserData(data)
        setUsername(data.username || '')
        setEmail(currentUser.email)
      }
    }
    fetchUserData()
  }, [currentUser])

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setProfilePicture(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!currentUser) return

    setIsLoading(true)
    setError('')

    try {
      let photoURL = currentUser.photoURL

      if (profilePicture) {
        const storage = getStorage()
        const fileRef = storageRef(storage, `profilePictures/${currentUser.uid}`)
        await uploadBytes(fileRef, profilePicture)
        photoURL = await getDownloadURL(fileRef)
      }

      const updates = {
        username,
        email,
      }

      await updateUserData(currentUser.uid, updates)
      await updateProfile(currentUser, { displayName: username, photoURL })

      if (password) {
        // Implement password change logic here
        // You might want to use Firebase's updatePassword method
      }

      setIsEditing(false)
    } catch (error) {
      setError('Failed to update profile. Please try again.')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!userData) return <div className="flex justify-center items-center h-screen">Loading...</div>
  return (
    <div className="flex">
      <Sidebar isOpen={true} setIsOpen={() => {}} />
      <div className="flex-1 min-h-screen bg-ascend-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white border border-gray-300 rounded-xl overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Account Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and account management.</p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-ascend-black">Profile Picture</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <img src={currentUser.photoURL || 'https://via.placeholder.com/150'} alt="Profile" className="h-24 w-24 rounded-full object-cover" />
                  {isEditing && (
                    <input type="file" onChange={handleFileChange} className="mt-2" />
                  )}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-ascend-black">Username</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="shadow-sm focus:ring-ascend-blue focus:border-ascend-blue block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  ) : (
                    userData.username
                  )}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-ascend-black">Email address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  ) : (
                    currentUser.email
                  )}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-ascend-black">Member since</dt>
                <dd className="mt-1 text-sm font-bold text-ascend-blue sm:mt-0 sm:col-span-2">
                  {new Date(currentUser.metadata.creationTime).toLocaleDateString()}
                </dd>
              </div>
              {isEditing && (
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">New Password</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Leave blank to keep current password"
                    />
                  </dd>
                </div>
              )}
            </dl>
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            {isEditing ? (
              <>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-ascend-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}