import { Period } from "@prisma/client";
import {
  isBefore,
  lightFormat,
  parseISO,
  formatDistanceToNow,
  addDays,
  addHours,
  addWeeks,
  addMonths,
  format,
} from "date-fns";
import { enUS } from "date-fns/locale";

export const addOneDay = (date: Date) => {
  return addDays(date, 1);
};

export const removeOneDay = (date: Date) => {
  return addDays(date, -1);
};

export const isExpired = (date: Date) => {
  const now = new Date();
  const correctedDate = addOneDay(date);
  return isBefore(correctedDate, now);
};

export const formatDate = (date: Date) => {
  const result = lightFormat(date, "MM-dd-yyyy");
  return result;
};

export const parseDate = (dateString: string) => {
  const date = parseISO(dateString);
  return addHours(date, -new Date().getTimezoneOffset() / 60);
};

export const getRemainingTime = (date: Date) => {
  const correctedDate = addOneDay(date);
  const remaining = formatDistanceToNow(correctedDate, { addSuffix: true });
  return remaining;
};

export const checkIsStartDateBeforeEndDate = (
  startDate: Date,
  endDate: Date
) => {
  return startDate < endDate;
};

export const calculateEndDateWithPeriod = (
  startDate: Date,
  period: Period,
  numberOfPeriods: number
) => {
  switch (period) {
    case Period.DAILY:
      return addDays(startDate, numberOfPeriods);
    case Period.WEEKLY:
      return addWeeks(startDate, numberOfPeriods);
    case Period.MONTHLY:
      return addMonths(startDate, numberOfPeriods);
  }
};

export const formatDateFriendly = (date: Date | string): string => {
  const parsedDate = new Date(date);
  const dayWithSuffix = format(parsedDate, "do");

  return format(parsedDate, `MMMM '${dayWithSuffix},' yyyy`, { locale: enUS });
};

export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}