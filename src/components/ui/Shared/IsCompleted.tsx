import { CircleCheckBig, CircleDashed, CircleSlash2 } from "lucide-react";
import { Iconify } from "../iconify";

const IsCompleted = ({
  isCompleted = false,
  isExpired = false,
}: {
  isCompleted?: boolean;
  isExpired?: boolean;
}) => {
  return (
    <span>
      {isCompleted ? (
        // <CircleCheckBig className="text-green-500" />
        <Iconify
          icon="solar:check-circle-bold"
          width={24}
          className="text-green-500"
        />
      ) : isExpired ? (
        <Iconify
          icon="solar:slash-circle-bold"
          width={24}
          className="text-red-500"
        />
      ) : (
        <Iconify
          icon="ph:circle-dashed-fill"
          width={24}
          className="text-blue-500"
        />
      )}
    </span>
  );
};

export default IsCompleted;
