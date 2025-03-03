import HabitListItem from "../Habits/HabitListItem";

const ExampleHabit = () => {
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold">Build Your Habit</h2>
      <p className="text-sm text-muted-foreground">
        Want to develop a new positive routine?
      </p>
      <p className="text-sm text-muted-foreground mb-2">
        Below is an example habit that helps you stay motivated by showing your
        progress.
      </p>
      <HabitListItem habit={habitData} mode="light" />
    </div>
  );
};

export default ExampleHabit;

const getISODateString = (date: Date) =>
  date.toISOString().split("T")[0] + "T00:00:00.000Z";

const today = new Date();
const habitStartDate = getISODateString(
  new Date(today.setDate(today.getDate() - 7))
); // 7 days ago
const habitEndDate = getISODateString(
  new Date(today.setDate(today.getDate() + 69))
); // 70-day habit

const getRandomDuration = () => Math.floor(Math.random() * 40) + 5;

const generateProgress = (days: number) => {
  return Array.from({ length: days }, (_, index) => {
    const progressDate = new Date();
    progressDate.setDate(today.getDate() + index - 7);

    const isCompleted = index < 7;
    return {
      id: `progress_${index + 1}`,
      userId: "1",
      categoryId: "cm7ou69950003iwzkyo2yuvrf",
      goalDuration: 30,
      order: index + 1,
      startDate: new Date(getISODateString(progressDate)),
      endDate: new Date(getISODateString(progressDate)),
      completedDuration: isCompleted ? getRandomDuration() : 0,
      completed: isCompleted,
      habitId: "cm7rquab10001iweon3k0fugk",
    };
  });
};

const habitData = {
  id: "cm7rquab10001iweon3k0fugk",
  name: "Walk every morning",
  description: "I want to build a habit of walking every morning.",
  colorCode: "#9caefc",
  completed: false,
  period: "DAILY",
  numberOfPeriods: 70,
  startDate: habitStartDate,
  endDate: habitEndDate,
  goalDurationPerPeriod: 30,
  currentStreak: 0,
  bestStreak: 2,
  categoryId: "cm7ou69950003iwzkyo2yuvrf",
  userId: "1",
  projectId: null,
  category: {
    id: "cm7ou69950003iwzkyo2yuvrf",
    name: "Walking Morning",
    date: getISODateString(new Date(today.setDate(today.getDate() - 1))),
    userId: "1",
  },
  progress: generateProgress(70),
};
