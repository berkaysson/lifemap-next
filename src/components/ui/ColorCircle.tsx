const ColorCircle = ({ colorCode = "darkblue" }: { colorCode: string }) => {
  return (
    <span
      style={{ backgroundColor: colorCode }}
      className="inline-block rounded-full w-6 h-6 border shadow-sm border-slate-400"
    />
  );
};

export default ColorCircle;
