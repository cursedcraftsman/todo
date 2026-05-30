// src/components/MiniCalendar.jsx
import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO, isToday } from "date-fns";

const MiniCalendar = ({ tasks, selectedDate, onSelectDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get all days in current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the starting weekday (0=Sun, 1=Mon...) to offset grid
  const startOffset = monthStart.getDay();

  // Collect all dates that have tasks
  const taskDates = new Set(tasks.map((t) => t.date));

  const handleDayClick = (day) => {
    const dateStr = format(day, "yyyy-MM-dd");
    // If already selected, clicking again deselects (shows all)
    if (selectedDate === dateStr) {
      onSelectDate(null);
    } else {
      onSelectDate(dateStr);
    }
  };

  return (
    <div
      className="card p-4"
      style={{ userSelect: "none" }}
    >
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-1 rounded-lg transition-all"
          style={{
            color: "var(--text-secondary)",
            background: "var(--bg-primary)",
            border: "1px solid var(--border)",
            width: "28px",
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
          }}
        >
          ‹
        </button>

        <span
          className="text-sm font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          {format(currentMonth, "MMMM yyyy")}
        </span>

        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-1 rounded-lg transition-all"
          style={{
            color: "var(--text-secondary)",
            background: "var(--bg-primary)",
            border: "1px solid var(--border)",
            width: "28px",
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
          }}
        >
          ›
        </button>
      </div>

      {/* Weekday Headers */}
      <div
        className="grid mb-1"
        style={{ gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}
      >
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div
            key={i}
            className="text-center"
            style={{
              fontSize: "10px",
              color: "var(--text-secondary)",
              fontWeight: "600",
              padding: "2px 0",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day Grid */}
      <div
        className="grid"
        style={{ gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}
      >
        {/* Empty cells for offset */}
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Actual days */}
        {days.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const hasTask = taskDates.has(dateStr);
          const isSelected = selectedDate === dateStr;
          const isTodayDate = isToday(day);

          return (
            <button
              key={dateStr}
              onClick={() => handleDayClick(day)}
              style={{
                width: "100%",
                aspectRatio: "1",
                borderRadius: "8px",
                fontSize: "11px",
                fontWeight: isSelected || isTodayDate ? "700" : "400",
                cursor: "pointer",
                position: "relative",
                border: isTodayDate && !isSelected
                  ? "1px solid var(--accent)"
                  : "1px solid transparent",
                background: isSelected
                  ? "var(--accent)"
                  : "transparent",
                color: isSelected
                  ? "white"
                  : isTodayDate
                  ? "var(--accent)"
                  : isSameMonth(day, currentMonth)
                  ? "var(--text-primary)"
                  : "var(--text-secondary)",
                transition: "all 0.15s",
              }}
            >
              {format(day, "d")}
              {/* Dot indicator if day has tasks */}
              {hasTask && !isSelected && (
                <span
                  style={{
                    position: "absolute",
                    bottom: "2px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    background: isTodayDate ? "var(--accent)" : "#10b981",
                    display: "block",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Clear selection hint */}
      {selectedDate && (
        <button
          onClick={() => onSelectDate(null)}
          className="w-full mt-3 text-xs py-1.5 rounded-lg transition-all"
          style={{
            color: "var(--accent)",
            background: "var(--accent-light)",
            border: "1px solid var(--accent)",
          }}
        >
          ✕ Clear filter · Show all dates
        </button>
      )}
    </div>
  );
};

export default MiniCalendar;