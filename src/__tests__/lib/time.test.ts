import {
  removeOneDay,
  calculateEndDateWithPeriod,
  checkIsStartDateBeforeEndDate,
  addOneDay,
  isExpired,
  formatDate,
  formatDateFriendly,
  isToday,
} from "@/lib/time";
import { Period } from "@prisma/client";

describe("time utilities", () => {
  describe("removeOneDay", () => {
    it("should subtract exactly 1 day", () => {
      const date = new Date("2024-01-02T12:00:00");
      const result = removeOneDay(date);
      expect(result.getDate()).toBe(1);
      expect(result.getMonth()).toBe(0); // January
      expect(result.getFullYear()).toBe(2024);
    });

    it("should handle month rollover correctly", () => {
      const date = new Date("2024-01-01T12:00:00");
      const result = removeOneDay(date);
      expect(result.getDate()).toBe(31);
      expect(result.getMonth()).toBe(11); // December
      expect(result.getFullYear()).toBe(2023);
    });
  });

  describe("calculateEndDateWithPeriod", () => {
    const startDate = new Date("2024-01-01T12:00:00");

    it("should calculate correctly for DAILY period", () => {
      const result = calculateEndDateWithPeriod(startDate, Period.DAILY, 10);
      expect(result?.getDate()).toBe(11);
    });

    it("should calculate correctly for WEEKLY period", () => {
      const result = calculateEndDateWithPeriod(startDate, Period.WEEKLY, 2);
      expect(result?.getDate()).toBe(15);
    });

    it("should calculate correctly for MONTHLY period", () => {
      const result = calculateEndDateWithPeriod(startDate, Period.MONTHLY, 1);
      expect(result?.getMonth()).toBe(1); // February
    });
  });

  describe("checkIsStartDateBeforeEndDate", () => {
    const startDate = new Date("2024-01-01");
    const endDate = new Date("2024-01-02");

    it("should return true if startDate is before endDate", () => {
      expect(checkIsStartDateBeforeEndDate(startDate, endDate)).toBe(true);
    });

    it("should return false if startDate is same as endDate", () => {
      expect(checkIsStartDateBeforeEndDate(startDate, startDate)).toBe(false);
    });

    it("should return false if startDate is after endDate", () => {
      expect(checkIsStartDateBeforeEndDate(endDate, startDate)).toBe(false);
    });
  });

  describe("addOneDay", () => {
    it("should add exactly 1 day", () => {
      const date = new Date("2024-01-01T12:00:00");
      const result = addOneDay(date);
      expect(result.getDate()).toBe(2);
    });
  });

  describe("isExpired", () => {
    it("should return true if corrected date is before now", () => {
       // date is 2 days ago + 1 day = 1 day ago (expired)
       const twoDaysAgo = new Date();
       twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
       expect(isExpired(twoDaysAgo)).toBe(true);
    });

    it("should return false if corrected date is in the future", () => {
       // date is tomorrow + 1 day = 2 days from now (not expired)
       const tomorrow = new Date();
       tomorrow.setDate(tomorrow.getDate() + 1);
       expect(isExpired(tomorrow)).toBe(false);
    });
  });

  describe("formatDate", () => {
    it("should format date as MM-dd-yyyy", () => {
      const date = new Date(2024, 4, 20); // May 20 (month is 0-indexed)
      expect(formatDate(date)).toBe("05-20-2024");
    });
  });

  describe("isToday", () => {
    it("should return true for today's date", () => {
      expect(isToday(new Date())).toBe(true);
    });

    it("should return false for yesterday's date", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });
  });
  
  describe("formatDateFriendly", () => {
    it("should format date with suffix and month name", () => {
      const date = new Date(2024, 0, 1); // Jan 1st
      const result = formatDateFriendly(date);
      expect(result).toMatch(/January 1st, 2024/);
    });

    it("should handle string input", () => {
      const result = formatDateFriendly("2024-01-01T12:00:00");
      expect(result).toMatch(/January 1st, 2024/);
    });

    it("should omit year if isYearOn is false", () => {
       const date = new Date(2024, 0, 1);
       const result = formatDateFriendly(date, false);
       expect(result).not.toContain("2024");
       expect(result).toMatch(/January 1st/);
    });
  });
});
