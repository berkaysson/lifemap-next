import { ActivityContext } from "@/contexts/ActivityContext";
import { useContext } from "react";
import ActivityListItem from "./ActivityListItem";

const ActivityList = () => {
  const { activities } = useContext(ActivityContext);

  return (
    <div className="flex flex-col gap-2 m-2 border rounded-sm">
      {activities.map((activity) => (
        <ActivityListItem key={activity.id} activity={activity} />
      ))}
    </div>
  );
};

export default ActivityList;
