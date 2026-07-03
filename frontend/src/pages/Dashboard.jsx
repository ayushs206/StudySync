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
  ChevronLeft,
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
  Users,
  Inbox
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(18);
  const [notificationCount, setNotificationCount] = useState(2);

  // Email verification states
  const [isVerifying, setIsVerifying] = useState(false);
  const [showMailboxSim, setShowMailboxSim] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [resendStatus, setResendStatus] = useState("");

  // --- STATE FOR STUDENT USER WIDGETS ---
  const [classes, setClasses] = useState([
    { id: 1, name: "CS 101: Intro to Programming", time: "09:00 AM", checkedIn: false },
    { id: 2, name: "ME 201: Robotics Laboratory", time: "11:30 AM", checkedIn: true },
    { id: 3, name: "MA 102: Calculus & Analysis II", time: "02:00 PM", checkedIn: false }
  ]);
  const [baseAttendance, setBaseAttendance] = useState(66);

  const [notes, setNotes] = useState([
    { id: 1, title: "Kinematics Lecture", content: "Notes on joint rotations, degrees of freedom, and matrices.", date: "May 18" },
    { id: 2, title: "C++ Vectors Cheat Sheet", content: "std::vector initialization, push_back, size, and capacity rules.", date: "May 17" }
  ]);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [showNoteForm, setShowNoteForm] = useState(false);

  const [tasks, setTasks] = useState([
    { id: 1, text: "Finish Robotics arm CAD draft", completed: false },
    { id: 2, text: "Revise I2C protocol timing diagrams", completed: true },
    { id: 3, text: "Read Chapter 4 of Calculus textbook", completed: false }
  ]);
  const [newTaskText, setNewTaskText] = useState("");

  const [reminders, setReminders] = useState([
    { id: 1, title: "Robot Fest Exhibit", date: "May 22", time: "13:00", reminderActive: true },
    { id: 2, title: "Webinar on CAD Modeling", date: "May 25", time: "15:00", reminderActive: false },
    { id: 3, title: "Calculus Quiz 3", date: "May 19", time: "10:00", reminderActive: true }
  ]);
  const [newReminderTitle, setNewReminderTitle] = useState("");
  const [newReminderTime, setNewReminderTime] = useState("");
  const [newReminderDate, setNewReminderDate] = useState("May 18");
  const [showReminderForm, setShowReminderForm] = useState(false);

  // --- STATE FOR ADMIN WIDGETS ---
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
    const sessionStr = localStorage.getItem("studysync_user");
    if (!sessionStr) {
      navigate("/login");
    } else {
      setCurrentUser(JSON.parse(sessionStr));
    }
  }, [navigate]);

  // Simulate server performance fluctuations for Admin Dashboard
  useEffect(() => {
    if (currentUser?.role !== "admin") return;
    const interval = setInterval(() => {
      setServerStats(prev => ({
        ...prev,
        cpuLoad: Math.max(10, Math.min(95, prev.cpuLoad + Math.floor(Math.random() * 9) - 4)),
        memoryUsage: Math.max(30, Math.min(80, prev.memoryUsage + Math.floor(Math.random() * 5) - 2))
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, [currentUser]);

  if (!currentUser) return null;

  // --- EMAIL VERIFICATION SIMULATION ACTIONS ---

  const handleResendVerification = () => {
    setIsVerifying(true);
    setResendStatus("Sending...");
    
    setTimeout(() => {
      setIsVerifying(false);
      setResendStatus("Sent!");
      localStorage.setItem("studysync_verification_sent", "true");
      alert("Verification email has been sent! Click the floating 'Mailbox Simulator' in the bottom-right corner to open your email box.");
      // Auto open simulator for convenience
      setShowMailboxSim(true);
    }, 1200);
  };

  const handleSimulateEmailVerification = () => {
    // 1. Update localStorage
    const updatedUser = { ...currentUser, isVerified: true };
    localStorage.setItem("studysync_user", JSON.stringify(updatedUser));
    
    // 2. Update local state
    setCurrentUser(updatedUser);
    setVerificationSuccess(true);
    setShowMailboxSim(false);

    // 3. Update admin user list if Sophia is the logged-in user
    if (currentUser.email === "sophia@studysync.edu") {
      setSystemUsers(systemUsers.map(user => 
        user.id === 1 ? { ...user, verified: true } : user
      ));
    }

    setTimeout(() => {
      setVerificationSuccess(false);
    }, 4000);
  };

  // --- STUDENT WIDGET ACTIONS ---

  const handleCheckIn = (id) => {
    setClasses(classes.map(cls => {
      if (cls.id === id) {
        if (!cls.checkedIn) {
          setBaseAttendance(prev => Math.min(100, prev + 11));
        } else {
          setBaseAttendance(prev => Math.max(0, prev - 11));
        }
        return { ...cls, checkedIn: !cls.checkedIn };
      }
      return cls;
    }));
  };


  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteTitle || !newNoteContent) return;
    const note = {
      id: Date.now(),
      title: newNoteTitle,
      content: newNoteContent,
      date: `May ${selectedDate}`
    };
    setNotes([note, ...notes]);
    setNewNoteTitle("");
    setNewNoteContent("");
    setShowNoteForm(false);
    setNotificationCount(prev => prev + 1);
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText) return;
    const task = {
      id: Date.now(),
      text: newTaskText,
      completed: false
    };
    setTasks([...tasks, task]);
    setNewTaskText("");
  };

  const handleToggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const completedTasksCount = tasks.filter(t => t.completed).length;
  const taskCompletionRate = tasks.length > 0 
    ? Math.round((completedTasksCount / tasks.length) * 100) 
    : 0;

  const handleAddReminder = (e) => {
    e.preventDefault();
    if (!newReminderTitle || !newReminderTime) return;
    const rem = {
      id: Date.now(),
      title: newReminderTitle,
      time: newReminderTime,
      date: newReminderDate,
      reminderActive: true
    };
    setReminders([...reminders, rem]);
    setNewReminderTitle("");
    setNewReminderTime("");
    setShowReminderForm(false);
  };

  const handleToggleReminder = (id) => {
    setReminders(reminders.map(rem => 
      rem.id === id ? { ...rem, reminderActive: !rem.reminderActive } : rem
    ));
  };

  const activeRemindersCount = reminders.filter(r => r.reminderActive).length;

  // --- ADMIN ACTIONS ---
  const handleToggleUserVerification = (id) => {
    setSystemUsers(systemUsers.map(user => 
      user.id === id ? { ...user, verified: !user.verified } : user
    ));
  };

  const handleDeleteUser = (id) => {
    setSystemUsers(systemUsers.filter(user => user.id !== id));
  };

  const platformVerificationRate = Math.round((systemUsers.filter(u => u.verified).length / systemUsers.length) * 100);

  const handleLogout = () => {
    localStorage.removeItem("studysync_user");
    navigate("/login");
  };

  // Helper values for names & avatars
  const userInitials = (currentUser.first_name?.charAt(0) || "") + (currentUser.last_name?.charAt(0) || "");
  const yearString = currentUser.year_of_study 
    ? `${currentUser.year_of_study}${currentUser.year_of_study === 1 ? "st" : currentUser.year_of_study === 2 ? "nd" : currentUser.year_of_study === 3 ? "rd" : "th"} Year Student`
    : "Graduate Student";

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50/70 text-slate-800 relative">
      
      {/* Dynamic Success Verification Banner Toast */}
      {verificationSuccess && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[100] px-6 py-4 rounded-2xl bg-emerald-500 text-white shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle className="w-6 h-6" />
          <div className="text-left">
            <p className="font-heading font-bold text-sm">Email Verified Successfully!</p>
            <p className="text-xs text-white/90">Welcome to StudySync. Full access is unlocked.</p>
          </div>
        </div>
      )}

      {/* 1. Left Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200/60 p-6 flex flex-col justify-between shrink-0">
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-blue via-brand-purple to-brand-green p-0.5 shadow-sm">
              <div className="w-full h-full bg-white rounded-[9px] flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-brand-purple" />
              </div>
            </div>
            <span className="font-heading font-bold text-xl tracking-tight bg-gradient-to-r from-brand-blue via-brand-purple to-brand-green bg-clip-text text-transparent">
              StudySync
            </span>
          </Link>

          {/* Profile Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-tr from-brand-blue/5 via-brand-purple/5 to-brand-green/5 border border-slate-100 flex items-center gap-3 text-left">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${currentUser.role === "admin" ? "from-brand-purple to-brand-green" : "from-brand-blue to-brand-purple"} flex items-center justify-center text-white font-bold shadow-md shadow-brand-purple/10 uppercase`}>
              {userInitials || "U"}
            </div>
            <div>
              <p className="font-heading font-bold text-sm text-slate-800 truncate max-w-[130px]">{currentUser.first_name} {currentUser.last_name}</p>
              <p className="text-xs text-slate-500 font-medium truncate max-w-[130px]">
                {currentUser.role === "admin" ? "System Admin" : yearString}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 text-left">
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-purple/10 text-brand-purple font-semibold text-sm transition-colors w-full">
              <Layers className="w-4 h-4" />
              <span>{currentUser.role === "admin" ? "Admin Console" : "Dashboard"}</span>
            </button>
            
            {currentUser.role === "admin" ? (
              <>
                <button onClick={() => alert("Opening system databases...")} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium text-sm transition-colors w-full">
                  <Database className="w-4 h-4" />
                  <span>Databases</span>
                </button>
                <button onClick={() => alert("Opening servers logs...")} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium text-sm transition-colors w-full">
                  <Server className="w-4 h-4" />
                  <span>System Logs</span>
                </button>
              </>
            ) : (
              <>
                <button onClick={() => alert("Opening classes...")} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium text-sm transition-colors w-full">
                  <BookMarked className="w-4 h-4" />
                  <span>My classes</span>
                </button>
                <button onClick={() => alert("Opening grades...")} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium text-sm transition-colors w-full">
                  <UserCheck className="w-4 h-4" />
                  <span>My grades</span>
                </button>
              </>
            )}

            <button onClick={() => alert("Opening schedule calendar...")} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium text-sm transition-colors w-full">
              <Calendar className="w-4 h-4" />
              <span>Schedule</span>
            </button>

            <button onClick={() => alert("Opening messenger chat...")} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium text-sm transition-colors w-full">
              <MessageSquare className="w-4 h-4" />
              <span>Messages</span>
            </button>

            <button onClick={() => alert("Opening settings...")} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium text-sm transition-colors w-full">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Logout */}
        <div className="pt-6 border-t border-slate-100 mt-6 text-left">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 font-semibold text-sm transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* Verification Warning Banner (Only for unverified user accounts) */}
        {!currentUser.isVerified && currentUser.role === "user" && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-brand-blue/10 via-brand-purple/10 to-brand-green/10 border border-brand-purple/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-purple/15 text-brand-purple flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <p className="font-heading font-bold text-sm text-slate-800">Verify Your Email Address</p>
                <p className="text-xs text-slate-500 mt-0.5">Please verify your email address <strong>{currentUser.email}</strong> to unlock full database synchronization features.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handleResendVerification}
                disabled={isVerifying}
                className="px-4 py-2 text-xs font-bold bg-brand-purple text-white rounded-xl shadow-md shadow-brand-purple/10 hover:shadow-lg hover:shadow-brand-purple/15 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isVerifying ? "Sending..." : resendStatus === "Sent!" ? "Resent!" : "Resend Link"}
              </button>
              <button 
                onClick={() => setShowMailboxSim(true)}
                className="px-4 py-2 text-xs font-bold bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Open Simulator
              </button>
            </div>
          </div>
        )}

        {/* Top Header Bar */}
        <header className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8 pb-6 border-b border-slate-200/50">
          <div className="text-left w-full sm:w-auto">
            <h1 className="font-heading font-extrabold text-3xl text-slate-800 tracking-tight margin-0 leading-none">
              {currentUser.role === "admin" ? "ADMIN SYSTEMS CONSOLE" : `HELLO, ${currentUser.first_name.toUpperCase()}!`}
            </h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-brand-purple" />
              {currentUser.role === "admin" 
                ? "StudySync centralized server administration dashboard" 
                : "Tracking your attendance, notes, tasks & event reminders"}
            </p>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
            <div className="relative flex items-center w-full sm:w-60 bg-white border border-slate-200/60 rounded-2xl px-4 py-2.5 shadow-inner">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input 
                type="text" 
                placeholder={currentUser.role === "admin" ? "Search users..." : "Search features..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-7 pr-2 text-sm text-slate-700 bg-transparent focus:outline-none w-full placeholder:text-slate-400 font-medium"
              />
            </div>

            <button 
              onClick={() => {
                setNotificationCount(0);
                alert(currentUser.role === "admin" ? "Opening admin notifications..." : "Opening student notifications...");
              }}
              className="w-11 h-11 bg-white border border-slate-200/60 hover:bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 transition-colors relative cursor-pointer"
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
        {/* CASE A: RENDER ADMIN DASHBOARD                       */}
        {/* ---------------------------------------------------- */}
        {currentUser.role === "admin" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left widgets */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              
              {/* Admin Widget 1: User Management Directory */}
              <div className="glass-card p-6 rounded-3xl border border-white/60 text-left">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="font-heading font-bold text-lg text-slate-800">User Management Directory</h2>
                    <p className="text-xs text-slate-400 font-semibold">Toggle verification tokens or delete student accounts</p>
                  </div>
                  <span className="text-xs font-bold text-brand-purple bg-brand-purple/10 px-2.5 py-1 rounded-xl">
                    {systemUsers.length} total users
                  </span>
                </div>

                {/* Users list table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="pb-3 font-semibold">Name</th>
                        <th className="pb-3 font-semibold">Username</th>
                        <th className="pb-3 font-semibold">Year</th>
                        <th className="pb-3 font-semibold">Verification Status</th>
                        <th className="pb-3 text-center font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {systemUsers
                        .filter(u => 
                          u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map(user => (
                          <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-3">
                              <p className="font-bold text-slate-800">{user.name}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{user.email}</p>
                            </td>
                            <td className="py-3 font-medium text-slate-600">@{user.username}</td>
                            <td className="py-3 text-slate-600">{user.year}</td>
                            <td className="py-3">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[9px] ${
                                user.verified 
                                  ? "bg-emerald-500/10 text-emerald-600" 
                                  : "bg-amber-500/10 text-amber-600"
                              }`}>
                                {user.verified ? "Verified" : "Pending Verify"}
                              </span>
                            </td>
                            <td className="py-3 text-center flex items-center justify-center gap-2">
                              <button 
                                onClick={() => handleToggleUserVerification(user.id)}
                                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-colors cursor-pointer ${
                                  user.verified 
                                    ? "border-amber-200 text-amber-600 hover:bg-amber-50" 
                                    : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                                }`}
                              >
                                {user.verified ? "Revoke Verification" : "Manual Verify"}
                              </button>
                              <button 
                                onClick={() => handleDeleteUser(user.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                                aria-label="Delete User"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Admin Widget 2: Platform Activity & Server Health */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Server Status Monitor */}
                <div className="glass-card p-6 rounded-3xl border border-white/60 text-left flex flex-col justify-between min-h-[240px]">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-brand-blue" />
                        <h3 className="font-heading font-bold text-sm text-slate-800">Server Health</h3>
                      </div>
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                    </div>

                    <div className="flex flex-col gap-3.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-500">CPU Server Load</span>
                        <span className="text-xs font-bold text-slate-800">{serverStats.cpuLoad}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${
                            serverStats.cpuLoad > 80 ? "bg-rose-500" : serverStats.cpuLoad > 60 ? "bg-amber-500" : "bg-brand-blue"
                          }`}
                          style={{ width: `${serverStats.cpuLoad}%` }} 
                        />
                      </div>

                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs font-semibold text-slate-500">Database Latency</span>
                        <span className="text-xs font-bold text-emerald-500">{serverStats.dbLatency}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-500">Active study lobbies</span>
                        <span className="text-xs font-bold text-slate-800">{serverStats.activeLobbies} concurrent</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Node Engine v20.12 • MongoDB Cloud
                  </div>
                </div>

                {/* Platform Summary Statistics */}
                <div className="glass-card p-6 rounded-3xl border border-white/60 text-left flex flex-col justify-between min-h-[240px]">
                  <div>
                    <h3 className="font-heading font-bold text-sm text-slate-800 mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-brand-purple" />
                      Platform Statistics
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-2xl">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Registration Rate</span>
                        <span className="font-heading font-extrabold text-2xl text-slate-800 mt-1 block">+18% this week</span>
                      </div>
                      <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-2xl">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">SMTP Mailers</span>
                        <span className="font-heading font-extrabold text-2xl text-emerald-500 mt-1 block">Active</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 text-xs flex justify-between items-center">
                    <span className="text-slate-400 font-semibold">User Verification Rate: {platformVerificationRate}%</span>
                    <button onClick={() => alert("Running automated DB validation...")} className="text-[10px] text-brand-purple font-bold hover:underline">Verify Database</button>
                  </div>
                </div>

              </div>

            </div>

            {/* Right Analytics Sidebar for Admin */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              
              <div className="glass-card p-6 rounded-3xl border border-white/60 text-left">
                <h2 className="font-heading font-bold text-lg text-slate-800 mb-6">Console Resource Monitor</h2>
                
                <div className="flex flex-col gap-8">
                  
                  {/* Gauge 1: CPU Load */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-18 h-18 shrink-0 flex items-center justify-center">
                      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                              fill="none" 
                              stroke="#3b82f6" 
                              strokeWidth="3.2" 
                              strokeDasharray={`${serverStats.cpuLoad}, 100`} 
                              strokeLinecap="round" 
                        />
                      </svg>
                      <span className="absolute font-heading font-bold text-xs text-slate-800">{serverStats.cpuLoad}%</span>
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-sm text-slate-800">CPU Load</h3>
                      <p className="text-xs text-slate-400 font-semibold mt-0.5">Simulated API server execution load</p>
                    </div>
                  </div>

                  {/* Gauge 2: Memory Usage */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-18 h-18 shrink-0 flex items-center justify-center">
                      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                              fill="none" 
                              stroke="#8b5cf6" 
                              strokeWidth="3.2" 
                              strokeDasharray={`${serverStats.memoryUsage}, 100`} 
                              strokeLinecap="round" 
                        />
                      </svg>
                      <span className="absolute font-heading font-bold text-xs text-slate-800">{serverStats.memoryUsage}%</span>
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-sm text-slate-800">Memory usage</h3>
                      <p className="text-xs text-slate-400 font-semibold mt-0.5">Heap memory allocated by Node runtime</p>
                    </div>
                  </div>

                  {/* Gauge 3: Platform verification rate */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-18 h-18 shrink-0 flex items-center justify-center">
                      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                              fill="none" 
                              stroke="#10b981" 
                              strokeWidth="3.2" 
                              strokeDasharray={`${platformVerificationRate}, 100`} 
                              strokeLinecap="round" 
                        />
                      </svg>
                      <span className="absolute font-heading font-bold text-xs text-slate-800">{platformVerificationRate}%</span>
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-sm text-slate-800">Verification Rate</h3>
                      <p className="text-xs text-slate-400 font-semibold mt-0.5">Total verified emails on the system</p>
                    </div>
                  </div>

                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs flex flex-col gap-2">
                    <div className="flex justify-between font-bold text-slate-500">
                      <span>Server status</span>
                      <span className="text-emerald-500 font-extrabold">Online & Stable</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: "95%" }} />
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        ) : (
          
          // ----------------------------------------------------
          // CASE B: RENDER STUDENT DASHBOARD                     
          // ----------------------------------------------------
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left widgets */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              
              {/* Row 1: Track Attendance & Store Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Feature 1: Track Attendance */}
                <div className="glass-card p-6 rounded-3xl border border-white/60 text-left flex flex-col justify-between min-h-[300px]">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-brand-green/10 text-brand-green flex items-center justify-center">
                          <UserCheck className="w-4 h-4" />
                        </div>
                        <h2 className="font-heading font-bold text-lg text-slate-800">Track Attendance</h2>
                      </div>
                      <span className="text-xs font-bold text-slate-400">Today</span>
                    </div>

                    <div className="flex flex-col gap-3">
                      {classes.map((cls) => (
                        <div key={cls.id} className="flex items-center justify-between p-2.5 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-slate-100/50 transition-colors">
                          <div className="flex flex-col text-left">
                            <span className="font-heading font-bold text-xs text-slate-800">{cls.name}</span>
                            <span className="text-[10px] text-slate-400 font-semibold mt-0.5">{cls.time}</span>
                          </div>
                          <button 
                            onClick={() => handleCheckIn(cls.id)}
                            className={`text-[10px] font-bold px-3 py-1.5 rounded-xl border transition-all ${
                              cls.checkedIn 
                                ? "bg-brand-green text-white border-brand-green" 
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {cls.checkedIn ? "Checked In" : "Check In"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 font-semibold flex justify-between items-center">
                    <span>Attendance Rate: {baseAttendance}%</span>
                    <span className="text-[10px] text-brand-green font-bold flex items-center gap-0.5">Live syncing</span>
                  </div>
                </div>

                {/* Feature 2: Store Notes */}
                <div className="glass-card p-6 rounded-3xl border border-white/60 text-left flex flex-col justify-between min-h-[300px]">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center">
                          <Bookmark className="w-4 h-4" />
                        </div>
                        <h2 className="font-heading font-bold text-lg text-slate-800">Store Notes</h2>
                      </div>
                      <button 
                        onClick={() => setShowNoteForm(!showNoteForm)}
                        className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {showNoteForm ? (
                      <form onSubmit={handleAddNote} className="flex flex-col gap-2 p-2 bg-slate-50/50 border border-slate-100 rounded-2xl animate-fade-in mb-3">
                        <input 
                          type="text" 
                          placeholder="Note Title" 
                          value={newNoteTitle}
                          onChange={(e) => setNewNoteTitle(e.target.value)}
                          className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none w-full bg-white font-medium"
                        />
                        <textarea 
                          placeholder="Content summary..." 
                          value={newNoteContent}
                          onChange={(e) => setNewNoteContent(e.target.value)}
                          className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none w-full bg-white h-12 resize-none font-medium"
                        />
                        <div className="flex gap-2 justify-end">
                          <button type="button" onClick={() => setShowNoteForm(false)} className="text-[9px] font-bold px-2 py-1 text-slate-500 hover:underline">Cancel</button>
                          <button type="submit" className="text-[9px] font-bold px-3 py-1 bg-brand-blue text-white rounded-lg">Save</button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex flex-col gap-3 max-h-[160px] overflow-y-auto pr-1">
                        {notes.map((note) => (
                          <div key={note.id} className="p-2.5 bg-slate-50/40 border border-slate-100 rounded-2xl flex justify-between items-start gap-2">
                            <div className="min-w-0 text-left">
                              <span className="font-heading font-bold text-xs text-slate-800 block truncate">{note.title}</span>
                              <span className="text-[10px] text-slate-500 leading-normal block mt-0.5 truncate">{note.content}</span>
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

                  <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 font-semibold flex justify-between items-center">
                    <span>Saved Notes: {notes.length}</span>
                    <button className="text-[10px] text-brand-blue font-bold hover:underline">View folders</button>
                  </div>
                </div>

              </div>

              {/* Row 2: Manage Tasks */}
              <div className="glass-card p-6 rounded-3xl border border-white/60 text-left">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-heading font-bold text-lg text-slate-800">Manage Tasks</h2>
                      <p className="text-xs text-slate-400 font-semibold">Your dynamic studying to-do list</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-purple/10 text-brand-purple">
                    {taskCompletionRate}% Done
                  </span>
                </div>

                <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
                  <input 
                    type="text" 
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    placeholder="Add a new study task..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-sm focus:outline-none focus:border-brand-purple focus:bg-white shadow-inner placeholder:text-slate-400 font-medium"
                  />
                  <button 
                    type="submit" 
                    className="px-4 bg-brand-purple text-white rounded-2xl flex items-center justify-center hover:bg-brand-purple/90 shadow-md shadow-brand-purple/10 cursor-pointer"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </form>

                <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-slate-50/50 border border-slate-200/20 rounded-2xl hover:border-slate-300/40 transition-all">
                      <button 
                        onClick={() => handleToggleTask(task.id)}
                        className="flex items-center gap-3 text-left w-full focus:outline-none cursor-pointer"
                      >
                        {task.completed ? (
                          <CheckSquare className="w-5 h-5 text-brand-purple shrink-0" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-300 shrink-0" />
                        )}
                        <span className={`text-xs font-medium text-slate-700 ${task.completed ? "line-through text-slate-400" : ""}`}>
                          {task.text}
                        </span>
                      </button>
                      <button 
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-slate-400 hover:text-rose-500 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 3: Keep Calendar Reminders */}
              <div className="glass-card p-6 rounded-3xl border border-white/60 text-left">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-heading font-bold text-lg text-slate-800">Keep Calendar Reminders</h2>
                      <p className="text-xs text-slate-400 font-semibold">Organize upcoming quizzes, deadlines, & exhibits</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowReminderForm(!showReminderForm)}
                    className="text-xs font-bold text-brand-purple hover:underline"
                  >
                    New reminder
                  </button>
                </div>

                {showReminderForm && (
                  <form onSubmit={handleAddReminder} className="mb-6 p-4 bg-slate-50/50 border border-slate-200/50 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400">Event Title</label>
                      <input 
                        type="text" 
                        placeholder="Title" 
                        value={newReminderTitle}
                        onChange={(e) => setNewReminderTitle(e.target.value)}
                        className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-purple text-slate-700 font-medium"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400">Time</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 10:00 AM" 
                        value={newReminderTime}
                        onChange={(e) => setNewReminderTime(e.target.value)}
                        className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-purple text-slate-700 font-medium"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400">Date</label>
                      <select 
                        value={newReminderDate}
                        onChange={(e) => setNewReminderDate(e.target.value)}
                        className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-purple text-slate-700 font-medium"
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
                          ? "bg-brand-purple/5 border-brand-purple/20 shadow-sm" 
                          : "border-slate-200/50 bg-slate-50/20"
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-heading font-extrabold text-xs text-slate-800 leading-tight block">{rem.title}</span>
                          <button 
                            onClick={() => handleToggleReminder(rem.id)}
                            className={`p-1 rounded-lg ${rem.reminderActive ? "text-brand-purple bg-brand-purple/10" : "text-slate-400 bg-slate-100"}`}
                            aria-label="Toggle reminder bell"
                          >
                            <Bell className={`w-3.5 h-3.5 ${rem.reminderActive ? "fill-brand-purple" : ""}`} />
                          </button>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold block mt-1.5 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-brand-purple" /> {rem.time}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-2 border-t border-slate-100">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600">{rem.date}</span>
                        <span className={`text-[9px] font-bold ${rem.reminderActive ? "text-brand-purple" : "text-slate-400"}`}>
                          {rem.reminderActive ? "Reminder Set" : "Muted"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Analytics Sidebar for User */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              
              <div className="glass-card p-6 rounded-3xl border border-white/60 text-left">
                <h2 className="font-heading font-bold text-lg text-slate-800 mb-6">Learning Analytics</h2>
                
                <div className="flex flex-col gap-8">
                  
                  {/* Gauge 1: Attendance */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-18 h-18 shrink-0 flex items-center justify-center">
                      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                              fill="none" 
                              stroke="#10b981" 
                              strokeWidth="3.2" 
                              strokeDasharray={`${baseAttendance}, 100`} 
                              strokeLinecap="round" 
                        />
                      </svg>
                      <span className="absolute font-heading font-bold text-xs text-slate-800">{baseAttendance}%</span>
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-sm text-slate-800">Attendance</h3>
                      <p className="text-xs text-slate-400 font-semibold mt-0.5">Live percentage based on check-ins</p>
                    </div>
                  </div>

                  {/* Gauge 2: Tasks Solved */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-18 h-18 shrink-0 flex items-center justify-center">
                      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                              fill="none" 
                              stroke="#8b5cf6" 
                              strokeWidth="3.2" 
                              strokeDasharray={`${taskCompletionRate}, 100`} 
                              strokeLinecap="round" 
                        />
                      </svg>
                      <span className="absolute font-heading font-bold text-xs text-slate-800">{taskCompletionRate}%</span>
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-sm text-slate-800">Tasks Solved</h3>
                      <p className="text-xs text-slate-400 font-semibold mt-0.5">Completed homework checklist tasks</p>
                    </div>
                  </div>

                  {/* Gauge 3: Stored Notes */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-18 h-18 shrink-0 flex items-center justify-center">
                      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                              fill="none" 
                              stroke="#3b82f6" 
                              strokeWidth="3.2" 
                              strokeDasharray={`${Math.min(100, notes.length * 20)}, 100`} 
                              strokeLinecap="round" 
                        />
                      </svg>
                      <span className="absolute font-heading font-bold text-xs text-slate-800">{notes.length}</span>
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-sm text-slate-800">Stored Notes</h3>
                      <p className="text-xs text-slate-400 font-semibold mt-0.5">Total review sheets saved to profile</p>
                    </div>
                  </div>

                </div>

                {/* Reminders targets */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs flex flex-col gap-2">
                    <div className="flex justify-between font-bold text-slate-500">
                      <span>Active Reminders</span>
                      <span className="text-slate-800">{activeRemindersCount} Alerts Enabled</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-brand-purple h-full rounded-full" style={{ width: `${Math.min(100, activeRemindersCount * 25)}%` }} />
                    </div>
                  </div>

                  <button 
                    onClick={() => alert("Showing details performance report...")}
                    className="w-full py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 font-heading font-bold text-slate-700 text-xs text-center flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    See detailed analytics
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Quick tip */}
              <div className="glass-card p-6 rounded-3xl border border-white/60 text-left bg-gradient-to-tr from-brand-blue/5 via-brand-purple/5 to-transparent">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-slate-800">Study Sync Tip</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">
                      Keep your study reminders activated so that calendar tokens stay synchronized to your active mobile browser notifications!
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* 3. MAILBOX SIMULATOR MODAL (For testing email verification flows in frontend) */}
      {showMailboxSim && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col min-h-[420px] animate-fade-in text-left">
            {/* Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Inbox className="w-5 h-5 text-brand-purple" />
                <span className="font-heading font-bold text-sm">StudySync Mailbox Simulator</span>
              </div>
              <button 
                onClick={() => setShowMailboxSim(false)}
                className="text-slate-400 hover:text-white font-bold text-sm cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {/* Email List / Body */}
            <div className="p-6 flex-1 flex flex-col gap-4 bg-slate-50/50 overflow-y-auto">
              <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-sm text-left">
                <div className="border-b border-slate-100 pb-3 mb-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">Sender: StudySync Verification Security</span>
                    <span className="text-slate-400 font-medium">Just now</span>
                  </div>
                  <h3 className="font-heading font-bold text-sm text-slate-900 mt-2">Subject: Action Required - Verify Your StudySync Account</h3>
                </div>

                <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
                  <p>Hi {currentUser.first_name},</p>
                  <p>Thank you for registering an account on <strong>StudySync Collaboration</strong>. To complete your registration and synchronize notes, attendance trackers, and calendar events with the platform servers, please verify your email address by clicking the verification button below:</p>
                  
                  <div className="py-4 flex justify-center">
                    <button 
                      onClick={handleSimulateEmailVerification}
                      className="px-6 py-3 bg-gradient-to-r from-brand-blue via-brand-purple to-brand-green text-white font-bold text-center rounded-xl shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all cursor-pointer text-xs"
                    >
                      Verify My Account Email
                    </button>
                  </div>
                  
                  <p className="text-[10px] text-slate-400">
                    If you did not initiate this request, please ignore this email. This link is simulated to verify tokens on the front-end client.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-100 p-4 text-center text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Email client interface simulator
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
