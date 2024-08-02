const ColorCircle = ({ colorCode = "darkblue" }: { colorCode: string }) => {
  return (
    <span
      style={{ backgroundColor: colorCode }}
      className="inline-block rounded-full w-6 h-6"
    />
  );
};

export default ColorCircle;
