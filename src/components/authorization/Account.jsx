import { useState, useEffect } from 'react'
import { useAuth } from "../../contexts/AuthContext.jsx";
import { readUserData, updateUserData } from '../../utils/database'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { updateProfile } from 'firebase/auth'
import Sidebar from '../Sidebar.jsx';
import { motion } from 'framer-motion';
import { CameraIcon, UserCircleIcon, EnvelopeIcon, CalendarIcon, LockClosedIcon } from '@heroicons/react/24/outline';



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
    <div className="flex bg-gray-200 min-h-screen">
      <Sidebar isOpen={true} setIsOpen={() => {}} />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 p-8"
      >
        <div className="max-w-4xl mx-auto bg-white rounded-sm shadow-xl overflow-hidden">
          <div className="px-8 py-6 bg-ascend-black text-white">
            <h2 className="text-2xl font-bold">Account Information</h2>
            <p className="mt-2 text-sm text-ascend-blue-light">Manage your personal details and account settings</p>
          </div>
          
          <div className="p-8">
            <div className="mb-8 text-center">
              <div className="relative inline-block">
                <img 
                  src={currentUser.photoURL || 'https://via.placeholder.com/150'} 
                  alt="Profile" 
                  className="h-32 w-32 rounded-full object-cover shadow-lg"
                />
                {isEditing && (
                  <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-ascend-white text-black p-2 rounded-full cursor-pointer">
                    <CameraIcon className="h-6 w-6" />
                    <input id="profile-upload" type="file" className="hidden" onChange={handleFileChange} />
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <AccountField 
                icon={<UserCircleIcon className="h-6 w-6 text-ascend-blue" />}
                label="Username"
                value={userData.username}
                isEditing={isEditing}
                editComponent={
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ascend-blue focus:ring focus:ring-ascend-blue focus:ring-opacity-50"
                  />
                }
              />

              <AccountField 
                icon={<EnvelopeIcon className="h-6 w-6 text-ascend-blue" />}
                label="Email address"
                value={currentUser.email}
                isEditing={isEditing}
                editComponent={
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ascend-blue focus:ring focus:ring-ascend-blue focus:ring-opacity-50"
                  />
                }
              />

              <AccountField 
                icon={<CalendarIcon className="h-6 w-6 text-ascend-blue" />}
                label="Member since"
                value={new Date(currentUser.metadata.creationTime).toLocaleDateString()}
              />

              {isEditing && (
                <AccountField 
                  icon={<LockClosedIcon className="h-6 w-6 text-ascend-blue" />}
                  label="New Password"
                  isEditing={true}
                  editComponent={
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ascend-blue focus:ring focus:ring-ascend-blue focus:ring-opacity-50"
                      placeholder="Leave blank to keep current password"
                    />
                  }
                />
              )}
            </div>

            {error && (
              <div className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                <p>{error}</p>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="px-6 py-2 bg-ascend-green text-white rounded-md shadow hover:bg-ascend-green-dark focus:outline-none focus:ring-2 focus:ring-ascend-green text-xs focus:ring-opacity-50 transition-colors"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="ml-4 px-6 py-2 bg-gray-200 text-xs text-gray-700 rounded-md shadow hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-ascend-black text-xs text-white rounded-md shadow focus:outline-none focus:ring-2 focus:ring-ascend-blue focus:ring-opacity-50 transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function AccountField({ icon, label, value, isEditing, editComponent }) {
  return (
    <div className="flex items-center space-x-4">
      {icon}
      <div className="flex-grow">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {isEditing && editComponent ? editComponent : (
          <p className="mt-1 text-sm text-gray-900">{value}</p>
        )}
      </div>
    </div>
  )
}