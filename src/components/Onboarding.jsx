import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig';
import { writeUserData } from '../utils/database';
import { motion } from 'framer-motion';
import { CameraIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setProfilePic(e.target.files[0]);
      setPreviewURL(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleNextStep = () => {
    if (step === 1 && username) {
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (user) {
      let photoURL = '';
      if (profilePic) {
        const storageRef = ref(storage, `profilePics/${user.uid}`);
        await uploadBytes(storageRef, profilePic);
        photoURL = await getDownloadURL(storageRef);
      }

      await updateProfile(user, {
        displayName: username,
        photoURL: photoURL
      });

      await writeUserData(user.uid, username, user.email, photoURL);
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 p-8"
      >
        <div className="max-w-4xl mx-auto bg-white rounded-sm shadow-xl overflow-hidden">
          <div className="px-8 py-6 bg-ascend-black text-white">
            <h2 className="text-2xl font-bold">Welcome to Ascend</h2>
            <p className="mt-2 text-sm text-ascend-blue-light">Let's set up your profile in 2 easy steps!</p>
          </div>
          
          <div className="p-8">
            <div className="mb-8 flex justify-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-ascend-green text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
            <div className="ml-4 mr-8">
                <p className="font-semibold">Choose Username</p>
                <p className="text-sm text-gray-500">Pick a unique identifier</p>
            </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-ascend-black text-white' : 'bg-gray-200 text-gray-500'}`}>2
              </div>
            <div className="ml-4">
                <p className="font-semibold">Add Profile Picture</p>
                <p className="text-sm text-gray-500">Upload your best photo</p>
            </div>
            </div>

            {step === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-semibold mb-4">Step 1: Choose Your Username</h3>
                <div className="flex items-center space-x-2">
                  <div className="flex-grow">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="mt-1 block w-1/3 rounded-md border border-2 border-gray-300 "
                    />
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleNextStep}
                    disabled={!username}
                    className="px-6 py-2 bg-ascend-green text-white rounded-md shadow hover:bg-ascend-green-dark focus:outline-none focus:ring-2 focus:ring-ascend-green text-xs focus:ring-opacity-50 transition-colors flex items-center"
                  >
                    Next <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-semibold mb-4">Step 2: Add a Profile Picture</h3>
                <div className="mb-8 text-center">
                  <div className="relative inline-block">
                    <img 
                      src={previewURL || 'https://t3.ftcdn.net/jpg/06/33/54/78/360_F_633547842_AugYzexTpMJ9z1YcpTKUBoqBF0CUCk10.jpg'} 
                      alt="Profile" 
                      className="h-32 w-32 rounded-full object-cover shadow-lg"
                    />
                    <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-ascend-white text-black p-2 rounded-full cursor-pointer">
                      <CameraIcon className="h-6 w-6" />
                      <input id="profile-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                    </label>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-ascend-green text-white rounded-md shadow hover:bg-ascend-green-dark focus:outline-none focus:ring-2 focus:ring-ascend-green text-xs focus:ring-opacity-50 transition-colors"
                  >
                    Complete Profile
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;