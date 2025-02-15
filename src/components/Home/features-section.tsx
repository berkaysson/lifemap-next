import {
  ClipboardList,
  CheckSquare,
  Calendar,
  Repeat,
  FolderKanban,
} from "lucide-react";

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 sm:p-6 flex flex-col items-center text-center h-full">
      <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-teal-400 mb-3 sm:mb-4" />
      <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-white/60">{description}</p>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section className="relative z-10 py-16 sm:py-20 md:py-24 bg-[#030303]">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white mb-8 sm:mb-12 md:mb-16">
          Key Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <FeatureCard
            icon={ClipboardList}
            title="Activity Logging"
            description="Log your activities, track duration, and gain insights for goal setting."
          />
          <FeatureCard
            icon={CheckSquare}
            title="To-Do Management"
            description="Create and manage one-time actions or reminders with simple completion tracking."
          />
          <FeatureCard
            icon={Calendar}
            title="Tasks"
            description="Set specific objectives with deadlines and track progress through activity logging."
          />
          <FeatureCard
            icon={Repeat}
            title="Habits"
            description="Foster positive habits with recurring activities and guided behavior changes."
          />
          <FeatureCard
            icon={FolderKanban}
            title="Project Management"
            description="Organize related tasks and to-dos effectively with project-based structuring."
          />
        </div>
      </div>
    </section>
  );
}
