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
          className="text-success"
        />
      ) : isExpired ? (
        <Iconify
          icon="solar:slash-circle-bold"
          width={width}
          className="text-error"
        />
      ) : (
        <Iconify
          icon="ph:circle-dashed-fill"
          width={width}
          className="text-info"
        />
      )}
    </span>
  );
};

export default IsCompleted;
