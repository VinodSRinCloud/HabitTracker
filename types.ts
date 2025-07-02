export interface Habit {
  id: string;
  name: string;
  streak: number;
  completedDates: string[]; // Array of ISO date strings 'YYYY-MM-DD'
}
