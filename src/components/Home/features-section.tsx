import { Card, CardDescription, CardTitle } from "../ui/card";
import { Iconify } from "../ui/iconify";

function FeatureCard({
  icon: string,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 backdrop-blur-sm rounded-lg p-4 sm:p-6 flex flex-col items-center text-center h-full">
      <Iconify
        icon={string}
        width={40}
        className="w-10 h-10 sm:w-12 sm:h-12 text-primary mb-3 sm:mb-4"
      />
      <CardTitle className="text-lg sm:text-xl font-semibold mb-2">
        {title}
      </CardTitle>
      <CardDescription>{description}</CardDescription>
    </Card>
  );
}

export function FeaturesSection() {
  return (
    <section className="relative z-10 py-16 sm:py-20 md:py-24 bg-back">
      <div className="absolute inset-0 bg-gradient-to-t from-back via-transparent to-[#13053860] dark:to-[#1c0f3b88] pointer-events-none" />
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-primary mb-8 sm:mb-12 md:mb-16">
          Key Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <FeatureCard
            icon="solar:bolt-bold-duotone"
            title="Activity Tracker"
            description="Log time spent on various activities to analyze trends and improve productivity."
          />
          <FeatureCard
            icon="solar:checklist-minimalistic-bold-duotone"
            title="Quick To-Dos"
            description="Create simple to-dos for one-time actions and check them off when done."
          />
          <FeatureCard
            icon="solar:check-read-bold-duotone"
            title="Tasks"
            description="Set goals with deadlines and track progress automatically based on logged activity."
          />
          <FeatureCard
            icon="ph:plant-duotone"
            title="Habit Builder"
            description=" Establish and maintain positive habits with guided tracking and habit streaks based on logged activity.."
          />
          <FeatureCard
            icon="solar:folder-with-files-bold-duotone"
            title="Project Organizer"
            description="Organize related tasks, habits, and to-dos effectively with project-based structuring for better organization and goal-setting."
          />
          <FeatureCard
            icon="solar:stars-line-duotone"
            title="And More!"
            description="We're constantly working on new features to enhance your productivity experience. Stay tuned!"
          />
        </div>
      </div>
    </section>
  );
}
