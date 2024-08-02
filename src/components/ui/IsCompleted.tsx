import { CircleCheckBig, CircleDashed, CircleSlash2 } from "lucide-react";

const IsCompleted = ({
  isCompleted = false,
  isExpired = false,
}: {
  isCompleted?: boolean;
  isExpired?: boolean;
}) => {
  return (
    <span className="text-3xl">
      {isCompleted ? (
        <CircleCheckBig className="text-green-500" />
      ) : isExpired ? (
        <CircleSlash2 className="text-red-500" />
      ) : (
        <CircleDashed className="text-blue-500" />
      )}
    </span>
  );
};

export default IsCompleted;
