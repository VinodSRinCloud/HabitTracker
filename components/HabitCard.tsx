import React from 'react';
import { Habit } from '../types';
import { CheckIcon, FireIcon, CalendarIcon } from './icons';

interface HabitCardProps {
  habit: Habit;
  onComplete: (id: string) => void;
  onToggleCalendar: (id: string) => void;
  isExpanded: boolean;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onComplete, onToggleCalendar, isExpanded }) => {
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completedDates.includes(today);

  return (
    <div className={`
      bg-white dark:bg-slate-800 
      p-4 rounded-xl shadow-md
      flex items-center justify-between
      transition-all duration-300
      hover:shadow-lg hover:scale-[1.01]
      dark:shadow-slate-900/50
      relative
      ${isExpanded ? 'rounded-b-none' : ''}
    `}>
      <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
        <div className={`
          flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full
          transition-colors duration-300
          ${isCompletedToday ? 'bg-emerald-100 dark:bg-emerald-900' : 'bg-slate-100 dark:bg-slate-700'}
        `}>
          <FireIcon className={`
            w-6 h-6 
            transition-colors duration-300
            ${isCompletedToday || habit.streak > 0 ? 'text-orange-500' : 'text-slate-400 dark:text-slate-500'}
          `} />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-slate-800 dark:text-slate-100">{habit.name}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {habit.streak > 0 ? `${habit.streak} day streak` : 'No streak yet'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onToggleCalendar(habit.id)}
          className={`
            w-10 h-10 rounded-full flex items-center justify-center transition-colors
            ${isExpanded ? 'bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'}
          `}
          aria-label="Toggle calendar view"
        >
          <CalendarIcon className="w-5 h-5"/>
        </button>
        <button
          onClick={() => onComplete(habit.id)}
          disabled={isCompletedToday}
          className={`
            w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center 
            transition-all duration-300 ease-in-out
            focus:outline-none focus:ring-4
            ${isCompletedToday
              ? 'bg-emerald-500 text-white cursor-not-allowed'
              : 'bg-white dark:bg-slate-700 text-slate-400 dark:text-slate-300 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 border-2 border-slate-200 dark:border-slate-600'
            }
            focus:ring-emerald-300 dark:focus:ring-emerald-800
          `}
          aria-label={`Complete habit: ${habit.name}`}
        >
          <CheckIcon className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default HabitCard;
