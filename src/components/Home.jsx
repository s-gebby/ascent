import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from './NavBar';

export default function Home() {
  return (
    <>
      <NavBar />
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-700 ring-1 ring-gray-900/30 hover:ring-gray-900/60">
              More on the way...{' '}
              <Link to="/readmore" className="font-semibold text-ascend-blue">
                <span aria-hidden="true" className="absolute inset-0" />
                Read more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-ascend-black sm:text-5xl">
            ASCEND<br />
            </h1>
            <p className="mt-6 text-lg leading-8 text-ascend-black font-semibold">
              Build your goals, Track your goals, Conquer your goals.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/signup"
                className="rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
              >
                Get started
              </Link>
              <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900">
                Log in <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}