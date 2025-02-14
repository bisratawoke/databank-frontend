import React from "react";

interface CircleProps {
  className?: string;
}

const Circle: React.FC<CircleProps> = ({ className = "" }) => (
  <div
    className={`flex shrink-0 rounded-full bg-white bg-opacity-10 h-[34px] w-[34px] ${className}`}
  />
);

export const CircleGrid: React.FC = () => {
  const rows = 3;
  const columns = 4;

  return (
    <>
      {[...Array(rows)].map((_, rowIndex) => (
        <div
          key={rowIndex}
          className={`flex gap-5 justify-between ${rowIndex > 0 ? "mt-9" : ""}`}
        >
          {[...Array(columns)].map((_, colIndex) => (
            <Circle
              key={colIndex}
              className={
                rowIndex === 0 && colIndex === 2 ? "h-[33px] w-[33px]" : ""
              }
            />
          ))}
        </div>
      ))}
    </>
  );
};
