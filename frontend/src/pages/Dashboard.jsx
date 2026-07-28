import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  ChevronRight, 
  CheckCircle, 
  Clock,
  Sparkles,
  BookMarked,
  Layers,
  UserCheck,
  Plus,
  Trash2,
  Bookmark,
  CheckSquare,
  Square,
  Mail,
  Shield,
  Activity,
  Server,
  Database,
  Menu,
  X,
  Send,
  Loader2,
  Edit3,
  XCircle,
  AlertCircle
} from "lucide-react";
import { api, setAccessToken } from "../api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(18);
  const [notificationCount, setNotificationCount] = useState(2);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminViewMode, setAdminViewMode] = useState("student"); // 'student' | 'admin'

  // Email verification resend states
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendStatusMsg, setResendStatusMsg] = useState("");

  // --- 1. TRACK & EDIT ATTENDANCE (WITH 3 BACKEND STATUSES: Present, Absent, Cancelled) ---
  const [subjects, setSubjects] = useState([
    { 
      id: 1, 
      code: "CS 101", 
      name: "Intro to Programming", 
      time: "09:00 AM", 
      present: 14, 
      absent: 2, 
      cancelled: 1, 
      todayStatus: "present" 
    },
    { 
      id: 2, 
      code: "ME 201", 
      name: "Robotics Laboratory", 
      time: "11:30 AM", 
      present: 10, 
      absent: 3, 
      cancelled: 2, 
      todayStatus: "absent" 
    },
    { 
      id: 3, 
      code: "MA 102", 
      name: "Calculus & Analysis II", 
      time: "02:00 PM", 
      present: 12, 
      absent: 1, 
      cancelled: 0, 
      todayStatus: "cancelled" 
    }
  ]);

  // Subject Modal States
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [subjectCodeInput, setSubjectCodeInput] = useState("");
  const [subjectNameInput, setSubjectNameInput] = useState("");
  const [subjectTimeInput, setSubjectTimeInput] = useState("");

  // --- 2. STORE NOTES ---
  const [notes, setNotes] = useState([
    { id: 1, title: "Kinematics Lecture", content: "Notes on joint rotations, degrees of freedom, and matrices.", date: "May 18" },
    { id: 2, title: "C++ Vectors Cheat Sheet", content: "std::vector initialization, push_back, size, and capacity rules.", date: "May 17" }
  ]);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [showNoteForm, setShowNoteForm] = useState(false);

  // --- 3. MANAGE TASKS ---
  const [tasks, setTasks] = useState([
    { id: 1, text: "Finish Robotics arm CAD draft", completed: false },
    { id: 2, text: "Revise I2C protocol timing diagrams", completed: true },
    { id: 3, text: "Read Chapter 4 of Calculus textbook", completed: false }
  ]);
  const [newTaskText, setNewTaskText] = useState("");

  // --- 4. KEEP CALENDAR REMINDERS ---
  const [reminders, setReminders] = useState([
    { id: 1, title: "Robot Fest Exhibit", date: "May 22", time: "13:00", reminderActive: true },
    { id: 2, title: "Webinar on CAD Modeling", date: "May 25", time: "15:00", reminderActive: false },
    { id: 3, title: "Calculus Quiz 3", date: "May 19", time: "10:00", reminderActive: true }
  ]);
  const [newReminderTitle, setNewReminderTitle] = useState("");
  const [newReminderTime, setNewReminderTime] = useState("");
  const [newReminderDate, setNewReminderDate] = useState("May 18");
  const [showReminderForm, setShowReminderForm] = useState(false);

  // Admin stats
  const [systemUsers, setSystemUsers] = useState([
    { id: 1, name: "Sophia Tompson", email: "sophia@studysync.edu", username: "sophia_t", year: "3rd Year", verified: false },
    { id: 2, name: "Alex Carter", email: "alex.c@studysync.edu", username: "alex_c", year: "1st Year", verified: true },
    { id: 3, name: "Marcus Aurelius", email: "marcus@studysync.edu", username: "philosopher", year: "4th Year", verified: true },
    { id: 4, name: "Zoe Jenkins", email: "zoe@studysync.edu", username: "zoe_codes", year: "2nd Year", verified: false }
  ]);
  
  const [serverStats, setServerStats] = useState({
    cpuLoad: 24,
    dbLatency: "14ms",
    activeLobbies: 18,
    memoryUsage: 45
  });

  // Load user session
  useEffect(() => {
    let isMounted = true;

    async function fetchUser() {
      try {
        const res = await api.getMe();
        if (isMounted && res.user) {
          setCurrentUser(res.user);
          localStorage.setItem("studysync_user", JSON.stringify(res.user));
          setLoadingUser(false);
          return;
        }
      } catch (err) {
        const sessionStr = localStorage.getItem("studysync_user");
        if (sessionStr) {
          setCurrentUser(JSON.parse(sessionStr));
          setLoadingUser(false);
          return;
        }
        // Fallback default user if not logged in
        setCurrentUser({
          first_name: "Alex",
          last_name: "Student",
          email: "alex@studysync.edu",
          role: "user",
          year_of_study: 2,
          isVerified: true
        });
        setLoadingUser(false);
      }
    }

    fetchUser();
    return () => { isMounted = false; };
  }, [navigate]);

  if (loadingUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#090d16] text-slate-100 font-heading font-bold text-sm">
        <Loader2 className="w-10 h-10 text-brand-purple animate-spin mb-4" />
        Loading your StudySync workspace...
      </div>
    );
  }

  if (!currentUser) return null;

  // ATTENDANCE STATS
  const totalPresent = subjects.reduce((sum, s) => sum + s.present, 0);
  const totalAbsent = subjects.reduce((sum, s) => sum + s.absent, 0);
  const totalCancelled = subjects.reduce((sum, s) => sum + s.cancelled, 0);
  const totalConducted = totalPresent + totalAbsent;
  const overallAttendanceRate = totalConducted > 0 ? Math.round((totalPresent / totalConducted) * 100) : 100;

  // Mark 3 statuses: 'present' | 'absent' | 'cancelled'
  const handleMarkAttendance = (subjectId, status) => {
    setSubjects(subjects.map(s => {
      if (s.id === subjectId) {
        let newPresent = s.present;
        let newAbsent = s.absent;
        let newCancelled = s.cancelled;

        if (s.todayStatus === "present") newPresent = Math.max(0, newPresent - 1);
        if (s.todayStatus === "absent") newAbsent = Math.max(0, newAbsent - 1);
        if (s.todayStatus === "cancelled") newCancelled = Math.max(0, newCancelled - 1);

        if (status === "present") newPresent += 1;
        if (status === "absent") newAbsent += 1;
        if (status === "cancelled") newCancelled += 1;

        return {
          ...s,
          present: newPresent,
          absent: newAbsent,
          cancelled: newCancelled,
          todayStatus: s.todayStatus === status ? null : status
        };
      }
      return s;
    }));
  };

  // Add/Edit Subject
  const handleSaveSubject = (e) => {
    e.preventDefault();
    if (!subjectCodeInput || !subjectNameInput) return;

    if (editingSubjectId) {
      setSubjects(subjects.map(s => 
        s.id === editingSubjectId 
          ? { ...s, code: subjectCodeInput, name: subjectNameInput, time: subjectTimeInput || "10:00 AM" }
          : s
      ));
    } else {
      setSubjects([...subjects, {
        id: Date.now(),
        code: subjectCodeInput,
        name: subjectNameInput,
        time: subjectTimeInput || "10:00 AM",
        present: 0,
        absent: 0,
        cancelled: 0,
        todayStatus: null
      }]);
    }

    setSubjectCodeInput("");
    setSubjectNameInput("");
    setSubjectTimeInput("");
    setEditingSubjectId(null);
    setShowAddSubjectModal(false);
  };

  const openEditSubject = (sub) => {
    setEditingSubjectId(sub.id);
    setSubjectCodeInput(sub.code);
    setSubjectNameInput(sub.name);
    setSubjectTimeInput(sub.time);
    setShowAddSubjectModal(true);
  };

  const handleDeleteSubject = (id) => setSubjects(subjects.filter(s => s.id !== id));

  // REAL EMAIL VERIFICATION RESEND
  const handleResendRealVerification = async () => {
    setIsVerifying(true);
    setResendStatusMsg("");
    try {
      await api.resendVerification();
      setResendStatusMsg("Verification email sent! Check your inbox.");
    } catch (err) {
      setResendStatusMsg(err.message || "Failed to resend email.");
    } finally {
      setIsVerifying(false);
    }
  };

  // NOTES ACTIONS
  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteTitle || !newNoteContent) return;
    setNotes([{ id: Date.now(), title: newNoteTitle, content: newNoteContent, date: `May ${selectedDate}` }, ...notes]);
    setNewNoteTitle("");
    setNewNoteContent("");
    setShowNoteForm(false);
  };
  const handleDeleteNote = (id) => setNotes(notes.filter(n => n.id !== id));

  // TASKS ACTIONS
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText) return;
    setTasks([...tasks, { id: Date.now(), text: newTaskText, completed: false }]);
    setNewTaskText("");
  };
  const handleToggleTask = (id) => setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const handleDeleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));
  const completedTasksCount = tasks.filter(t => t.completed).length;
  const taskCompletionRate = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  // REMINDERS ACTIONS
  const handleAddReminder = (e) => {
    e.preventDefault();
    if (!newReminderTitle || !newReminderTime) return;
    setReminders([...reminders, { id: Date.now(), title: newReminderTitle, time: newReminderTime, date: newReminderDate, reminderActive: true }]);
    setNewReminderTitle("");
    setNewReminderTime("");
    setShowReminderForm(false);
  };

  const handleToggleReminder = (id) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, reminderActive: !r.reminderActive } : r));
  };
  const handleDeleteReminder = (id) => setReminders(reminders.filter(r => r.id !== id));
  const activeRemindersCount = reminders.filter(r => r.reminderActive).length;

  const handleLogout = async () => {
    try { await api.logout(); } catch (e) {}
    setAccessToken(null);
    localStorage.removeItem("studysync_user");
    navigate("/login");
  };

  const userInitials = (currentUser.first_name?.charAt(0) || "") + (currentUser.last_name?.charAt(0) || "");
  const yearString = currentUser.year_of_study 
    ? `${currentUser.year_of_study}${currentUser.year_of_study === 1 ? "st" : currentUser.year_of_study === 2 ? "nd" : currentUser.year_of_study === 3 ? "rd" : "th"} Year Student`
    : "Graduate Student";

  const isShowingAdminConsole = currentUser.role === "admin" && adminViewMode === "admin";

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#090d16] text-slate-100 relative">
      
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-slate-950/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 1. Left Sidebar Navigation */}
      <aside className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 
        fixed md:relative 
        inset-y-0 left-0 
        z-40 md:z-auto 
        w-64 
        bg-slate-900 border-r border-slate-800 
        p-6 flex flex-col justify-between shrink-0 
        transition-transform duration-300 ease-in-out
      `}>
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-blue via-brand-purple to-brand-green p-0.5 shadow-sm">
                <div className="w-full h-full bg-slate-900 rounded-[9px] flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-brand-purple" />
                </div>
              </div>
              <span className="font-heading font-bold text-xl tracking-tight bg-gradient-to-r from-brand-blue via-brand-purple to-brand-green bg-clip-text text-transparent">
                StudySync
              </span>
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-tr from-brand-blue/10 via-brand-purple/10 to-brand-green/10 border border-slate-800 flex items-center gap-3 text-left">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${currentUser.role === "admin" ? "from-brand-purple to-brand-green" : "from-brand-blue to-brand-purple"} flex items-center justify-center text-white font-bold shadow-md shadow-brand-purple/10 uppercase`}>
              {userInitials || "U"}
            </div>
            <div>
              <p className="font-heading font-bold text-sm text-slate-100 truncate max-w-[130px]">{currentUser.first_name} {currentUser.last_name}</p>
              <p className="text-xs text-slate-400 font-medium truncate max-w-[130px]">
                {currentUser.role === "admin" ? "System Admin" : yearString}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 text-left">
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-purple/20 text-purple-400 font-semibold text-sm transition-colors w-full">
              <Layers className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            
            <Link to="/classes" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-brand-purple/10 hover:text-purple-400 font-medium text-sm transition-colors w-full">
              <BookMarked className="w-4 h-4" />
              <span>My Classes</span>
            </Link>

            

            <Link to="/schedule" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-brand-purple/10 hover:text-purple-400 font-medium text-sm transition-colors w-full">
              <Calendar className="w-4 h-4" />
              <span>Schedule</span>
            </Link>

            

            <Link to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-brand-purple/10 hover:text-purple-400 font-medium text-sm transition-colors w-full">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
          </nav>
        </div>

        {/* Logout */}
        <div className="pt-6 border-t border-slate-800 mt-6 text-left">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-950/30 font-semibold text-sm transition-colors w-full cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* Mobile hamburger button */}
        <button 
          onClick={() => setSidebarOpen(true)}
          className="md:hidden mb-4 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 shadow-sm"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Real Email Verification Warning Banner */}
        {!currentUser.isVerified && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-brand-blue/10 via-brand-purple/10 to-brand-green/10 border border-brand-purple/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-sm gradient-border-animated animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-purple/15 text-brand-purple flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <p className="font-heading font-bold text-sm text-slate-100">Verify Your Email Address</p>
                <p className="text-xs text-slate-400 mt-0.5">Please check your inbox for the real verification link sent to <strong>{currentUser.email}</strong></p>
                {resendStatusMsg && (
                  <p className="text-[11px] font-bold text-emerald-400 mt-1">{resendStatusMsg}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handleResendRealVerification}
                disabled={isVerifying}
                className="px-4 py-2 text-xs font-bold bg-brand-purple text-white rounded-xl shadow-md shadow-brand-purple/10 hover:shadow-lg hover:shadow-brand-purple/15 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                {isVerifying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                Resend Email
              </button>
            </div>
          </div>
        )}

        {/* Top Header Bar */}
        <header className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8 pb-6 border-b border-slate-800/50">
          <div className="text-left w-full sm:w-auto">
            <h1 className="font-heading font-extrabold text-3xl text-slate-100 tracking-tight margin-0 leading-none">
              {isShowingAdminConsole ? "ADMIN SYSTEMS CONSOLE" : `HELLO, ${currentUser.first_name.toUpperCase()}!`}
            </h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-brand-purple" />
              {isShowingAdminConsole 
                ? "StudySync centralized server administration dashboard" 
                : "Tracking your attendance, notes, tasks & event reminders"}
            </p>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
            {/* View Mode Toggle if Admin */}
            {currentUser.role === "admin" && (
              <div className="bg-slate-900 border border-slate-800 p-1 rounded-2xl flex items-center text-xs font-bold">
                <button 
                  onClick={() => setAdminViewMode("student")}
                  className={`px-3 py-1.5 rounded-xl transition-all ${adminViewMode === "student" ? "bg-brand-purple text-white shadow-sm" : "text-slate-400 hover:text-white"}`}
                >
                  Student View
                </button>
                <button 
                  onClick={() => setAdminViewMode("admin")}
                  className={`px-3 py-1.5 rounded-xl transition-all ${adminViewMode === "admin" ? "bg-brand-purple text-white shadow-sm" : "text-slate-400 hover:text-white"}`}
                >
                  Admin Console
                </button>
              </div>
            )}

            <div className="relative flex items-center w-full sm:w-60 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 shadow-inner">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input 
                type="text" 
                placeholder="Search features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-7 pr-2 text-sm text-slate-200 bg-transparent focus:outline-none w-full placeholder:text-slate-500 font-medium"
              />
            </div>

            <button 
              onClick={() => setNotificationCount(0)}
              className="w-11 h-11 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300 transition-colors relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center animate-bounce">
                  {notificationCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* ---------------------------------------------------- */}
        {/* CASE A: RENDER ADMIN DASHBOARD ONLY IF ADMIN CONSOLE */}
        {/* ---------------------------------------------------- */}
        {isShowingAdminConsole ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left widgets */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              
              {/* Admin Widget 1: User Management Directory */}
              <div className="glass-card p-6 rounded-3xl border border-slate-800/60 text-left hover:-translate-y-0.5 transition-all animate-entrance">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="font-heading font-bold text-lg text-slate-100">User Management Directory</h2>
                    <p className="text-xs text-slate-400 font-semibold">Toggle verification tokens or delete student accounts</p>
                  </div>
                  <span className="text-xs font-bold text-brand-purple bg-brand-purple/20 px-2.5 py-1 rounded-xl">
                    {systemUsers.length} total users
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="pb-3 font-semibold">Name</th>
                        <th className="pb-3 font-semibold">Username</th>
                        <th className="pb-3 font-semibold">Year</th>
                        <th className="pb-3 font-semibold">Verification Status</th>
                        <th className="pb-3 text-center font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {systemUsers
                        .filter(u => 
                          u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map(user => (
                          <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                            <td className="py-3">
                              <p className="font-bold text-slate-200">{user.name}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{user.email}</p>
                            </td>
                            <td className="py-3 font-medium text-slate-400">@{user.username}</td>
                            <td className="py-3 text-slate-400">{user.year}</td>
                            <td className="py-3">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[9px] ${
                                user.verified 
                                  ? "bg-emerald-500/10 text-emerald-400" 
                                  : "bg-amber-500/10 text-amber-400"
                              }`}>
                                {user.verified ? "Verified" : "Pending Verify"}
                              </span>
                            </td>
                            <td className="py-3 text-center flex items-center justify-center gap-2">
                              <button 
                                onClick={() => setSystemUsers(systemUsers.map(u => u.id === user.id ? { ...u, verified: !u.verified } : u))}
                                className="px-2.5 py-1 rounded-xl text-[10px] font-bold border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
                              >
                                {user.verified ? "Revoke" : "Verify"}
                              </button>
                            </td>
                          </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>
        ) : (
          
          // ----------------------------------------------------
          // CASE B: RENDER ALL 4 STUDENT WORKSPACE WIDGETS      
          // ----------------------------------------------------
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column Widgets */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              
              {/* WIDGET 1: TRACK & EDIT ATTENDANCE (WITH 3 BACKEND STATUSES) */}
              <div className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-800/80 text-left hover:-translate-y-0.5 transition-all animate-entrance">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-brand-green/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-heading font-extrabold text-xl text-slate-100">Track & Edit Attendance</h2>
                      <p className="text-xs text-slate-400 font-medium">
                        Mark 3 backend statuses: <span className="text-emerald-400 font-bold">Present</span>, <span className="text-rose-400 font-bold">Absent</span>, or <span className="text-amber-400 font-bold">Cancelled</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        setEditingSubjectId(null);
                        setSubjectCodeInput("");
                        setSubjectNameInput("");
                        setSubjectTimeInput("");
                        setShowAddSubjectModal(true);
                      }}
                      className="px-3.5 py-2 bg-gradient-to-r from-brand-blue to-brand-purple text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:shadow-md transition-all cursor-pointer shrink-0"
                    >
                      <Plus className="w-4 h-4" /> Add Subject Class
                    </button>
                  </div>
                </div>

                {/* Subject Attendance Cards */}
                <div className="flex flex-col gap-4">
                  {subjects.map((sub) => {
                    const subConducted = sub.present + sub.absent;
                    const subRate = subConducted > 0 ? Math.round((sub.present / subConducted) * 100) : 100;

                    return (
                      <div key={sub.id} className="p-4 bg-slate-900/70 border border-slate-800/90 rounded-2xl flex flex-col gap-3 hover:border-slate-700 transition-all">
                        
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-heading font-bold text-xs text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded-md border border-brand-blue/20">
                                {sub.code}
                              </span>
                              <span className="font-heading font-bold text-sm text-slate-100">{sub.name}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-semibold mt-1 block flex items-center gap-1">
                              <Clock className="w-3 h-3 text-brand-purple" /> {sub.time}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <span className={`font-heading font-extrabold text-sm ${subRate >= 75 ? "text-emerald-400" : "text-rose-400"}`}>
                                {subRate}% Attendance
                              </span>
                              <span className="text-[10px] text-slate-400 block font-medium">
                                ({sub.present} Attended / {subConducted} Conducted)
                              </span>
                            </div>

                            <div className="flex items-center gap-1 pl-2 border-l border-slate-800">
                              <button 
                                onClick={() => openEditSubject(sub)}
                                className="p-1.5 text-slate-400 hover:text-brand-purple rounded-lg hover:bg-slate-800 transition-colors"
                                title="Edit Class Details"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteSubject(sub.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                                title="Delete Class"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* 3 Status Options to Mark Today */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800/60 text-xs">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Mark Today's Status:
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleMarkAttendance(sub.id, "present")}
                              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition-all cursor-pointer ${
                                sub.todayStatus === "present"
                                  ? "bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/20 scale-105"
                                  : "bg-slate-800 border-slate-700 text-emerald-400 hover:bg-emerald-500/10"
                              }`}
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Present ({sub.present})
                            </button>

                            <button
                              onClick={() => handleMarkAttendance(sub.id, "absent")}
                              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition-all cursor-pointer ${
                                sub.todayStatus === "absent"
                                  ? "bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/20 scale-105"
                                  : "bg-slate-800 border-slate-700 text-rose-400 hover:bg-rose-500/10"
                              }`}
                            >
                              <XCircle className="w-3.5 h-3.5" /> Absent ({sub.absent})
                            </button>

                            <button
                              onClick={() => handleMarkAttendance(sub.id, "cancelled")}
                              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition-all cursor-pointer ${
                                sub.todayStatus === "cancelled"
                                  ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 scale-105"
                                  : "bg-slate-800 border-slate-700 text-amber-400 hover:bg-amber-500/10"
                              }`}
                            >
                              <AlertCircle className="w-3.5 h-3.5" /> Cancelled ({sub.cancelled})
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>

                {/* Footer Summary */}
                <div className="pt-4 mt-4 border-t border-slate-800 text-xs text-slate-400 font-semibold flex flex-wrap justify-between items-center gap-2">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <CheckCircle className="w-3.5 h-3.5" /> Attended: {totalPresent}
                    </span>
                    <span className="flex items-center gap-1 text-rose-400 font-bold">
                      <XCircle className="w-3.5 h-3.5" /> Missed: {totalAbsent}
                    </span>
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <AlertCircle className="w-3.5 h-3.5" /> Cancelled: {totalCancelled}
                    </span>
                  </div>

                  <span className="font-extrabold text-slate-100">
                    Overall Rate: {overallAttendanceRate}%
                  </span>
                </div>
              </div>

              {/* WIDGET 2 & 3: STORE NOTES & MANAGE TASKS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* WIDGET 2: STORE NOTES */}
                <div className="glass-card p-6 rounded-3xl border border-slate-800/60 text-left flex flex-col justify-between min-h-[280px]">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center">
                          <Bookmark className="w-4 h-4" />
                        </div>
                        <h2 className="font-heading font-bold text-lg text-slate-100">Store Notes</h2>
                      </div>
                      <button 
                        onClick={() => setShowNoteForm(!showNoteForm)}
                        className="w-7 h-7 rounded-lg border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-slate-800"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {showNoteForm ? (
                      <form onSubmit={handleAddNote} className="flex flex-col gap-2 p-2 bg-slate-900/50 border border-slate-800 rounded-2xl animate-fade-in mb-3">
                        <input 
                          type="text" 
                          placeholder="Note Title" 
                          value={newNoteTitle}
                          onChange={(e) => setNewNoteTitle(e.target.value)}
                          className="px-3 py-1.5 text-xs border border-slate-700 rounded-lg focus:outline-none w-full bg-slate-800 text-slate-100 font-medium"
                        />
                        <textarea 
                          placeholder="Content summary..." 
                          value={newNoteContent}
                          onChange={(e) => setNewNoteContent(e.target.value)}
                          className="px-3 py-1.5 text-xs border border-slate-700 rounded-lg focus:outline-none w-full bg-slate-800 text-slate-100 h-12 resize-none font-medium"
                        />
                        <div className="flex gap-2 justify-end">
                          <button type="button" onClick={() => setShowNoteForm(false)} className="text-[9px] font-bold px-2 py-1 text-slate-500 hover:underline">Cancel</button>
                          <button type="submit" className="text-[9px] font-bold px-3 py-1 bg-brand-blue text-white rounded-lg">Save</button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex flex-col gap-3 max-h-[160px] overflow-y-auto pr-1">
                        {notes.map((note) => (
                          <div key={note.id} className="p-2.5 bg-slate-900/40 border border-slate-800 rounded-2xl flex justify-between items-start gap-2">
                            <div className="min-w-0 text-left">
                              <span className="font-heading font-bold text-xs text-slate-200 block truncate">{note.title}</span>
                              <span className="text-[10px] text-slate-400 leading-normal block mt-0.5 truncate">{note.content}</span>
                            </div>
                            <button 
                              onClick={() => handleDeleteNote(note.id)}
                              className="text-slate-400 hover:text-rose-500 p-0.5 shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 font-semibold flex justify-between items-center">
                    <span>Saved Notes: {notes.length}</span>
                    <button className="text-[10px] text-brand-blue font-bold hover:underline">View folders</button>
                  </div>
                </div>

                {/* WIDGET 3: MANAGE TASKS */}
                <div className="glass-card p-6 rounded-3xl border border-slate-800/60 text-left flex flex-col justify-between min-h-[280px]">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        <h2 className="font-heading font-bold text-lg text-slate-100">Manage Tasks</h2>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-purple/20 text-purple-400">
                        {taskCompletionRate}% Done
                      </span>
                    </div>

                    <form onSubmit={handleAddTask} className="flex gap-2 mb-3">
                      <input 
                        type="text" 
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                        placeholder="Add a task..."
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-purple font-medium"
                      />
                      <button type="submit" className="px-3 bg-brand-purple text-white rounded-xl flex items-center justify-center">
                        <Plus className="w-4 h-4" />
                      </button>
                    </form>

                    <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto pr-1">
                      {tasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-2.5 bg-slate-900/50 border border-slate-800/40 rounded-xl">
                          <button 
                            onClick={() => handleToggleTask(task.id)}
                            className="flex items-center gap-2.5 text-left w-full focus:outline-none cursor-pointer"
                          >
                            {task.completed ? (
                              <CheckSquare className="w-4 h-4 text-brand-purple shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-600 shrink-0" />
                            )}
                            <span className={`text-xs font-medium text-slate-200 ${task.completed ? "line-through text-slate-500" : ""}`}>
                              {task.text}
                            </span>
                          </button>
                          <button onClick={() => handleDeleteTask(task.id)} className="text-slate-400 hover:text-rose-500 p-0.5">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 font-semibold flex justify-between items-center">
                    <span>Completed: {completedTasksCount} / {tasks.length}</span>
                  </div>
                </div>

              </div>

              {/* WIDGET 4: KEEP CALENDAR REMINDERS */}
              <div className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-800/80 text-left hover:-translate-y-0.5 transition-all">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-brand-purple/20 text-purple-400 flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-heading font-extrabold text-xl text-slate-100">Keep Calendar Reminders</h2>
                      <p className="text-xs text-slate-400 font-medium">Organize upcoming quizzes, deadlines, & exhibits</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowReminderForm(!showReminderForm)}
                    className="px-3 py-1.5 bg-brand-purple/20 text-purple-300 hover:bg-brand-purple/30 border border-brand-purple/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Reminder
                  </button>
                </div>

                {showReminderForm && (
                  <form onSubmit={handleAddReminder} className="mb-6 p-4 bg-slate-900/80 border border-slate-800 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Event Title</label>
                      <input 
                        type="text" 
                        placeholder="Title" 
                        value={newReminderTitle}
                        onChange={(e) => setNewReminderTitle(e.target.value)}
                        className="px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-brand-purple text-slate-100 font-medium"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Time</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 10:00 AM" 
                        value={newReminderTime}
                        onChange={(e) => setNewReminderTime(e.target.value)}
                        className="px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-brand-purple text-slate-100 font-medium"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Date</label>
                      <select 
                        value={newReminderDate}
                        onChange={(e) => setNewReminderDate(e.target.value)}
                        className="px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-brand-purple text-slate-100 font-medium"
                      >
                        <option value="May 18">May 18</option>
                        <option value="May 19">May 19</option>
                        <option value="May 20">May 20</option>
                        <option value="May 21">May 21</option>
                        <option value="May 22">May 22</option>
                        <option value="May 25">May 25</option>
                      </select>
                    </div>
                    <div className="sm:col-span-3 flex justify-end gap-2 mt-2">
                      <button type="button" onClick={() => setShowReminderForm(false)} className="text-xs font-bold text-slate-500 hover:underline">Cancel</button>
                      <button type="submit" className="text-xs font-bold px-4 py-1.5 bg-brand-purple text-white rounded-xl">Add Event</button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {reminders.map((rem) => (
                    <div 
                      key={rem.id} 
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between min-h-[120px] ${
                        rem.reminderActive 
                          ? "bg-brand-purple/15 border-brand-purple/20 shadow-sm" 
                          : "border-slate-800/50 bg-slate-900/20"
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-heading font-extrabold text-xs text-slate-100 leading-tight block">{rem.title}</span>
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => handleToggleReminder(rem.id)}
                              className={`p-1 rounded-lg ${rem.reminderActive ? "text-brand-purple bg-brand-purple/10" : "text-slate-400 bg-slate-800"}`}
                              title="Toggle Reminder Notification"
                            >
                              <Bell className={`w-3.5 h-3.5 ${rem.reminderActive ? "fill-brand-purple" : ""}`} />
                            </button>
                            <button 
                              onClick={() => handleDeleteReminder(rem.id)}
                              className="p-1 rounded-lg text-slate-500 hover:text-rose-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold block mt-1.5 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-brand-purple" /> {rem.time}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-2 border-t border-slate-800">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300">{rem.date}</span>
                        <span className={`text-[9px] font-bold ${rem.reminderActive ? "text-purple-400" : "text-slate-400"}`}>
                          {rem.reminderActive ? "Reminder Set" : "Muted"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column Analytics */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              
              <div className="glass-card p-6 rounded-3xl border border-slate-800/60 text-left hover:-translate-y-0.5 transition-all">
                <h2 className="font-heading font-bold text-lg text-slate-100 mb-6">Learning Analytics</h2>
                
                <div className="flex flex-col gap-8">
                  
                  {/* Gauge 1: Attendance */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-18 h-18 shrink-0 flex items-center justify-center">
                      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" className="text-slate-800" strokeWidth="3" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                              fill="none" 
                              stroke="#10b981" 
                              strokeWidth="3.2" 
                              strokeDasharray={`${overallAttendanceRate}, 100`} 
                              strokeLinecap="round" 
                              style={{ transition: 'stroke-dasharray 1s ease' }}
                        />
                      </svg>
                      <span className="absolute font-heading font-bold text-xs text-slate-100">{overallAttendanceRate}%</span>
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-sm text-slate-100">Overall Attendance</h3>
                      <p className="text-xs text-slate-400 font-semibold mt-0.5">Calculated from present / conducted</p>
                    </div>
                  </div>

                  {/* Gauge 2: Tasks Solved */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-18 h-18 shrink-0 flex items-center justify-center">
                      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" className="text-slate-800" strokeWidth="3" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                              fill="none" 
                              stroke="#8b5cf6" 
                              strokeWidth="3.2" 
                              strokeDasharray={`${taskCompletionRate}, 100`} 
                              strokeLinecap="round" 
                              style={{ transition: 'stroke-dasharray 1s ease' }}
                        />
                      </svg>
                      <span className="absolute font-heading font-bold text-xs text-slate-100">{taskCompletionRate}%</span>
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-sm text-slate-100">Tasks Solved</h3>
                      <p className="text-xs text-slate-400 font-semibold mt-0.5">Completed homework checklist tasks</p>
                    </div>
                  </div>

                </div>

                <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col gap-4">
                  <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-xs flex flex-col gap-2">
                    <div className="flex justify-between font-bold text-slate-400">
                      <span>Active Reminders</span>
                      <span className="text-slate-200">{activeRemindersCount} Alerts Enabled</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-brand-purple h-full rounded-full" style={{ width: `${Math.min(100, activeRemindersCount * 25)}%` }} />
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* Modal: Add or Edit Subject Class */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-left animate-entrance">
            <h3 className="font-heading font-extrabold text-xl text-slate-100 mb-4">
              {editingSubjectId ? "Edit Subject Class" : "Add Subject Class"}
            </h3>

            <form onSubmit={handleSaveSubject} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400">Subject Code (e.g. CS 101)</label>
                <input 
                  type="text" 
                  value={subjectCodeInput}
                  onChange={(e) => setSubjectCodeInput(e.target.value)}
                  placeholder="CS 101"
                  required
                  className="px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-brand-purple font-medium"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400">Subject Name</label>
                <input 
                  type="text" 
                  value={subjectNameInput}
                  onChange={(e) => setSubjectNameInput(e.target.value)}
                  placeholder="Intro to Programming"
                  required
                  className="px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-brand-purple font-medium"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400">Class Schedule Time</label>
                <input 
                  type="text" 
                  value={subjectTimeInput}
                  onChange={(e) => setSubjectTimeInput(e.target.value)}
                  placeholder="09:00 AM"
                  className="px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-brand-purple font-medium"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button 
                  type="button" 
                  onClick={() => {
                    setEditingSubjectId(null);
                    setShowAddSubjectModal(false);
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:underline"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-brand-blue to-brand-purple text-white font-bold text-xs rounded-xl shadow-md"
                >
                  {editingSubjectId ? "Update Subject" : "Add Subject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
