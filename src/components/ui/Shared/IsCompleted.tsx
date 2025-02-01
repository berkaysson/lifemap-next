import { CircleCheckBig, CircleDashed, CircleSlash2 } from "lucide-react";
import { Iconify } from "../iconify";

const IsCompleted = ({
  isCompleted = false,
  isExpired = false,
  width = 24,
}: {
  isCompleted?: boolean;
  isExpired?: boolean;
  width?: number;
}) => {
  return (
    <span className="flex items-center justify-center">
      {isCompleted ? (
        <Iconify
          icon="solar:check-circle-bold"
          width={width}
          className="text-green-500"
        />
      ) : isExpired ? (
        <Iconify
          icon="solar:slash-circle-bold"
          width={width}
          className="text-red-500"
        />
      ) : (
        <Iconify
          icon="ph:circle-dashed-fill"
          width={width}
          className="text-blue-500"
        />
      )}
    </span>
  );
};

export default IsCompleted;
