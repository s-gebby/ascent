import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "../../styles/datepicker-custom.css";


import { motion } from 'framer-motion';
import { TextInput, Textarea, Checkbox, Button, Group, Stack, Paper, Autocomplete } from '@mantine/core';
import { useForm } from '@mantine/form';
import Autosuggest from 'react-autosuggest';

export default function NewGoalForm({ onAddGoal, onCancel }) {
  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      completeBy: null,
      isDailyGoal: false,
      milestones: [],
    },
    validate: {
      title: (value) => (value ? null : 'Title is required'),
      description: (value) => (value ? null : 'Description is required'),
      completeBy: (value, values) => 
        (!values.isDailyGoal && !value) ? 'Please select a completion date or mark as a daily goal' : null,
    },
  });

  const [titleSuggestions, setTitleSuggestions] = useState([]);
  const [descriptionSuggestions, setDescriptionSuggestions] = useState([]);

  const titleSuggestionsList = [
    'Achieve a fitness goal', 'Attend a workshop', 'Adopt a new hobby', 
    'Bake a new dessert', 'Build a piece of furniture', 'Bike across the city', 
    'Create a personal website', 'Cultivate a garden', 'Complete a 30-day challenge', 
    'Develop a mobile app', 'Dive into photography', 'Design your own clothing', 
    'Explore a new city', 'Enter a competition', 'Eat healthier for a month', 
    'Find a mentor', 'Finish a puzzle', 'Focus on meditation', 
    'Go on a road trip', 'Grow a new skill', 'Give a public speech', 
    'Host a podcast', 'Help out at a shelter', 'Hike a mountain trail', 
    'Invest in stocks', 'Incorporate daily exercise', 'Improve your communication skills', 
    'Join a book club', 'Juggle for five minutes', 'Jump into cold water', 
    'Keep a fitness journal', 'Kite surf at the beach', 'Knock out your reading list', 
    'Learn to code', 'Lead a team project', 'Launch a startup', 
    'Master a musical instrument', 'Mentor someone new', 'Meditate daily for a month', 
    'Nurture a new friendship', 'Network with professionals', 'Navigate a new career path', 
    'Organize a community event', 'Optimize your workspace', 'Open a side business', 
    'Plan a solo trip', 'Paint your first canvas', 'Publish an article online', 
    'Quit a bad habit', 'Qualify for a sports event', 'Quiz yourself on new topics', 
    'Run a marathon', 'Read a book every week', 'Renovate a room in your house', 
    'Start a podcast', 'Save for a dream vacation', 'Strengthen your mental health', 
    'Teach a workshop', 'Train for a triathlon', 'Take a cooking class', 
    'Update your resume', 'Unplug from technology for a day', 'Undertake a leadership role', 
    'Volunteer at a local charity', 'Visit a national park', 'Venture into photography', 
    'Write a short story', 'Walk 10,000 steps a day', 'Work on a DIY project', 
    'Xplore new cultures', 'Xperiment with new recipes', 'Xperience skydiving', 
    'Yoga every morning', 'Yarn your own sweater', 'Yearn to learn new skills', 
    'Zest up your cooking skills', 'Zoom in on your goals', 'Zone out with meditation'
  ];
  const descriptionSuggestionsList = [
    'Achieving this will help me grow', 'Adopting this habit will benefit me', 'Aiming for personal success', 
    'Building this skill will be fulfilling', 'Breaking new ground will be rewarding', 'Becoming a better version of myself', 
    'Creating good habits is my goal', 'Cultivating growth is essential', 'Challenging myself for improvement', 
    'Developing new perspectives excites me', 'Driving towards success motivates me', 'Dedicating time to my passion', 
    'Exploring new challenges motivates me', 'Excelling in this will empower me', 'Embracing change for growth', 
    'Fostering personal development is key', 'Fulfilling my potential step by step', 'Finding new ways to improve', 
    'Gaining new skills is essential for my growth', 'Giving my best in everything I do', 'Growing into a stronger person', 
    'Helping others is important to me', 'Harnessing opportunities for success', 'Honing my skills every day', 
    'I’m eager to expand my knowledge', 'Investing in myself for a better future', 'Improving myself consistently', 
    'Joining new circles will expand my network', 'Jumpstarting my day with focus', 'Journaling helps me reflect and improve', 
    'Keeping organized is a priority', 'Keen to learn and grow', 'Kicking off new projects excites me', 
    'Learning something new is rewarding', 'Leading myself to success', 'Letting go of distractions to focus', 
    'Making progress on this goal is important', 'Motivating myself with new goals', 'Maximizing my potential every day', 
    'Navigating challenges helps me grow', 'Nurturing my creativity through learning', 'Never backing down from a challenge', 
    'Opening myself to new ideas will help', 'Optimizing my routines for success', 'Overcoming obstacles builds character', 
    'Planning for success is key', 'Practicing new skills daily', 'Pushing my limits for growth', 
    'Quiet time for reflection is valuable', 'Quenching my thirst for knowledge', 'Qualifying my efforts to improve', 
    'Reaching my full potential is the goal', 'Rising to new challenges with excitement', 'Refining my skills every day', 
    'Setting goals helps me stay focused', 'Succeeding through consistent effort', 'Striving for personal improvement', 
    'Taking action steps leads to success', 'Training myself for success', 'Tackling big goals head-on', 
    'Understanding this skill will benefit me', 'Unlocking my true potential', 'Upgrading my skillset with effort', 
    'Volunteering helps others and myself', 'Vigorously pursuing new challenges', 'Valuing personal growth every day', 
    'Working hard towards my goals is rewarding', 'Willingness to step out of my comfort zone', 'Winning at life through hard work', 
    'Xperiencing new adventures will help me grow', 'Xcelling at new challenges excites me', 'Xpressing myself creatively', 
    'Yielding positive results from this effort', 'Yearning to become better every day', 'Yarning for knowledge pushes me forward', 
    'Zeroing in on my priorities helps me succeed', 'Zipping through tasks with efficiency', 'Zoning in on my focus every day'
  ];

  const getSuggestions = (value, suggestionsList) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : suggestionsList.filter(suggestion =>
      suggestion.toLowerCase().slice(0, inputLength) === inputValue
    );
  };

  const handleSubmit = (values) => {
    onAddGoal({
      ...values,
      createdAt: new Date().toISOString(),
    });
    form.reset();
  };

  return (
    <motion.div 
      className="bg-white shadow-lg rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="md:flex">
        <form onSubmit={form.onSubmit(handleSubmit)} className="p-6 space-y-4 md:w-2/3">
          <h2 className="text-xl font-bold text-ascend-green uppercase mb-6 font-archivo-black">Create New Goal</h2>
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1 font-archivo-black">Goal Title</label>
            <Autosuggest
              suggestions={titleSuggestions}
              onSuggestionsFetchRequested={({ value }) => setTitleSuggestions(getSuggestions(value, titleSuggestionsList))}
              onSuggestionsClearRequested={() => setTitleSuggestions([])}
              getSuggestionValue={suggestion => suggestion}
              renderSuggestion={suggestion => <div>{suggestion}</div>}
              inputProps={{
                placeholder: 'Enter your goal title',
                value: form.values.title,
                onChange: (_, { newValue }) => form.setFieldValue('title', newValue),
                className: "w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 font-archivo"
              }}
              theme={{
                container: 'relative',
                suggestionsContainer: 'absolute mt-1 bg-black bg-opacity-80 rounded-md shadow-lg',
                suggestionsList: 'py-1 text-base',
                suggestion: 'px-4 py-2 hover:bg-gray-700 cursor-pointer text-white',
              }}
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 font-archivo-black">Describe your goal</label>
            <Autosuggest
              suggestions={descriptionSuggestions}
              onSuggestionsFetchRequested={({ value }) => setDescriptionSuggestions(getSuggestions(value, descriptionSuggestionsList))}
              onSuggestionsClearRequested={() => setDescriptionSuggestions([])}
              getSuggestionValue={suggestion => suggestion}
              renderSuggestion={suggestion => <div>{suggestion}</div>}
              inputProps={{
                placeholder: 'Describe your goal',
                value: form.values.description,
                onChange: (_, { newValue }) => form.setFieldValue('description', newValue),
                className: "w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 font-archivo"
              }}
            />
          </div>

          {form.errors && (
            <p className="text-ascend-pink text-sm font-archivo">{Object.values(form.errors)[0]}</p>
          )}

          <div className="flex flex-col items-end mt-8">
            <div className="flex items-center m-3">
              <label htmlFor="dailyGoal" className="mr-1 text-sm font-semibold text-ascend-green">Daily Goal</label>
              <Checkbox
                id="dailyGoal"
                {...form.getInputProps('isDailyGoal', { type: 'checkbox' })}
                className="w-2 h-5 text-ascend-pink bg-gray-100 border-gray-900 rounded focus:ring-ascend-blue focus:ring-2"
              />
            </div>
            <Button 
              type="submit" 
              className="bg-ascend-blue text-white font-bold font-archivo-black transition duration-200"
            >
              Add Goal
            </Button>
          </div>
          </form>

        <div className="md:w-1/3 bg-gray-100 p-6 flex items-center justify-center">
          <div>
            <label htmlFor="completeBy" className="block text-sm font-medium text-ascend-orange mb-1 font-archivo-black capitalize">Complete by:</label>
            <DatePicker
              id="completeBy"
              selected={form.values.completeBy}
              onChange={(date) => form.setFieldValue('completeBy', date)}
              inline
              className="rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}