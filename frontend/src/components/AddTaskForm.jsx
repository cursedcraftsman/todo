// src/components/AddTaskForm.jsx
// ==========================================
// AddTaskForm Component
// ==========================================
// A slide-down form panel for creating new tasks.
// Shows when the "Add Task" button is clicked.
 
import React, { useState } from "react";
import { format } from "date-fns";
 
// Helper to get today's date in YYYY-MM-DD format (required by HTML date input)
const getTodayString = () => format(new Date(), "yyyy-MM-dd");
 
// Initial empty state for the form
const INITIAL_FORM = {
  title: "",
  description: "",
  date: getTodayString(),  // Default to today's date
  completionTime: "09:00", // Default time
};
 
const AddTaskForm = ({ onAdd, onClose }) => {
  // Form data state
  const [formData, setFormData] = useState(INITIAL_FORM);
  // Loading state while submitting
  const [submitting, setSubmitting] = useState(false);
  // Error message from submission
  const [error, setError] = useState("");
 
  // Handle any input field change
  // "name" matches the HTML input's name attribute
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error when user types
  };
 
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh on form submit
 
    // Basic validation
    if (!formData.title.trim()) {
      setError("Task title is required");
      return;
    }
 
    setSubmitting(true);
    const result = await onAdd(formData);
    setSubmitting(false);
 
    if (result.success) {
      setFormData(INITIAL_FORM); // Reset form
      onClose(); // Close the form panel
    } else {
      setError(result.message || "Failed to add task");
    }
  };
 
  // Shared input styles for consistency
  const inputStyle = {
    background: "var(--bg-primary)",
    border: "1px solid var(--border)",
    color: "var(--text-primary)",
    borderRadius: "10px",
    padding: "10px 14px",
    width: "100%",
    fontSize: "14px",
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    transition: "border-color 0.2s",
  };
 
  return (
    <div
      className="card p-6 mb-6 animate-slide-in"
      style={{ borderTop: "3px solid var(--accent)" }}
    >
      <div className="flex justify-between items-center mb-5">
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", color: "var(--text-primary)" }}>
          Add New Task
        </h2>
        <button
          onClick={onClose}
          className="p-1 rounded-full transition-colors"
          style={{ color: "var(--text-secondary)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
 
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Task Title - Required */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
            Task Title <span style={{ color: "var(--accent)" }}>*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="What do you need to do?"
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
        </div>
 
        {/* Description - Optional */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
            Description <span className="text-xs opacity-60">(optional)</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add more details..."
            rows={2}
            style={{ ...inputStyle, resize: "none" }}
            onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
        </div>
 
        {/* Date and Time - side by side */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              Date <span style={{ color: "var(--accent)" }}>*</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              Due Time <span style={{ color: "var(--accent)" }}>*</span>
            </label>
            <input
              type="time"
              name="completionTime"
              value={formData.completionTime}
              onChange={handleChange}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </div>
        </div>
 
        {/* Error Message */}
        {error && (
          <div
            className="text-sm px-3 py-2 rounded-lg"
            style={{ background: "var(--accent-light)", color: "var(--accent)" }}
          >
            ⚠ {error}
          </div>
        )}
 
        {/* Submit Buttons */}
        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary flex-1 py-3 text-sm"
            style={{ opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? "Adding..." : "＋ Add Task"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 rounded-xl text-sm font-medium transition-colors"
            style={{
              background: "var(--bg-primary)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border)",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
 
export default AddTaskForm;