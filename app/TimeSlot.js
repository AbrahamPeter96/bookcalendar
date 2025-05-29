import React from "react";

const TimeSlot = ({ time }) => {
  return (
    <div className="h-16 px-3 py-2 border-b border-gray-200 flex items-start justify-end">
      <span className="text-sm text-gray-500 font-medium -mt-2">{time}</span>
    </div>
  );
};

export default TimeSlot;
