const ColorCircle = ({ colorCode = "darkblue" }: { colorCode: string }) => {
  return (
    <span
      style={{ backgroundColor: colorCode }}
      className="inline-block rounded-full w-4 h-4 border shadow-sm border-slate-400"
    />
  );
};

export default ColorCircle;
