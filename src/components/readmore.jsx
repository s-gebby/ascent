import React from 'react'
import NavBar from './NavBar'
import { Link } from 'react-router-dom';


export default function ReadMore() {
  return (
    <>
      <NavBar />
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-ascend-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
          <h1 className="text-3xl font-bold mb-6 text-ascend-black">More on the Way for Ascend</h1>
          <p className="text-ascend-black leading-relaxed mb-4">
            At Ascend, we're committed to helping you reach new heights in your personal and professional life. Our goal-setting and tracking application is just the beginning of what we have planned.
          </p>
          <p className="text-ascend-black leading-relaxed mb-4">
            In the coming months, we'll be introducing exciting new features to enhance your goal-achieving journey:
          </p>
          <ul className="list-disc list-inside text-ascend-black mb-4">
            <li>AI-powered goal suggestions tailored to your interests and progress</li>
            <li>Integration with popular productivity tools and calendars</li>
            <li>Advanced analytics to help you understand your goal-achieving patterns</li>
            <li>A mentorship program to connect you with experienced goal-setters in your field</li>
          </ul>
          <p className="text-ascend-black leading-relaxed">
            Stay tuned for these updates and more as we continue to develop Ascend into the ultimate goal-achieving platform. Your success is our mission!
          </p>
          <p className="mt-6 flex justify-end text-ascend-black">
            Yours Truly,<br></br>The Ascend Team
          </p>
          <div className="mt-8 text-center">
            <Link
                to="/"
                className="bg-ascend-black rounded-md px-6 py-3 text-sm font-semibold text-ascend-white"
            >
                <span className="mr-2">←</span>
                Back to Ascend
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}