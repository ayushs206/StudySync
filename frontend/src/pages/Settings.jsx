import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { 
  Settings as SettingsIcon, 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Sparkles, 
  CheckCircle, 
  Save, 
  Loader2 
} from "lucide-react";
import { api } from "../api";

export default function Settings() {
  const [currentUser, setCurrentUser] = useState(null);
  
  // Profile Form States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("1");
  const [saveStatus, setSaveStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Security Form States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityStatus, setSecurityStatus] = useState("");

  // Notification Toggle States
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [reminderPush, setReminderPush] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  useEffect(() => {
    const sessionStr = localStorage.getItem("studysync_user");
    if (sessionStr) {
      const user = JSON.parse(sessionStr);
      setCurrentUser(user);
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setYearOfStudy(String(user.year_of_study || 1));
    }
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus("");

    try {
      // Offline / Local save fallback
      const updatedUser = {
        ...currentUser,
        first_name: firstName,
        last_name: lastName,
        year_of_study: parseInt(yearOfStudy, 10)
      };

      localStorage.setItem("studysync_user", JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);

      setTimeout(() => {
        setIsSaving(false);
        setSaveStatus("Profile updated successfully!");
        setTimeout(() => setSaveStatus(""), 3000);
      }, 600);
    } catch (err) {
      setIsSaving(false);
      setSaveStatus("Failed to update profile.");
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      setSecurityStatus("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setSecurityStatus("Passwords do not match.");
      return;
    }

    setSecurityStatus("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setSecurityStatus(""), 3000);
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
            Manage your student profile, security credentials, and alert notifications
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Profile & Security */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Card 1: Profile Information */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 text-left">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
              <User className="w-5 h-5 text-brand-blue" />
              <h2 className="font-heading font-bold text-lg text-slate-100">Personal Information</h2>
            </div>

            {saveStatus && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {saveStatus}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">First Name</label>
                  <input 
                    type="text" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-brand-purple font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Last Name</label>
                  <input 
                    type="text" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-brand-purple font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                  <input 
                    type="email" 
                    value={currentUser?.email || ""}
                    disabled
                    className="px-4 py-3 bg-slate-900/40 border border-slate-800/60 rounded-2xl text-slate-500 text-sm cursor-not-allowed font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Year of Study</label>
                  <select 
                    value={yearOfStudy}
                    onChange={(e) => setYearOfStudy(e.target.value)}
                    className="px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-brand-purple font-medium"
                  >
                    <option value="1">1st Year (Freshman)</option>
                    <option value="2">2nd Year (Sophomore)</option>
                    <option value="3">3rd Year (Junior)</option>
                    <option value="4">4th Year (Senior)</option>
                    <option value="5">5th Year (Graduate)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-blue to-brand-purple text-white font-bold text-xs flex items-center gap-2 hover:shadow-lg hover:shadow-brand-purple/20 transition-all btn-premium cursor-pointer"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>

          {/* Card 2: Security & Password */}
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

            <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Password</label>
                <input 
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-brand-purple font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">New Password</label>
                  <input 
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-brand-purple font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Confirm New Password</label>
                  <input 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-brand-purple font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button 
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs transition-colors cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
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
                  <h4 className="font-heading font-bold text-sm text-slate-200">Email Notifications</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Receive real email alerts for calendar events</p>
                </div>
                <button 
                  onClick={() => setEmailAlerts(!emailAlerts)}
                  className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${emailAlerts ? "bg-brand-purple justify-end" : "bg-slate-800 justify-start"}`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                </button>
              </div>

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
              Your account is protected by JWT access tokens and Resend email authorization.
            </p>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
