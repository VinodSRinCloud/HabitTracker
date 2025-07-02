import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Habit } from './types';
import { getHabits, saveHabits, calculateStreak } from './services/habitService';
import { getMotivationalQuote } from './services/geminiService';
import HabitCard from './components/HabitCard';
import AddHabitForm from './components/AddHabitForm';
import CalendarView from './components/CalendarView';
import { SparklesIcon } from './components/icons';

const App: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState<string>('');
  const [quote, setQuote] = useState<string | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState<boolean>(false);
  const [expandedHabitId, setExpandedHabitId] = useState<string | null>(null);

  useEffect(() => {
    const loadedHabits = getHabits();
    setHabits(loadedHabits);
  }, []);

  const updateAndSaveHabits = (updatedHabits: Habit[]) => {
    setHabits(updatedHabits);
    saveHabits(updatedHabits);
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const newHabit: Habit = {
      id: uuidv4(),
      name: newHabitName,
      streak: 0,
      completedDates: [],
    };

    updateAndSaveHabits([...habits, newHabit]);
    setNewHabitName('');
  };

  const handleCompleteHabit = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    const habitToUpdate = habits.find(h => h.id === id);

    if (habitToUpdate && !habitToUpdate.completedDates.includes(today)) {
      const updatedDates = [...habitToUpdate.completedDates, today];
      const newStreak = calculateStreak(updatedDates);
      
      const updatedHabits = habits.map(h =>
        h.id === id ? { ...h, completedDates: updatedDates, streak: newStreak } : h
      );

      updateAndSaveHabits(updatedHabits);
    }
  };

  const handleToggleCalendar = (id: string) => {
    setExpandedHabitId(prevId => (prevId === id ? null : id));
  };

  const handleFetchQuote = useCallback(async () => {
    setIsLoadingQuote(true);
    setQuote(null);
    const fetchedQuote = await getMotivationalQuote();
    setQuote(fetchedQuote);
    setIsLoadingQuote(false);
  }, []);
  
  const completedCount = habits.filter(h => h.completedDates.includes(new Date().toISOString().split('T')[0])).length;
  const totalCount = habits.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-200 p-4 sm:p-6 lg:p-8">
      <main className="max-w-2xl mx-auto">
        <header className="text-center my-8 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
            Habit<span className="text-sky-500">Flow</span>
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Your daily path to consistency.</p>
        </header>
        
        <div className="my-6 p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-sm animate-fade-in border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Daily Progress</span>
                <span className="text-sm font-bold text-sky-500">{completedCount} / {totalCount}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                <div className="bg-sky-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
        
        <div className="space-y-4">
          {habits.length > 0 ? (
            habits.map(habit => (
              <div key={habit.id} className="animate-fade-in">
                <HabitCard
                  habit={habit}
                  onComplete={handleCompleteHabit}
                  onToggleCalendar={handleToggleCalendar}
                  isExpanded={expandedHabitId === habit.id}
                />
                {expandedHabitId === habit.id && (
                  <CalendarView completedDates={habit.completedDates} />
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-10 px-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                <p className="text-slate-500 dark:text-slate-400">No habits yet. Let's add one to get started!</p>
            </div>
          )}
        </div>

        <AddHabitForm newHabitName={newHabitName} setNewHabitName={setNewHabitName} onAddHabit={handleAddHabit} />
        
        <div className="mt-12 text-center animate-fade-in">
          <button 
            onClick={handleFetchQuote}
            disabled={isLoadingQuote}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
          >
            <SparklesIcon className="w-5 h-5 text-yellow-500"/>
            {isLoadingQuote ? 'Inspiring you...' : 'Get a Motivation Boost'}
          </button>
          {quote && (
            <div className="mt-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md animate-pop-in">
                <p className="italic text-slate-600 dark:text-slate-300">"{quote}"</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
