import {
  isBefore,
  lightFormat,
  parseISO,
  formatDistanceToNow,
  addDays,
} from "date-fns";

export const addOneDay = (date: Date) => {
  return addDays(date, 1);
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
  return date;
};

export const getRemainingTime = (date: Date) => {
  const correctedDate = addOneDay(date);
  const remaining = formatDistanceToNow(correctedDate, { addSuffix: true });
  return remaining;
};
