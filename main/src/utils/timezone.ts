import { fromZonedTime, formatInTimeZone } from 'date-fns-tz';

export const APP_TIME_ZONE = 'America/Denver';

export const datetimeLocalToISO = (value: string): string => fromZonedTime(value, APP_TIME_ZONE).toISOString();

export const isoToDatetimeLocal = (iso: string): string => formatInTimeZone(iso, APP_TIME_ZONE, "yyyy-MM-dd'T'HH:mm");

export const formatZoned = (iso: string, formatStr: string): string => formatInTimeZone(iso, APP_TIME_ZONE, formatStr);
