import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { readPosts, createPost, encouragePost, readUserData } from '../utils/database.js'
import { Avatar, TextInput, Button } from '@mantine/core'
import { motion } from 'framer-motion'

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

  return (
    <div className="flex h-screen">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
      />
      
      <div className="flex-1 overflow-auto bg-slate-200 p-6">
        <header className="bg-white shadow sm:rounded-lg sm:shadow mb-6 px-4">
          <div className="py-6 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 uppercase">Community</h1>
          </div>
        </header>
        
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <TextInput
            placeholder="What's on your mind?"
            value={newPostContent}
            onChange={(event) => setNewPostContent(event.currentTarget.value)}
            className="mb-2"
          />
                  <Button 
                    onClick={handleCreatePost} 
                    color="ascend-blue"
                  >
                    Post
                  </Button>
                </div>
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow p-4 mb-4"
            >
              <div className="flex items-center mb-2">
                <Avatar src={post.authorPhotoURL} alt={post.authorName} radius="xl" />
                <span className="ml-2 font-bold">{post.authorName}</span>
              </div>
              <p className="mb-2">{post.content}</p>
              <div className="flex justify-between">
                <Button variant="subtle" color="ascend-green" onClick={() => handleEncourage(post.id)}>
                  Encourage ({post.encouragements ? Object.keys(post.encouragements).length : 0})
                </Button>
              </div>
            </motion.div>
          ))
        ) : (
          <p>No posts yet. Be the first to post!</p>
        )}
      </div>
    </div>
  )
}
