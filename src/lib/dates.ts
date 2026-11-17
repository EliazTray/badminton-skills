import { differenceInCalendarDays, format, parseISO, startOfWeek } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export function todayISO(now = new Date()): string {
  return format(now, 'yyyy-MM-dd');
}

export function formatChineseDate(isoDate: string): string {
  return format(parseISO(isoDate), 'M月d日', { locale: zhCN });
}

export function formatChineseDateWithYear(isoDate: string): string {
  return format(parseISO(isoDate), 'yyyy年M月d日', { locale: zhCN });
}

export function daysSince(isoDate: string, now = new Date()): number {
  return differenceInCalendarDays(now, parseISO(isoDate));
}

export function startOfCurrentWeek(now = new Date()): Date {
  return startOfWeek(now, { weekStartsOn: 1 });
}
