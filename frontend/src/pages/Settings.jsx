import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import {
  Settings as SettingsIcon,
  Lock,
  Bell,
  Shield,
  Sparkles,
  Loader2
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

  useEffect(() => {
    const sessionStr = localStorage.getItem("studysync_user");
    if (sessionStr) {
      const user = JSON.parse(sessionStr);
      setCurrentUser(user);
    }
  }, []);

  const handleRequestPasswordReset = async () => {
    console.log("Requesting password reset for:", currentUser?.email);
    setSecurityStatus("");
    setIsSendingReset(true);
    try {
      // NOTE: confirm this path matches your actual Express route exactly
      // (hyphen vs underscore matters — check routes file, don't assume)
      await api.forgotPassword("/auth/forgot_password", { email: currentUser?.email });
      setSecurityStatus("If that email exists, a reset link has been sent.");
    } catch (err) {
      setSecurityStatus(err?.response?.data?.message || "Something went wrong. Try again.");
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

        {/* Left Column: Security */}
        <div className="lg:col-span-8 flex flex-col gap-8">

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
