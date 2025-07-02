
import React from 'react';
import { PlusIcon } from './icons';

interface AddHabitFormProps {
    newHabitName: string;
    setNewHabitName: (name: string) => void;
    onAddHabit: (e: React.FormEvent) => void;
}

const AddHabitForm: React.FC<AddHabitFormProps> = ({ newHabitName, setNewHabitName, onAddHabit }) => {
    return (
        <form onSubmit={onAddHabit} className="mt-8 flex gap-2 animate-fade-in">
            <input
                type="text"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                placeholder="Add a new habit..."
                className="flex-grow p-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 transition"
            />
            <button
                type="submit"
                className="bg-sky-500 hover:bg-sky-600 text-white font-bold p-4 rounded-lg flex items-center justify-center transition-colors shadow-md hover:shadow-lg disabled:bg-slate-400 disabled:cursor-not-allowed"
                disabled={!newHabitName.trim()}
                aria-label="Add new habit"
            >
                <PlusIcon className="w-6 h-6" />
            </button>
        </form>
    );
};

export default AddHabitForm;
