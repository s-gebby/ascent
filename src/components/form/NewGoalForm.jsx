import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "../../styles/datepicker-custom.css";

import { motion } from 'framer-motion';
import { TextInput, Textarea, Checkbox, Button } from '@mantine/core';
import { useForm } from '@mantine/form';

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
      <div className="md:flex ">
        <form onSubmit={form.onSubmit(handleSubmit)} className="p-6 space-y-4 md:w-2/3 ">
          <h2 className="text-xl font-bold text-ascend-green uppercase mb-6 font-archivo-black">Create New Goal</h2>
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1 font-archivo-black ">Goal Title</label>
            <TextInput
              id="title"
              placeholder="Enter your goal title"
              {...form.getInputProps('title')}
              className="w-full p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 font-archivo"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 font-archivo-black">Goal Description</label>
            <Textarea
              id="description"
              placeholder="Describe your goal"
              {...form.getInputProps('description')}
              className="w-full p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 font-archivo"
            />
          </div>

          {form.errors && (
            <p className="text-ascend-pink text-sm font-archivo">{Object.values(form.errors)[0]}</p>
          )}

          <div className="flex flex-col items-end mt-8">
            <div className="flex items-center m-3">
              <label htmlFor="dailyGoal" className="mr-1 text-sm font-semibold text-ascend-black">Daily Goal</label>
              <Checkbox
                id="dailyGoal"
                {...form.getInputProps('isDailyGoal', { type: 'checkbox' })}
                color="ascend-green"
                className="w-2 h-5 bg-gray-100 border-gray-900 rounded focus:ring-ascend-blue focus:ring-2"
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
            <label htmlFor="completeBy" className="block text-sm font-medium text-ascend-black mb-1 font-archivo-black capitalize text-center">Complete By</label>
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