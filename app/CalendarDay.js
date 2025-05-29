import React from "react";

const CalendarDay = ({ day, dayIndex, hours, events, onTimeClick }) => {
  const isToday = day.toDateString() === new Date().toDateString();

  const getEventPosition = (event) => {
    const startHour = parseInt(event.start.split(":")[0]);
    const startMinute = parseInt(event.start.split(":")[1]);
    const endHour = parseInt(event.end.split(":")[0]);
    const endMinute = parseInt(event.end.split(":")[1]);

    // Calculate position relative to 6 AM start
    const startOffset = startHour - 6 + startMinute / 60;
    const duration = endHour + endMinute / 60 - (startHour + startMinute / 60);

    return {
      top: `${startOffset * 64}px`, // 64px per hour (h-16)
      height: `${duration * 64}px`,
    };
  };

  return (
    <div
      className={`border-r border-gray-200 last:border-r-0 relative ${
        isToday ? "bg-blue-50" : "bg-white"
      }`}
    >
      {/* Hour grid */}
      {hours.map((hour, index) => (
        <div
          onClick={() => onTimeClick(hour.hour24, dayIndex)}
          key={index}
          className={`h-16 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer ${
            isToday ? "border-blue-100" : ""
          }`}
        />
      ))}

      {/* Events */}
      {events.map((event) => {
        const position = getEventPosition(event);
        return (
          <div
            key={event.id}
            className={`absolute left-1 right-1 ${event.color} text-white text-xs p-2 rounded-md shadow-sm z-10 overflow-hidden hover:shadow-md transition-shadow cursor-pointer`}
            style={{
              top: position.top,
              height: position.height,
              minHeight: "20px",
            }}
          >
            <div className="font-medium truncate">{event.title}</div>
            <div className="opacity-90 text-xs">
              {event.start} - {event.end}
            </div>
          </div>
        );
      })}

      {/* Current time indicator for today */}
      {isToday && (
        <div className="absolute left-0 right-0 z-20 pointer-events-none">
          <div
            className="h-0.5 bg-red-500 relative"
            style={{
              top: `${
                (new Date().getHours() - 6 + new Date().getMinutes() / 60) * 64
              }px`,
            }}
          >
            <div className="absolute -left-1 -top-1 w-2 h-2 bg-red-500 rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarDay;
