type MolStarPlaceholderProps = {
  height?: number;
};

const MolStarPlaceholder = ({ height = 240 }: MolStarPlaceholderProps) => {
  return (
    <div
      className="flex w-full items-center justify-center rounded-md border border-dashed border-gray-300 bg-white text-center text-gray-500"
      style={{ minHeight: height }}
    >
      Mol* viewer placeholder
    </div>
  );
};

export default MolStarPlaceholder;
