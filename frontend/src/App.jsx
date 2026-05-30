import React, { useState } from "react";
import { format } from "date-fns";
import useTasks from "./hooks/useTasks";
import useDarkMode from "./hooks/useDarkMode";
import AddTaskForm from "./components/AddTaskForm";
import DateSection from "./components/DateSection";
import StatsPanel from "./components/StatsPanel";
import MiniCalendar from "./components/MiniCalendar";

const App = () => {
  const { isDark, toggleDarkMode } = useDarkMode();
  const {
    tasks,
    tasksByDate,
    sortedDates,
    loading,
    error,
    filter,
    stats,
    setFilter,
    addTask,
    toggleTaskCompletion,
    removeTask,
    editTask,
  } = useTasks();

  const [showForm, setShowForm] = useState(false);
  const [showMobileCalendar, setShowMobileCalendar] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );

  const todayFormatted = format(new Date(), "EEEE, MMMM d, yyyy");

  const visibleDates = selectedCalendarDate
    ? sortedDates.filter((d) => d === selectedCalendarDate)
    : sortedDates;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>

      {/* TOP NAV */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--border)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "24px",
                fontWeight: "700",
                color: "var(--accent)",
                letterSpacing: "-0.5px",
              }}
            >
              ✦ Taskly
            </h1>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              {todayFormatted}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile calendar toggle button */}
            <button
              onClick={() => setShowMobileCalendar((p) => !p)}
              className="p-2 rounded-xl transition-all lg:hidden"
              style={{
                background: showMobileCalendar ? "var(--accent)" : "var(--bg-primary)",
                border: "1px solid var(--border)",
                color: showMobileCalendar ? "white" : "var(--text-primary)",
              }}
              title="Toggle Calendar"
            >
              📅
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl transition-all"
              style={{
                background: "var(--bg-primary)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
            >
              {isDark ? "☀️" : "🌙"}
            </button>

            {/* Add Task */}
            <button
              onClick={() => setShowForm((prev) => !prev)}
              className="btn-primary flex items-center gap-2 text-sm"
              style={{ background: showForm ? "#555" : "var(--accent)" }}
            >
              <span style={{ fontSize: "18px", lineHeight: 1 }}>
                {showForm ? "×" : "+"}
              </span>
              {showForm ? "Close" : "Add Task"}
            </button>
          </div>
        </div>

        {/* Mobile Calendar Dropdown */}
        {showMobileCalendar && (
          <div
            className="lg:hidden px-4 pb-4"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <MiniCalendar
              tasks={tasks}
              selectedDate={selectedCalendarDate}
              onSelectDate={(date) => {
                setSelectedCalendarDate(date);
                setShowMobileCalendar(false); // close after selecting
              }}
            />
          </div>
        )}
      </header>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-8">

          {/* SIDEBAR — desktop only */}
          <aside className="w-64 flex-shrink-0 space-y-6 hidden lg:block">

            {/* Stats */}
            <div className="card p-5">
              <h3
                className="text-sm font-semibold mb-4"
                style={{
                  color: "var(--text-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Overview
              </h3>
              <StatsPanel stats={stats} />
            </div>

            {/* Calendar */}
            <div>
              <h3
                className="text-sm font-semibold mb-3 px-1"
                style={{
                  color: "var(--text-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Calendar
              </h3>
              <MiniCalendar
                tasks={tasks}
                selectedDate={selectedCalendarDate}
                onSelectDate={setSelectedCalendarDate}
              />
            </div>

            {/* Filter */}
            <div className="card p-5">
              <h3
                className="text-sm font-semibold mb-3"
                style={{
                  color: "var(--text-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Filter
              </h3>
              <div className="space-y-1">
                {[
                  { key: "all", label: "All Tasks", emoji: "📋" },
                  { key: "pending", label: "Pending", emoji: "⏳" },
                  { key: "completed", label: "Completed", emoji: "✅" },
                ].map(({ key, label, emoji }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background: filter === key ? "var(--accent-light)" : "transparent",
                      color: filter === key ? "var(--accent)" : "var(--text-secondary)",
                      border: filter === key ? "1px solid var(--accent)" : "1px solid transparent",
                    }}
                  >
                    <span className="mr-2">{emoji}</span>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div
              className="p-4 rounded-xl text-xs"
              style={{
                background: "var(--accent-light)",
                border: "1px solid var(--accent)",
                color: "var(--accent)",
              }}
            >
              <p className="font-semibold mb-1">💡 Tips</p>
              <ul className="space-y-1 opacity-80">
                <li>• Click ○ to mark done</li>
                <li>• Hover to edit or delete</li>
                <li>• Click a date on calendar to filter</li>
              </ul>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <div className="flex-1 min-w-0">

            {/* Selected date banner */}
            {selectedCalendarDate && (
              <div
                className="card px-4 py-3 mb-4 flex items-center justify-between text-sm"
                style={{ borderLeft: "3px solid var(--accent)", color: "var(--accent)" }}
              >
                <span>
                  📅 Showing tasks for{" "}
                  <strong>
                    {format(
                      new Date(selectedCalendarDate + "T00:00:00"),
                      "MMMM d, yyyy"
                    )}
                  </strong>
                </span>
                <button
                  onClick={() => setSelectedCalendarDate(null)}
                  style={{ color: "var(--text-secondary)", fontSize: "18px", lineHeight: 1 }}
                >
                  ×
                </button>
              </div>
            )}

            {/* Add Task Form */}
            {showForm && (
              <AddTaskForm onAdd={addTask} onClose={() => setShowForm(false)} />
            )}

            {/* Error */}
            {error && (
              <div
                className="card px-4 py-3 mb-4 text-sm flex items-center justify-between"
                style={{ borderLeft: "3px solid var(--accent)", color: "var(--accent)" }}
              >
                <span>⚠ {error}</span>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="flex justify-center items-center py-16">
                <div className="text-center">
                  <div
                    className="w-10 h-10 rounded-full border-2 animate-spin mx-auto mb-3"
                    style={{
                      borderColor: "var(--accent)",
                      borderTopColor: "transparent",
                    }}
                  />
                  <p style={{ color: "var(--text-secondary)" }} className="text-sm">
                    Loading tasks...
                  </p>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!loading && visibleDates.length === 0 && (
              <div className="text-center py-20">
                <div style={{ fontSize: "60px" }}>
                  {selectedCalendarDate ? "📅" : "📝"}
                </div>
                <h3
                  className="mt-4 text-xl font-semibold"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: "var(--text-primary)",
                  }}
                >
                  {selectedCalendarDate ? "No tasks this day" : "No tasks yet"}
                </h3>
                <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                  {selectedCalendarDate
                    ? "Try selecting a different date or add a new task."
                    : filter !== "all"
                    ? `No ${filter} tasks found.`
                    : 'Click "Add Task" to get started!'}
                </p>
              </div>
            )}

            {/* Task list */}
            {!loading &&
              visibleDates.map((date) => (
                <DateSection
                  key={date}
                  date={date}
                  tasks={tasksByDate[date]}
                  onToggle={toggleTaskCompletion}
                  onDelete={removeTask}
                  onEdit={editTask}
                />
              ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;