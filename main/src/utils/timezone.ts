export const APP_TIME_ZONE = 'America/Denver';

export const getTodayInAppTimeZone = (): string => new Intl.DateTimeFormat('en-CA', { timeZone: APP_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

export const formatTimestampInAppTimeZone = (iso: string): string => new Intl.DateTimeFormat('en-US', { timeZone: APP_TIME_ZONE, month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(iso));
