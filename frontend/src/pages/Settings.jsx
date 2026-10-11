import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import {
  Settings as SettingsIcon,
  Lock,
  Bell,
  Shield,
  Sparkles,
  Loader2,
  BookOpen,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { api } from "../api";

export default function Settings() {
  const [currentUser, setCurrentUser] = useState(null);

  // Security States (reset-link flow, not in-place change)
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [securityStatus, setSecurityStatus] = useState("");

  // Notification Toggle States
  const [reminderPush, setReminderPush] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  // Batch Management States
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [isUpdatingBatch, setIsUpdatingBatch] = useState(false);
  const [batchStatus, setBatchStatus] = useState("");
  const [batchError, setBatchError] = useState("");
  const [showBatchConfirm, setShowBatchConfirm] = useState(false);
  const [electives, setElectives] = useState([]);
  const [userElectives, setUserElectives] = useState({});

  useEffect(() => {
    const sessionStr = localStorage.getItem("studysync_user");
    if (sessionStr) {
      const user = JSON.parse(sessionStr);
      setCurrentUser(user);
      setSelectedBatch(user.batch || "");
      setUserElectives(user.selectedElectives || {});
    }

    async function loadBatchesAndElectives() {
      try {
        const res = await api.getBatches();
        if (res && res.batches) setBatches(res.batches);
      } catch (err) {
        console.error("Failed to load batches:", err);
      }
    }
    loadBatchesAndElectives();
  }, []);

  // Fetch electives whenever selectedBatch changes
  useEffect(() => {
    if (!selectedBatch) return;
    async function loadElectives() {
      try {
        const res = await api.getElectives(selectedBatch);
        if (res && res.electives) {
          setElectives(res.electives);
        }
      } catch (err) {
        console.error("Failed to load electives:", err);
      }
    }
    loadElectives();
  }, [selectedBatch]);

  const handleElectiveChange = (slotKey, subjectCode) => {
    setUserElectives(prev => ({
      ...prev,
      [slotKey]: subjectCode
    }));
  };

  const handleConfirmBatchUpdate = async () => {
    if (!selectedBatch) return;
    setIsUpdatingBatch(true);
    setBatchStatus("");
    setBatchError("");
    try {
      const res = await api.selectBatch({
        batch: selectedBatch,
        selectedElectives: userElectives
      });
      if (res.user) {
        setCurrentUser(res.user);
        localStorage.setItem("studysync_user", JSON.stringify(res.user));
      }
      setBatchStatus(`Batch successfully changed to ${selectedBatch}! Loaded ${res.subjectsCount || 0} subjects.`);
      setShowBatchConfirm(false);
    } catch (err) {
      setBatchError(err.message || "Failed to update batch.");
    } finally {
      setIsUpdatingBatch(false);
      setTimeout(() => {
        setBatchStatus("");
        setBatchError("");
      }, 6000);
    }
  };

  const handleRequestPasswordReset = async () => {
    console.log("Requesting password reset for:", currentUser?.email);
    setSecurityStatus("");
    setIsSendingReset(true);
    try {
      await api.forgotPassword(currentUser?.email);
      setSecurityStatus("If that email exists, a reset link has been sent.");
    } catch (err) {
      setSecurityStatus(err?.message || "Something went wrong. Try again.");
    } finally {
      setIsSendingReset(false);
      setTimeout(() => setSecurityStatus(""), 5000);
    }
  };

  return (
    <DashboardLayout activeTab="settings">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-slate-100 tracking-tight flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-brand-purple" />
            ACCOUNT & WORKSPACE SETTINGS
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
            Manage your security credentials and alert notifications
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Column: Batch & Security */}
        <div className="lg:col-span-8 flex flex-col gap-8">

          {/* Academic Batch & Timetable Setup */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 text-left">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-brand-purple" />
                <div>
                  <h2 className="font-heading font-bold text-lg text-slate-100">Academic Batch & Timetable</h2>
                  <p className="text-xs text-slate-400">Controls your class schedule, subjects, and attendance tracking</p>
                </div>
              </div>
              {currentUser?.batch && (
                <span className="px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 font-bold text-xs">
                  Current: Batch {currentUser.batch}
                </span>
              )}
            </div>

            {batchStatus && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                {batchStatus}
              </div>
            )}

            {batchError && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {batchError}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                  Select Batch
                </label>
                <div className="relative">
                  <select
                    value={selectedBatch}
                    onChange={(e) => {
                      setSelectedBatch(e.target.value);
                      setShowBatchConfirm(false);
                    }}
                    className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-2xl text-slate-100 text-sm font-semibold focus:outline-none focus:border-brand-purple appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-slate-900 text-slate-400">
                      -- Select your academic batch --
                    </option>
                    {batches.map((b) => (
                      <option key={b} value={b} className="bg-slate-900 text-white">
                        Batch {b}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    ▼
                  </div>
                </div>
              </div>

              {/* Elective Selection Options if any exist for this batch */}
              {electives.length > 0 && (
                <div className="mt-2 p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
                  <h3 className="text-xs font-bold text-slate-200 mb-2 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-purple" />
                    Elective Choices for Batch {selectedBatch}
                  </h3>
                  <p className="text-[11px] text-slate-400 mb-3">
                    Choose which elective you attend for the scheduled slots:
                  </p>
                  <div className="flex flex-col gap-3">
                    {electives.map((elec) => (
                      <div key={elec.slotKey} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-slate-800/40 rounded-xl border border-slate-700/60">
                        <span className="text-xs font-semibold text-slate-300">
                          {elec.day} • {elec.time}
                        </span>
                        <select
                          value={userElectives[elec.slotKey] || elec.options[0]?.subject_code || ""}
                          onChange={(e) => handleElectiveChange(elec.slotKey, e.target.value)}
                          className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-medium focus:outline-none focus:border-brand-purple"
                        >
                          {elec.options.map((opt) => (
                            <option key={opt.subject_code} value={opt.subject_code}>
                              {opt.subject_code} - {opt.subject_name} ({opt.place || "Online"})
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warning Notice about Reset */}
              {selectedBatch && selectedBatch !== currentUser?.batch && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-300 text-xs flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                  <div>
                    <strong className="block font-bold mb-1">Important Notice:</strong>
                    Selecting or changing your batch will remove any previously fetched/saved classes, schedules, and attendance, resetting your subject selection and timetable purely to <strong>Batch {selectedBatch}</strong>.
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-2">
                {showBatchConfirm ? (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowBatchConfirm(false)}
                      className="px-4 py-2.5 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmBatchUpdate}
                      disabled={isUpdatingBatch}
                      className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-600/20"
                    >
                      {isUpdatingBatch ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
                      Confirm & Reset To Batch {selectedBatch}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={!selectedBatch || isUpdatingBatch || (selectedBatch === currentUser?.batch && Object.keys(userElectives).length === 0)}
                    onClick={() => {
                      if (currentUser?.batch && selectedBatch !== currentUser.batch) {
                        setShowBatchConfirm(true);
                      } else {
                        handleConfirmBatchUpdate();
                      }
                    }}
                    className="px-6 py-3 rounded-2xl bg-brand-purple hover:bg-purple-600 text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-600/20"
                  >
                    {isUpdatingBatch ? <Loader2 className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4" />}
                    {selectedBatch !== currentUser?.batch ? "Switch Batch" : "Save Batch Electives"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Security & Password (reset-link flow, not in-place change) */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 text-left">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
              <Lock className="w-5 h-5 text-purple-400" />
              <h2 className="font-heading font-bold text-lg text-slate-100">Security & Credentials</h2>
            </div>

            {securityStatus && (
              <div className="mb-4 p-3 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-xl text-xs font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4" />
                {securityStatus}
              </div>
            )}

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              For security, password changes are handled via a reset link sent to your registered email address.
            </p>

            <div className="flex justify-end">
              <button
                onClick={handleRequestPasswordReset}
                disabled={isSendingReset || !currentUser?.email}
                className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSendingReset ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                Send Password Reset Link
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Preferences & Notifications */}
        <div className="lg:col-span-4 flex flex-col gap-8">

          {/* Notification Preferences */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 text-left">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
              <Bell className="w-5 h-5 text-emerald-400" />
              <h2 className="font-heading font-bold text-lg text-slate-100">Notifications</h2>
            </div>

            <div className="flex flex-col gap-5">

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-bold text-sm text-slate-200">Browser Reminders</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Push notifications when classes start</p>
                </div>
                <button
                  onClick={() => setReminderPush(!reminderPush)}
                  className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${reminderPush ? "bg-brand-purple justify-end" : "bg-slate-800 justify-start"}`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-bold text-sm text-slate-200">Weekly Progress Digest</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Summary report of attendance & grades</p>
                </div>
                <button
                  onClick={() => setWeeklyDigest(!weeklyDigest)}
                  className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${weeklyDigest ? "bg-brand-purple justify-end" : "bg-slate-800 justify-start"}`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                </button>
              </div>
            </div>
          </div>

          {/* Account Status Card */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 text-left bg-gradient-to-tr from-brand-purple/10 to-transparent">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              <h3 className="font-heading font-bold text-sm text-slate-100">Account Security Status</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your account is protected.
            </p>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
