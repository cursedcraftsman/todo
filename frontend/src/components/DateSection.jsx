// src/components/DateSection.jsx
// ==========================================
// DateSection Component
// ==========================================
// Displays a group of tasks under a specific date header.
// Shows "Today", "Tomorrow", or the formatted date.
 
import React from "react";
import { format, isToday, isTomorrow, parseISO } from "date-fns";
import TaskCard from "./TaskCard";
 
const DateSection = ({ date, tasks, onToggle, onDelete, onEdit }) => {
  // Parse the date string into a Date object
  // parseISO handles "2024-01-15" format correctly
  const dateObj = parseISO(date);
 
  // Determine the label for the date header
  const getDateLabel = () => {
    if (isToday(dateObj)) return "Today";
    if (isTomorrow(dateObj)) return "Tomorrow";
    return format(dateObj, "EEEE, MMMM d"); // e.g., "Monday, January 15"
  };
 
  // Format the full date subtitle
  const getDateSubtitle = () => {
    if (isToday(dateObj) || isTomorrow(dateObj)) {
      return format(dateObj, "EEEE, MMMM d, yyyy");
    }
    return format(dateObj, "yyyy");
  };
 
  // Count completed tasks for this day
  const completedCount = tasks.filter((t) => t.completed).length;
  const isAllDone = tasks.length > 0 && completedCount === tasks.length;
 
  return (
    <div className="mb-8 animate-fade-in">
      {/* Date Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Date label pill */}
          <div>
            <div className="flex items-center gap-2">
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "22px",
                  fontWeight: "700",
                  color: isToday(dateObj) ? "var(--accent)" : "var(--text-primary)",
                }}
              >
                {getDateLabel()}
              </h2>
              {isToday(dateObj) && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-bold"
                  style={{ background: "var(--accent)", color: "white" }}
                >
                  TODAY
                </span>
              )}
              {isAllDone && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-bold"
                  style={{ background: "#d1fae5", color: "#065f46" }}
                >
                  ✓ All done!
                </span>
              )}
            </div>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
              {getDateSubtitle()} · {completedCount}/{tasks.length} tasks done
            </p>
          </div>
        </div>
 
        {/* Mini progress bar for this day */}
        <div className="flex items-center gap-2">
          <div
            className="h-1.5 w-16 rounded-full overflow-hidden"
            style={{ background: "var(--border)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: tasks.length > 0 ? `${(completedCount / tasks.length) * 100}%` : "0%",
                background: isAllDone ? "#10b981" : "var(--accent)",
              }}
            />
          </div>
        </div>
      </div>
 
      {/* Divider line */}
      <div
        className="h-px mb-4"
        style={{
          background: isToday(dateObj)
            ? "linear-gradient(90deg, var(--accent), transparent)"
            : "var(--border)",
        }}
      />
 
      {/* Task cards for this date */}
      <div>
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
};
 
export default DateSection;