import { Link } from "react-router-dom"
import React from "react"

export default function Company() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="bg-ascend-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <Link to="/" className="absolute top-4 left-4 text-ascend-black">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <h1 className="text-3xl font-bold mb-6 text-ascend-black">Humble Beginnings</h1>
        <p className="text-ascend-black text-sm leading-relaxed mb-4">
        Hello! I'm Silas, the creator of Ascend, and my journey has been one of transformation. In 2020, I dropped out of school, leaving behind a lifestyle focused on parties and socializing, with no clear direction for my future. I moved back home, unsure of what to do next, but I always had a curiosity for coding that I’d never fully pursued. After some self-reflection, I decided to take control of my life and joined a coding bootcamp, determined to learn the skills I had once written off as too difficult.<br></br>
        </p>
        <p className="text-ascend-black text-sm leading-relaxed mb-4">That decision changed everything. I discovered not only a passion for technology but also a clear sense of purpose—to help others achieve their goals and grow through the same kind of focus and determination that I found. This led to the creation of Ascend, an application designed to empower people to track their goals and elevate themselves to new heights.</p>
        <p className="text-ascend-black text-sm font-archivo-black leading-relaxed text-center">My mission is now clear:<br></br> To thrive in the tech space and help others ascend in their own lives.</p>
      </div>
    </div>
  )
}
