import React, { useState, useMemo } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface CalendarViewProps {
    completedDates: string[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ completedDates }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const completedSet = useMemo(() => new Set(completedDates), [completedDates]);

    const changeMonth = (amount: number) => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() + amount);
            return newDate;
        });
    };

    const calendarGrid = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const days = [];
        // Add empty cells for days before the first of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null);
        }
        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }
        return days;
    }, [currentDate]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-b-xl shadow-md -mt-1 animate-fade-in border-t border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-3">
                <button 
                    onClick={() => changeMonth(-1)}
                    className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                    aria-label="Previous month"
                >
                    <ChevronLeftIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </button>
                <h3 className="font-semibold text-slate-700 dark:text-slate-200">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <button 
                    onClick={() => changeMonth(1)}
                    className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                    aria-label="Next month"
                >
                    <ChevronRightIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                    <div key={day} className="font-medium text-slate-400 dark:text-slate-500">{day}</div>
                ))}
                {calendarGrid.map((day, index) => {
                    if (!day) return <div key={`empty-${index}`}></div>;
                    
                    const dateString = day.toISOString().split('T')[0];
                    const isCompleted = completedSet.has(dateString);
                    const isToday = day.getTime() === today.getTime();

                    return (
                        <div key={dateString} className="flex justify-center items-center h-8">
                             <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center
                                ${isCompleted ? 'bg-emerald-500 text-white font-bold' : ''}
                                ${!isCompleted && isToday ? 'bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-300' : ''}
                                ${!isCompleted && !isToday ? 'text-slate-600 dark:text-slate-300' : ''}
                             `}>
                                {day.getDate()}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default CalendarView;
