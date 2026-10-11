import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { 
  Calendar as CalendarIcon, 
  Sparkles, 
  Clock, 
  MapPin,
  Layers,
  BookOpen,
  Coffee,
  Loader2,
  ChevronRight
} from "lucide-react";
import { api } from "../api";
import { Link } from "react-router-dom";

// Standard canonical timetable timeslots in chronological order
const TIME_SLOTS = [
  "08:00 AM",
  "08:50 AM",
  "09:40 AM",
  "10:30 AM",
  "11:20 AM",
  "12:10 PM",
  "01:00 PM",
  "01:50 PM",
  "02:40 PM",
  "03:30 PM",
  "04:20 PM",
  "05:10 PM",
  "06:00 PM"
];

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function Schedule() {
  const [userBatch, setUserBatch] = useState(null);
  const [loadingSchedule, setLoadingSchedule] = useState(true);
  const [scheduleData, setScheduleData] = useState({});
  const [activeDayFilter, setActiveDayFilter] = useState("All");

  useEffect(() => {
    async function loadSchedule() {
      setLoadingSchedule(true);
      try {
        const res = await api.getWeeklyTimetable();
        if (res && res.weeklySchedule) {
          setUserBatch(res.batch);
          setScheduleData(res.weeklySchedule);
        }
      } catch (err) {
        console.error("Failed to load batch schedule:", err);
      } finally {
        setLoadingSchedule(false);
      }
    }
    loadSchedule();
  }, []);

  // Map session type to styling colors
  const getTypeBadge = (type) => {
    switch (type) {
      case "Practical":
        return {
          bg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
          cardBorder: "border-emerald-500/40 hover:border-emerald-400",
          bar: "bg-emerald-500",
          label: "Practical (0.5 wt)"
        };
      case "Tutorial":
        return {
          bg: "bg-amber-500/15 border-amber-500/30 text-amber-400",
          cardBorder: "border-amber-500/40 hover:border-amber-400",
          bar: "bg-amber-500",
          label: "Tutorial (0.5 wt)"
        };
      case "Lecture":
      default:
        return {
          bg: "bg-brand-blue/15 border-brand-blue/30 text-sky-400",
          cardBorder: "border-brand-purple/40 hover:border-brand-purple",
          bar: "bg-brand-purple",
          label: "Lecture (1.0 wt)"
        };
    }
  };

  // Build grid slot lookup map: slotLookup[`${day}_${time}`] = slotObject
  const slotLookup = {};
  for (const [dayName, slots] of Object.entries(scheduleData)) {
    if (Array.isArray(slots)) {
      for (const slot of slots) {
        slotLookup[`${dayName}_${slot.time}`] = slot;
      }
    }
  }

  const displayedDays = activeDayFilter === "All" 
    ? DAYS_OF_WEEK 
    : [activeDayFilter];

  return (
    <DashboardLayout activeTab="schedule">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading font-extrabold text-3xl text-slate-100 tracking-tight flex items-center gap-3">
              <CalendarIcon className="w-8 h-8 text-brand-purple" />
              WEEKLY SCHEDULE GRID
            </h1>
            {userBatch && (
              <span className="px-3 py-1 bg-brand-purple/20 text-brand-purple border border-brand-purple/30 rounded-xl text-xs font-bold">
                Batch {userBatch}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
            {userBatch 
              ? `Master grid mapped respective to time. Free slots are clearly identified.` 
              : "No batch selected. Head to Settings to select your batch and auto-load your schedule."}
          </p>
        </div>

        {/* Day Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-2xl">
          <button
            onClick={() => setActiveDayFilter("All")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeDayFilter === "All"
                ? "bg-brand-purple text-white shadow-md shadow-brand-purple/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            All Days
          </button>
          {DAYS_OF_WEEK.map((d) => (
            <button
              key={d}
              onClick={() => setActiveDayFilter(d)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeDayFilter === d
                  ? "bg-brand-purple text-white shadow-md shadow-brand-purple/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              {d.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {loadingSchedule ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-400 text-xs">
          <Loader2 className="w-8 h-8 animate-spin text-brand-purple mb-3" />
          Loading your weekly schedule grid...
        </div>
      ) : !userBatch ? (
        <div className="p-12 glass-card border border-slate-800 rounded-3xl text-center flex flex-col items-center justify-center gap-3">
          <BookOpen className="w-12 h-12 text-brand-purple opacity-40 mb-2" />
          <h3 className="font-heading font-bold text-lg text-slate-100">No Academic Batch Selected</h3>
          <p className="text-xs text-slate-400 max-w-md">
            Please choose your academic batch to view your weekly timetable slots and free periods mapped by time.
          </p>
          <Link
            to="/settings"
            className="mt-2 px-5 py-2.5 bg-gradient-to-r from-brand-blue to-brand-purple text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-brand-purple/20 transition-all"
          >
            Go to Settings <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        /* Responsive Time-Slot Grid */
        <div className="w-full overflow-x-auto pb-6 rounded-3xl border border-slate-800/80 bg-slate-950/40 backdrop-blur-md shadow-2xl">
          <table className="w-full border-collapse min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 text-[11px] font-bold uppercase tracking-wider sticky top-0 z-20 backdrop-blur-md">
                <th className="py-3.5 px-4 w-32 border-r border-slate-800/80 bg-slate-900">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-brand-purple" />
                    Time Slot
                  </div>
                </th>
                {displayedDays.map((d) => (
                  <th key={d} className="py-3.5 px-4 text-center border-r border-slate-800/60 last:border-r-0">
                    <span className="text-slate-200">{d}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {TIME_SLOTS.map((time, idx) => {
                const isEvenRow = idx % 2 === 0;
                return (
                  <tr 
                    key={time} 
                    className={`transition-colors ${isEvenRow ? "bg-slate-900/20" : "bg-transparent"} hover:bg-slate-800/20`}
                  >
                    {/* Time Label Column */}
                    <td className="py-4 px-4 font-mono font-bold text-[11px] text-slate-300 border-r border-slate-800/80 whitespace-nowrap bg-slate-900/30">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-purple/70"></span>
                        {time}
                      </div>
                    </td>

                    {/* Day Slot Cells */}
                    {displayedDays.map((dayName) => {
                      const slot = slotLookup[`${dayName}_${time}`];

                      if (slot) {
                        const style = getTypeBadge(slot.sessionType);
                        return (
                          <td 
                            key={`${dayName}_${time}`} 
                            className="p-2 border-r border-slate-800/60 last:border-r-0 align-top"
                          >
                            <div className={`p-3 rounded-2xl bg-slate-900/90 border ${style.cardBorder} shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-brand-purple/10 flex flex-col justify-between h-full min-h-[92px] group`}>
                              <div>
                                <div className="flex items-center justify-between gap-1 mb-1.5">
                                  <span className="font-mono font-extrabold text-[11px] text-slate-200 group-hover:text-purple-300 transition-colors">
                                    {slot.subject_code}
                                  </span>
                                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${style.bg}`}>
                                    {style.label}
                                  </span>
                                </div>
                                <h4 className="font-heading font-bold text-xs text-slate-100 line-clamp-2 leading-tight">
                                  {slot.subject_name}
                                </h4>
                              </div>

                              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2.5 pt-2 border-t border-slate-800/60">
                                <span className="flex items-center gap-1 font-medium text-slate-300">
                                  <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                                  {slot.location || "Room TBA"}
                                </span>
                                {slot.base_subject_code && slot.base_subject_code !== slot.subject_code && (
                                  <span className="text-[9px] text-slate-500 font-mono">
                                    Base: {slot.base_subject_code}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                        );
                      }

                      // Empty Free Slot
                      return (
                        <td 
                          key={`${dayName}_${time}`} 
                          className="p-2 border-r border-slate-800/60 last:border-r-0 align-middle text-center"
                        >
                          <div className="rounded-2xl border border-dashed border-slate-800/60 p-3 min-h-[92px] flex flex-col items-center justify-center text-slate-600 hover:border-slate-700 hover:text-slate-500 transition-colors">
                            <Coffee className="w-4 h-4 opacity-40 mb-1" />
                            <span className="text-[10px] font-semibold tracking-wide">Free Slot</span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
