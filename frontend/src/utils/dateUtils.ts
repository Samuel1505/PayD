export interface SchedulingConfig {
  frequency: 'weekly' | 'biweekly' | 'monthly';
  dayOfWeek?: number;
  dayOfMonth?: number;
  timeOfDay: string;
}

export function computeNextRunDate(config: SchedulingConfig, fromDate: Date = new Date()): Date {
  const [hours, minutes] = config.timeOfDay.split(':').map(Number);
  const next = new Date(fromDate);
  next.setHours(hours, minutes, 0, 0);

  if (config.frequency === 'monthly') {
    next.setDate(config.dayOfMonth || 1);
    if (next <= fromDate) {
      next.setMonth(next.getMonth() + 1);
    }
    // Correct for end of month
    const monthEnd = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
    if ((config.dayOfMonth || 1) > monthEnd) {
      next.setDate(monthEnd);
    }
  } else {
    const targetDay = config.dayOfWeek || 0;
    const currentDay = fromDate.getDay();
    let diffDays = (targetDay - currentDay + 7) % 7;

    // If it's today but the time has already passed, jump to the next interval
    if (diffDays === 0 && next <= fromDate) {
      diffDays = config.frequency === 'biweekly' ? 14 : 7;
    }

    next.setDate(next.getDate() + diffDays);
  }

  return next;
}
