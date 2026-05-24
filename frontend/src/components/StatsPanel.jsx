// src/components/StatsPanel.jsx
// ==========================================
// StatsPanel Component
// ==========================================
// Displays task statistics: total, completed, pending, and a progress bar.
// Positioned in the sidebar for an at-a-glance overview.
 
import React from "react";
 
const StatsPanel = ({ stats }) => {
  const { total, completed, pending, completionRate } = stats;
 
  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <StatBox label="Total" value={total} color="var(--accent-2)" />
        <StatBox label="Done" value={completed} color="#10b981" />
        <StatBox label="Left" value={pending} color="var(--accent)" />
      </div>
 
      {/* Progress Bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
            Progress
          </span>
          <span
            className="text-xs font-bold"
            style={{ color: completionRate === 100 ? "#10b981" : "var(--accent)" }}
          >
            {completionRate}%
          </span>
        </div>
        <div
          className="h-2 rounded-full overflow-hidden"
          style={{ background: "var(--border)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${completionRate}%`,
              background:
                completionRate === 100
                  ? "linear-gradient(90deg, #10b981, #34d399)"
                  : "linear-gradient(90deg, var(--accent), #f59e0b)",
            }}
          />
        </div>
      </div>
 
      {/* Motivational message */}
      {total > 0 && (
        <p className="text-xs text-center" style={{ color: "var(--text-secondary)" }}>
          {completionRate === 100
            ? "🎉 All done! You crushed it!"
            : completionRate >= 50
            ? "💪 More than halfway there!"
            : "🚀 Keep pushing, you've got this!"}
        </p>
      )}
    </div>
  );
};
 
// Small stat display box
const StatBox = ({ label, value, color }) => (
  <div
    className="rounded-xl p-3 text-center"
    style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}
  >
    <div className="text-2xl font-bold" style={{ color, fontFamily: "'JetBrains Mono', monospace" }}>
      {value}
    </div>
    <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
      {label}
    </div>
  </div>
);
 
export default StatsPanel;