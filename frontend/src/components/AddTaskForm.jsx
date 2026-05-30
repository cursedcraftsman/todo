import React, { useState } from "react";
import { format } from "date-fns";

const getTodayString = () => format(new Date(), "yyyy-MM-dd");

const INITIAL_FORM = {
  title: "",
  description: "",
  date: getTodayString(),
  completionTime: "09:00",
  isRecurring: false,
  recurringDays: 7,
};

const AddTaskForm = ({ onAdd, onClose }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Task title is required");
      return;
    }
    setSubmitting(true);
    const result = await onAdd({
      ...formData,
      recurringDays: formData.isRecurring ? Number(formData.recurringDays) : 0,
    });
    setSubmitting(false);
    if (result.success) {
      setFormData(INITIAL_FORM);
      onClose();
    } else {
      setError(result.message || "Failed to add task");
    }
  };

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
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "20px",
            color: "var(--text-primary)",
          }}
        >
          Add New Task
        </h2>
        <button
          onClick={onClose}
          className="p-1 rounded-full transition-colors"
          style={{ color: "var(--text-secondary)" }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--text-secondary)" }}
          >
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

        {/* Description */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--text-secondary)" }}
          >
            Description{" "}
            <span className="text-xs opacity-60">(optional)</span>
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

        {/* Date + Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--text-secondary)" }}
            >
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
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--text-secondary)" }}
            >
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

        {/* RECURRING SECTION */}
        <div
          className="rounded-xl p-4"
          style={{
            background: "var(--bg-primary)",
            border: "1px solid var(--border)",
          }}
        >
          {/* Toggle switch */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              onClick={() =>
                setFormData((p) => ({ ...p, isRecurring: !p.isRecurring }))
              }
              style={{
                width: "40px",
                height: "22px",
                borderRadius: "999px",
                background: formData.isRecurring
                  ? "var(--accent)"
                  : "var(--border)",
                position: "relative",
                transition: "background 0.2s",
                flexShrink: 0,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: "#fff",
                  position: "absolute",
                  top: "3px",
                  left: formData.isRecurring ? "21px" : "3px",
                  transition: "left 0.2s",
                }}
              />
            </div>
            <span
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              🔁 Is this a recurring task?
            </span>
          </label>

          {/* Days input — only shown when recurring is on */}
          {formData.isRecurring && (
            <div className="mt-3 flex items-center gap-3 flex-wrap">
              <label
                className="text-sm"
                style={{ color: "var(--text-secondary)", whiteSpace: "nowrap" }}
              >
                Repeat for
              </label>
              <input
                type="number"
                name="recurringDays"
                min="1"
                max="365"
                value={formData.recurringDays}
                onChange={handleChange}
                style={{ ...inputStyle, width: "80px", textAlign: "center" }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
              <label
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                days after start date
              </label>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div
            className="text-sm px-3 py-2 rounded-lg"
            style={{
              background: "var(--accent-light)",
              color: "var(--accent)",
            }}
          >
            ⚠ {error}
          </div>
        )}

        {/* Buttons */}
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