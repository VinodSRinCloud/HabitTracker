import { Habit } from '../types';

const HABITS_STORAGE_KEY = 'dailyHabits';

const getTodayDateString = (): string => {
    const today = new Date();
    // Adjust for timezone offset to ensure 'today' is correct locally
    const offset = today.getTimezoneOffset();
    const todayLocal = new Date(today.getTime() - (offset*60*1000));
    return todayLocal.toISOString().split('T')[0];
};

/**
 * Calculates the current streak for a habit based on its completion dates.
 * A streak is a sequence of consecutive days ending on today or yesterday.
 */
export const calculateStreak = (dates: string[]): number => {
    if (dates.length === 0) return 0;

    const sortedDates = [...new Set(dates)].sort();
    const today = new Date(getTodayDateString());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const lastCompletionDateStr = sortedDates[sortedDates.length - 1];
    const lastCompletionDate = new Date(lastCompletionDateStr);

    // If the last completion wasn't today or yesterday, the streak is broken.
    if (lastCompletionDate.getTime() !== today.getTime() && lastCompletionDate.getTime() !== yesterday.getTime()) {
        return 0;
    }

    let streak = 0;
    if (sortedDates.length > 0) {
        streak = 1;
        for (let i = sortedDates.length - 2; i >= 0; i--) {
            const current = new Date(sortedDates[i + 1]);
            const previous = new Date(sortedDates[i]);
            const expectedPrevious = new Date(current);
            expectedPrevious.setDate(current.getDate() - 1);

            if (previous.getTime() === expectedPrevious.getTime()) {
                streak++;
            } else {
                break; // Gap found, streak ends.
            }
        }
    }
    
    return streak;
};


const defaultHabits: Habit[] = [
    { id: '1', name: 'Drink 8 glasses of water', streak: 0, completedDates: [] },
    { id: '2', name: 'Go for a 15-min run', streak: 3, completedDates: [
        new Date(new Date().setDate(new Date().getDate() - 3)).toISOString().split('T')[0],
        new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0],
        new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0],
    ]},
    { id: '3', name: 'Read 10 pages of a book', streak: 0, completedDates: [] },
];

export const getHabits = (): Habit[] => {
    try {
        const storedHabits = localStorage.getItem(HABITS_STORAGE_KEY);
        if (!storedHabits) {
            const initialHabits = defaultHabits.map(h => ({...h, streak: calculateStreak(h.completedDates)}));
            saveHabits(initialHabits);
            return initialHabits;
        }
        
        const habits: Habit[] = JSON.parse(storedHabits);
        
        // Recalculate streak on load to ensure accuracy.
        return habits.map(habit => ({
            ...habit,
            streak: calculateStreak(habit.completedDates),
        }));

    } catch (error) {
        console.error("Failed to load habits from localStorage", error);
        // Fallback to default if loading fails
        const initialHabits = defaultHabits.map(h => ({...h, streak: calculateStreak(h.completedDates)}));
        saveHabits(initialHabits);
        return initialHabits;
    }
};

export const saveHabits = (habits: Habit[]): void => {
    try {
        localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
    } catch (error) {
        console.error("Failed to save habits to localStorage", error);
    }
};
