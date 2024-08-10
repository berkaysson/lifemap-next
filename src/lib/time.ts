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
} from "date-fns";

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
  const result = lightFormat(date, "dd-MM-yyyy");
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

export const checkStartDateAvailability = (startDate: Date, endDate: Date) => {
  return startDate < endDate;
};

export const calculateEndDateWithPeriod = (startDate: Date, period: Period, numberOfPeriods: number) => {
  switch (period) {
    case Period.DAILY:
      return addDays(startDate, numberOfPeriods);
    case Period.WEEKLY:
      return addWeeks(startDate, numberOfPeriods);
    case Period.MONTHLY:
      return addMonths(startDate, numberOfPeriods);
  }
}