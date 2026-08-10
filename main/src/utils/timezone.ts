export const APP_TIME_ZONE = 'America/Denver';

export const getTodayInAppTimeZone = (): string => new Intl.DateTimeFormat('en-CA', { timeZone: APP_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
