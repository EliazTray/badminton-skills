import { addDays, format, startOfWeek, subWeeks } from 'date-fns';
import type { Session } from '../data/schema';

export interface WeeklyTraining {
  weekStart: string;
  label: string;
  count: number;
  minutes: number;
}

export function getWeeklyTrainingTrend(
  sessions: Session[],
  weeks = 12,
  now = new Date(),
): WeeklyTraining[] {
  const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 });
  const trend: WeeklyTraining[] = [];

  for (let offset = weeks - 1; offset >= 0; offset -= 1) {
    const start = subWeeks(currentWeekStart, offset);
    const end = addDays(start, 7);
    const startISO = format(start, 'yyyy-MM-dd');
    const endISO = format(end, 'yyyy-MM-dd');
    const inWeek = sessions.filter(
      (session) => session.date >= startISO && session.date < endISO,
    );
    trend.push({
      weekStart: startISO,
      label: format(start, 'M/d'),
      count: inWeek.length,
      minutes: inWeek.reduce((total, session) => total + session.durationMin, 0),
    });
  }

  return trend;
}
