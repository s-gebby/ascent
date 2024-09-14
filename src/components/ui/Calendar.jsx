import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../styles/custom-calendar.css';
import { getAuth } from 'firebase/auth';
import { readGoals, createGoal } from '../../utils/database';
import Sidebar from '../Sidebar';

const localizer = momentLocalizer(moment);

const CustomEvent = ({ event }) => (
  <div className="custom-event">
    <strong>{event.title}</strong>
    <p>{event.description}</p>
  </div>
);

const CustomToolbar = (toolbar) => {
  const goToBack = () => {
    toolbar.onNavigate('PREV');
  };

  const goToNext = () => {
    toolbar.onNavigate('NEXT');
  };

  const goToCurrent = () => {
    toolbar.onNavigate('TODAY');
  };

  return (
    <div className="rbc-toolbar">
      <button onClick={goToBack}>←</button>
      <button onClick={goToCurrent}>Today</button>
      <button onClick={goToNext}>→</button>
      <span className="rbc-toolbar-label">{toolbar.label}</span>
    </div>
  );
};

export default function GoalCalendar() {
  const [events, setEvents] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const auth = getAuth();

  const fetchGoals = useCallback(async () => {
    if (auth.currentUser) {
      const fetchedGoals = await readGoals(auth.currentUser.uid);
      const goalEvents = Object.entries(fetchedGoals || {}).map(([id, goal]) => ({
        id,
        title: goal.title,
        start: new Date(goal.completeBy),
        end: new Date(goal.completeBy),
        allDay: true,
        resource: goal
      }));
      setEvents(goalEvents);
    }
  }, [auth.currentUser]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleAddGoal = async (newGoal) => {
    await createGoal(auth.currentUser.uid, newGoal);
    fetchGoals();
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    const style = {
      backgroundColor: '#4CAF50',
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    };
    return {
      style: style
    };
  };

  return (
    <div className="flex h-screen">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        setShowNewGoalForm={() => {}}  // Implement this functionality later if needed
      />
      <div className="flex-1 overflow-auto bg-slate-200">
        <header className="bg-white shadow sm:rounded-lg sm:shadow max-w-[220px] mt-6 px-4 ml-8 text-center">
          <div className="py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Goal Calendar</h1>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 'calc(100vh - 200px)' }}
            components={{
              event: CustomEvent,
              toolbar: CustomToolbar,
            }}
            eventPropGetter={eventStyleGetter}
          />
        </main>
      </div>
    </div>
  );
}