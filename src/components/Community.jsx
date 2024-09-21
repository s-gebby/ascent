import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { readPosts, createPost, encouragePost, readUserData, deletePost } from '../utils/database.js'
import { Avatar, TextInput, Button } from '@mantine/core'
import { motion } from 'framer-motion'
import { HeartIcon, TrashIcon } from '@heroicons/react/24/outline';




export default function Community() {
  const [posts, setPosts] = useState([])
  const [newPostContent, setNewPostContent] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
  const auth = getAuth()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userData = await readUserData(currentUser.uid);
        if (userData && userData.username) {
          setIsUserDataLoaded(true);
        }
        fetchPosts();
      } else {
        setPosts([]);
        setIsUserDataLoaded(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await readPosts()
      setPosts(fetchedPosts || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
      setPosts([])
    }
  }

  const handleCreatePost = async () => {
    if (newPostContent.trim() !== '' && user) {
      try {
        await createPost(user, newPostContent);
        setNewPostContent('');
        fetchPosts();
      } catch (error) {
        console.error('Error creating post:', error);
      }
    }
  }
  
  const handleEncourage = async (postId) => {
    if (user) {
      await encouragePost(postId, user.uid);
      fetchPosts();
    }
  }

  const handleDeletePost = async (postId, authorId) => {
    if (user && user.uid === authorId) {
      try {
        await deletePost(postId);
        fetchPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
      />
      
      <div className="flex-1 overflow-auto bg-white p-6">
        <header className="bg-white border border-gray-200 rounded-xl mb-6 px-4">
          <div className="py-6 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 uppercase">Community</h1>
          </div>
        </header>

        {/* Community Guidelines section */}
        
        {/* Potentially want to make this only show for the first time user, or have a delete (x) button at the top right */}
        <div className="bg-white border border-gray-200 rounded-xl p-16 mb-8 text-center">
            <h2 className="text-xl font-bold text-ascend-black mb-4">Community Guidlines</h2>
            <p className="text-gray-700 leading-relaxed">
                The community is your interactive space designed to foster connection and positivity. 
                Our unique '<span className="text-ascend-orange font-semibold">E</span>
                <span className="text-ascend-pink font-semibold">N</span>
                <span className="text-ascend-blue font-semibold">C</span>
                <span className="text-ascend-green font-semibold">O</span>
                <span className="text-ascend-orange font-semibold">U</span>
                <span className="text-ascend-pink font-semibold">R</span>
                <span className="text-ascend-blue font-semibold">A</span>
                <span className="text-ascend-green font-semibold">G</span>
                <span className="text-ascend-orange font-semibold">E</span>' feature empowers you to uplift and support fellow members, creating 
                an environment where meaningful interactions thrive. Share your insights, experiences, and 
                goals, and watch as the community rallies around you.<br></br><br></br> Together, we're building a platform 
                that doesn't just connect - it elevates.
            </p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-ascend-black mb-4">Share Your Thoughts</h3>
          <div className="flex items-start space-x-4">
            <Avatar src={user?.photoURL} alt={user?.displayName} radius="xl" size="lg" />
            <div className="flex-grow">
              <TextInput
                placeholder="What's on your mind?"
                value={newPostContent}
                onChange={(event) => setNewPostContent(event.currentTarget.value)}
                className="mb-3"
                styles={(theme) => ({
                  input: {
                    '&:focus': {
                      borderColor: theme.colors['ascend-blue'][6],
                    },
                  },
                })}
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleCreatePost} 
                  color="ascend-blue"
                  size="sm"
                  className="transition-all duration-300 hover:bg-opacity-90"
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </div>
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-gray-200 rounded-xl p-6 mb-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <Avatar src={post.authorPhotoURL} alt={post.authorName} radius="xl" size="md" />
                <div className="ml-3">
                  <span className="font-bold text-ascend-blue">{post.authorName}</span>
                  <p className="text-sm text-gray-500">{new Date(post.timestamp).toLocaleString()}</p>
                </div>
              </div>
              <p className="mb-4 text-gray-700">{post.content}</p>
              <div className="flex justify-between items-center">
                <Button 
                  variant="light" 
                  color="ascend-green" 
                  onClick={() => handleEncourage(post.id)}
                  className="hover:bg-ascend-green hover:text-green transition-colors duration-300"
                >
                  <HeartIcon className="h-5 w-5 mr-2 inline-block" />
                  Encourage ({post.encouragements ? Object.keys(post.encouragements).length : 0})
                </Button>
                {user && user.uid === post.authorId && (
                  <Button 
                    variant="subtle" 
                    color="red" 
                    onClick={() => handleDeletePost(post.id, post.authorId)}
                    lefticon={<TrashIcon className="h-5 w-5" />}
                    className="hover:bg-red-100 transition-colors duration-300"
                  >
                    Delete
                  </Button>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <p className="text-gray-700">No posts yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  )
}