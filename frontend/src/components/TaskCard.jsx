// src/components/TaskCard.jsx
// ==========================================
// TaskCard Component
// ==========================================
// Displays a single task as a beautiful card.
// Handles toggle, delete, and edit actions.
 
import React, { useState } from "react";
 
const TaskCard = ({ task, onToggle, onDelete, onEdit }) => {
  // State for showing/hiding the edit form
  const [isEditing, setIsEditing] = useState(false);
  // State for the edit form fields
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    completionTime: task.completionTime,
  });
  const [saving, setSaving] = useState(false);
 
  // Handle saving the edited task
  const handleSave = async () => {
    setSaving(true);
    const result = await onEdit(task._id, editData);
    if (result.success) setIsEditing(false);
    setSaving(false);
  };
 
  // Format time from "14:30" to "2:30 PM"
  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const displayH = h % 12 || 12;
    return `${displayH}:${minutes} ${ampm}`;
  };
 
  return (
    <div
      className={`card p-4 mb-3 animate-slide-in transition-all duration-200 group
        ${task.completed ? "opacity-70" : "hover:shadow-lg hover:-translate-y-0.5"}`}
      style={{ borderLeft: task.completed ? "3px solid #10b981" : "3px solid var(--accent)" }}
    >
      {isEditing ? (
        // ---- EDIT MODE ----
        <div className="space-y-3">
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            className="w-full px-3 py-2 rounded-lg text-sm font-medium"
            style={{
              background: "var(--bg-primary)",
              border: "1px solid var(--accent)",
              color: "var(--text-primary)",
            }}
            placeholder="Task title"
          />
          <textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="w-full px-3 py-2 rounded-lg text-sm resize-none"
            rows={2}
            style={{
              background: "var(--bg-primary)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
            placeholder="Description (optional)"
          />
          <input
            type="time"
            value={editData.completionTime}
            onChange={(e) => setEditData({ ...editData, completionTime: e.target.value })}
            className="px-3 py-2 rounded-lg text-sm"
            style={{
              background: "var(--bg-primary)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary text-sm px-4 py-2"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: "var(--bg-primary)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border)",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        // ---- VIEW MODE ----
        <div className="flex items-start gap-3">
          {/* Completion checkbox */}
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task._id)}
            className="task-checkbox mt-1"
            title={task.completed ? "Mark as pending" : "Mark as completed"}
          />
 
          {/* Task content */}
          <div className="flex-1 min-w-0">
            <h3
              className={`font-semibold text-base leading-snug ${
                task.completed ? "line-through" : ""
              }`}
              style={{
                color: task.completed ? "var(--text-secondary)" : "var(--text-primary)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {task.title}
            </h3>
 
            {/* Optional description */}
            {task.description && (
              <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                {task.description}
              </p>
            )}
 
            {/* Time badge */}
            <div className="flex items-center gap-2 mt-2">
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  background: task.completed ? "#d1fae5" : "var(--accent-light)",
                  color: task.completed ? "#065f46" : "var(--accent)",
                }}
              >
                🕐 {formatTime(task.completionTime)}
              </span>
 
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  background: task.completed ? "#d1fae5" : "#fef3c7",
                  color: task.completed ? "#065f46" : "#92400e",
                }}
              >
                {task.completed ? "✓ Done" : "⏳ Pending"}
              </span>
            </div>
          </div>
 
          {/* Action buttons - show on hover */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            {/* Edit button */}
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-2)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
              title="Edit task"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
 
            {/* Delete button */}
            <button
              onClick={() => onDelete(task._id)}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
              title="Delete task"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default TaskCard;