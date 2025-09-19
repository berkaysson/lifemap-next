export type CategoryBreakdown = {
  [categoryName: string]: number;
};

export type WeeklyActivitySummary = {
  weekStartDate: Date;
  weekEndDate: Date;
  totalDuration: number;
  categoryBreakdown: CategoryBreakdown;
};
