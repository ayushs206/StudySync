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

  // --- 1. REAL BATCH-DRIVEN SCHEDULE & ATTENDANCE (3 BACKEND STATUSES: Present, Absent, Cancelled) ---
  const [todayClasses, setTodayClasses] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState({ subjects: [], overall: { present: 0, absent: 0, cancelled: 0, conducted: 0, rate: 100 } });
  const [loadingSchedule, setLoadingSchedule] = useState(true);
  const [todayDayName, setTodayDayName] = useState("");
  const [batchesList, setBatchesList] = useState([]);
  const [selectedDashBatch, setSelectedDashBatch] = useState("");
  const [isUpdatingDashBatch, setIsUpdatingDashBatch] = useState(false);
  const [dashBatchMsg, setDashBatchMsg] = useState("");

  const getTodayFormattedDate = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayDateStr = getTodayFormattedDate();

  const fetchScheduleAndStats = async () => {
    setLoadingSchedule(true);
    try {
      // 1. Fetch today's classes
      const ttRes = await api.getTodayTimetable(todayDateStr);
      if (ttRes) {
        setTodayClasses(ttRes.classes || []);
        setTodayDayName(ttRes.day || "");
      }

      // 2. Fetch attendance stats
      const statsRes = await api.getAttendanceStats();
      if (statsRes) {
        setAttendanceStats(statsRes);
      }
    } catch (err) {
      console.error("Error loading schedule or stats:", err);
    } finally {
      setLoadingSchedule(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchScheduleAndStats();
      if (!currentUser.batch) {
        api.getBatches().then(res => {
          if (res?.batches) setBatchesList(res.batches);
        }).catch(() => {});
      }
    }
  }, [currentUser]);

  const handleSelectDashBatch = async (newBatch) => {
    if (!newBatch) return;
    setIsUpdatingDashBatch(true);
    setDashBatchMsg("");
    try {
      const res = await api.selectBatch({ batch: newBatch });
      if (res.user) {
        setCurrentUser(res.user);
        localStorage.setItem("studysync_user", JSON.stringify(res.user));
      }
      setDashBatchMsg(`Batch ${newBatch} activated!`);
      await fetchScheduleAndStats();
    } catch (err) {
      console.error("Failed to set batch:", err);
    } finally {
      setIsUpdatingDashBatch(false);
      setTimeout(() => setDashBatchMsg(""), 4000);
    }
  };

  // --- 2. STORE NOTES ---
  const [notes, setNotes] = useState([]);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const[loadingNotes,setLoadingNotes]=useState(true);
  const[notesError,setNotesError]=useState(null);

  async function fetchNotes(){
    setLoadingNotes(true);
    setNotesError(null);
    try{
      const res=await api.getNotes();
      setNotes(res.notes);

    }catch(err){
      setNotesError(err.message || "Failed to load notes");
    } finally {
      setLoadingNotes(false);
    }
  }
  useEffect(()=>{fetchNotes();},[]);

  // --- 3. MANAGE TASKS ---
  
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskDeadline,setNewTaskDeadline]=useState("");
  const [newTaskPriority,setNewTaskPriority]=useState("");
  const [loadingTasks,setLoadingTasks]=useState(true);
  const [tasksError,setErrorTasks]=useState(null);
 
  async function fetchTasks() {
    setLoadingTasks(true);
    setErrorTasks(null);
    try {
      const res = await api.getTasks({});
      setTasks(res.tasks); // adjust based on your API's response shape
    } catch (err) {
      setErrorTasks(err.message || "Failed to load tasks");
    } finally {
      setLoadingTasks(false);
    }
  }
  useEffect(()=>{
    fetchTasks();
  },[]);


  // --- 4. KEEP CALENDAR REMINDERS (REAL /events API — Option A: no mute/unmute toggle) ---

  const [reminders, setReminders] = useState([]);
  const [loadingReminders, setLoadingReminders] = useState(true);
  const [remindersError, setRemindersError] = useState(null);

  const [newReminderTitle, setNewReminderTitle] = useState("");
  const [newReminderStart, setNewReminderStart] = useState("");   // datetime-local string
  const [newReminderEnd, setNewReminderEnd] = useState("");       // optional
  const [newReminderLocation, setNewReminderLocation] = useState(""); // optional
  const [showReminderForm, setShowReminderForm] = useState(false);

  async function fetchEvents() {
    setLoadingReminders(true);
    setRemindersError(null);
    try {
      const res = await api.getEvents();
      setReminders(res.events || []);
    } catch (err) {
      setRemindersError(err.message || "Failed to load reminders");
    } finally {
      setLoadingReminders(false);
    }
  }
  useEffect(() => { fetchEvents(); }, []);

  // Admin stats
 
  
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
        if (isMounted){
          if(res.user) {
          setCurrentUser(res.user);
          localStorage.setItem("studysync_user", JSON.stringify(res.user));
          setLoadingUser(false);
        }else{
          navigate("/login");
        }
        return;
      }
      } catch (err) {
        if (!isMounted) return;
        const sessionStr = localStorage.getItem("studysync_user");
        if (sessionStr) {
          setCurrentUser(JSON.parse(sessionStr));
          setLoadingUser(false);
          return;
        }
        navigate("/login");
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
  const totalPresent = attendanceStats.overall?.present ?? 0;
  const totalAbsent = attendanceStats.overall?.absent ?? 0;
  const totalCancelled = attendanceStats.overall?.cancelled ?? 0;
  const totalConducted = attendanceStats.overall?.conducted ?? (totalPresent + totalAbsent);
  const overallAttendanceRate = attendanceStats.overall?.rate ?? (totalConducted > 0 ? Math.round((totalPresent / totalConducted) * 100) : 100);

  // Mark 3 backend statuses: 'present' | 'absent' | 'cancelled' (or toggle off)
  const handleMarkAttendance = async (cls, targetStatus) => {
    const currentStatus = cls.todayStatus;
    const newStatus = currentStatus === targetStatus ? null : targetStatus;

    // Optimistically update today's class card
    setTodayClasses(prev => prev.map(c => c.slotId === cls.slotId ? { ...c, todayStatus: newStatus } : c));

    try {
      await api.markAttendance({
        date: todayDateStr,
        slotId: cls.slotId,
        subjectCode: cls.subject_code,
        status: newStatus
      });

      // Fetch fresh stats from backend
      const statsRes = await api.getAttendanceStats();
      if (statsRes) setAttendanceStats(statsRes);
    } catch (err) {
      console.error("Failed to mark attendance:", err);
      // Revert upon error
      setTodayClasses(prev => prev.map(c => c.slotId === cls.slotId ? { ...c, todayStatus: currentStatus } : c));
    }
  };

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
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNoteTitle || !newNoteContent){
      setNotesError("Both title and content are required to add a note.");
    return;
  }
  try{
    const res=await api.createNote({
      title:newNoteTitle,
      content:newNoteContent});
    setNotes(prev=>[...prev,res.note]);
    setNewNoteTitle("");
    setNewNoteContent("");
    }
  catch(err){
    setNotesError("Failed to add note.");
  }
};
  const openEditNote = (note) => {
  setEditingNoteId(note._id);
  setNewNoteTitle(note.title);
  setNewNoteContent(note.content);
  }


  const handleEditNote = async ( updatedTitle, updatedContent) => {
    try{
   const res =await api.updateNote(editingNoteId, { title: updatedTitle, content: updatedContent });
   setNotes(prev => prev.map(n => n._id === editingNoteId ? res.note : n));
   setEditingNoteId(null);
   setNewNoteTitle("");
   setNewNoteContent("");
    }catch(err){
      setNotesError("Failed to update note.");
    }

  };





  const handleDeleteNote = async (id) => {
    try{
      await api.deleteNote(id);
      setNotes(notes.filter(n => n._id !== id));
    }catch(err){
      setNotesError("Failed to delete note.");
    }
  };
  
  // TASKS ACTIONS
  
  


 const handleAddTask = async (e) => {
  e.preventDefault();
 if(!newTaskText|| !newTaskDeadline || !newTaskPriority){
  setErrorTasks(null);
  return;
 }
 try{
  const res= await api.createTask({
    title:newTaskText,
    deadline:newTaskDeadline,
    priority:newTaskPriority,


  });
  setTasks(prev=>[...prev,res.task]);
  setNewTaskText("");
}catch(err){
  setErrorTasks(err.message);
}
 }

  const handleToggleTask = async (id, status) => {
  const nextStatus = status === 'completed' ? 'pending' : 'completed';

  try {
    const res = await api.updateTask(id, { status: nextStatus });
    setTasks(prev => prev.map(t => t._id === id ? res.task : t));
  } catch (err) {
    setErrorTasks(err.message);
  }
};

const handleDeleteTask = async (id) =>{
  try{
  await api.deleteTask(id);
  setTasks(prev => prev.filter(t => t._id !== id));
  }
  catch(err){
    setErrorTasks(err.message);
  }
}
  const completedTasksCount = tasks.filter(t => t.status==='completed').length;
  const taskCompletionRate = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  // REMINDERS ACTIONS (real backend — title + event_start required, event_end/location optional)
  const handleAddReminder = async (e) => {
    e.preventDefault();
    if (!newReminderTitle || !newReminderStart) return;
    try {
      const res = await api.createEvent({
        title: newReminderTitle,
        event_start: new Date(newReminderStart).toISOString(),
        event_end: newReminderEnd ? new Date(newReminderEnd).toISOString() : undefined,
        location: newReminderLocation || undefined,
      });
      setReminders(prev => [...prev, res.event]);
      setNewReminderTitle("");
      setNewReminderStart("");
      setNewReminderEnd("");
      setNewReminderLocation("");
      setShowReminderForm(false);
    } catch (err) {
      setRemindersError(err.message || "Failed to add reminder.");
    }
  };

  const handleDeleteReminder = async (id) => {
    const prevReminders = reminders;
    setReminders(prev => prev.filter(r => r._id !== id));
    try {
      await api.deleteEvent(id);
    } catch (err) {
      setReminders(prevReminders);
      setRemindersError(err.message || "Failed to delete reminder.");
    }
  };

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
                        {currentUser?.batch ? `Batch ${currentUser.batch} • ${todayDayName || "Today's Schedule"}` : "Select your batch to load classes"}
                      </p>
                    </div>
                  </div>

                  {currentUser?.batch && (
                    <span className="px-3 py-1 bg-brand-purple/10 text-brand-purple border border-brand-purple/20 text-xs font-bold rounded-xl">
                      Batch {currentUser.batch}
                    </span>
                  )}
                </div>

                {!currentUser?.batch ? (
                  <div className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 text-center flex flex-col items-center gap-3">
                    <BookOpen className="w-8 h-8 text-brand-purple animate-bounce" />
                    <div>
                      <h3 className="font-heading font-bold text-base text-slate-100">No Batch Selected</h3>
                      <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                        Select your academic batch to automatically load your daily schedule, enrolled subjects, and track attendance.
                      </p>
                    </div>
                    {dashBatchMsg && (
                      <span className="text-xs text-emerald-400 font-semibold">{dashBatchMsg}</span>
                    )}
                    <div className="flex items-center gap-2 mt-2 w-full max-w-xs">
                      <select
                        value={selectedDashBatch}
                        onChange={(e) => setSelectedDashBatch(e.target.value)}
                        className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-purple"
                      >
                        <option value="" disabled>-- Select Batch --</option>
                        {batchesList.map(b => (
                          <option key={b} value={b}>Batch {b}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleSelectDashBatch(selectedDashBatch)}
                        disabled={!selectedDashBatch || isUpdatingDashBatch}
                        className="px-4 py-2 bg-brand-purple hover:bg-purple-600 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {isUpdatingDashBatch ? "Loading..." : "Activate"}
                      </button>
                    </div>
                  </div>
                ) : loadingSchedule ? (
                  <div className="py-12 flex flex-col items-center justify-center text-slate-400 text-xs">
                    <Loader2 className="w-6 h-6 animate-spin text-brand-purple mb-2" />
                    Loading today's schedule for Batch {currentUser.batch}...
                  </div>
                ) : todayClasses.length === 0 ? (
                  <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 text-center text-slate-400 text-xs">
                    <p className="font-semibold text-slate-300">No classes scheduled for {todayDayName || "today"}.</p>
                    <p className="mt-1">Batch {currentUser.batch} has no scheduled lectures today. Enjoy your day off or review your weekly schedule!</p>
                  </div>
                ) : (
                  /* Today's Class Cards */
                  <div className="flex flex-col gap-4">
                    {todayClasses.map((cls) => {
                      const subStats = attendanceStats.subjects?.find(s => s.code === cls.base_subject_code || s.code === cls.subject_code) || {
                        present: 0,
                        absent: 0,
                        cancelled: 0,
                        conducted: 0,
                        attendedPoints: 0,
                        conductedPoints: 0,
                        percentage: 100
                      };

                      return (
                        <div key={cls.slotId} className="p-4 bg-slate-900/70 border border-slate-800/90 rounded-2xl flex flex-col gap-3 hover:border-slate-700 transition-all">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-heading font-bold text-xs text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded-md border border-brand-blue/20">
                                  {cls.subject_code}
                                </span>
                                <span className="font-heading font-bold text-sm text-slate-100">{cls.subject_name}</span>
                                {cls.isElective && (
                                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30">
                                    Elective
                                  </span>
                                )}
                                <span className="text-[10px] bg-slate-800/90 text-slate-300 px-1.5 py-0.5 rounded-md border border-slate-700 font-semibold">
                                  {cls.sessionType || cls.type || "Lecture"} ({cls.weight ?? 1.0} wt)
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-semibold mt-1 block flex items-center gap-2">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-brand-purple" /> {cls.time}</span>
                                {cls.location && <span>• {cls.location}</span>}
                                {cls.base_subject_code && cls.base_subject_code !== cls.subject_code && (
                                  <span className="text-slate-500">• Clubbed under {cls.base_subject_code}</span>
                                )}
                              </span>
                            </div>

                            <div className="text-right">
                              <span className={`font-heading font-extrabold text-sm ${subStats.percentage >= 75 ? "text-emerald-400" : "text-rose-400"}`}>
                                {subStats.percentage}% Attendance
                              </span>
                              <span className="text-[10px] text-slate-400 block font-medium">
                                ({subStats.attendedPoints ?? subStats.present} / {subStats.conductedPoints ?? subStats.conducted} pts • {subStats.present} Attended)
                              </span>
                            </div>
                          </div>

                          {/* 3 Status Options to Mark Today */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800/60 text-xs">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Mark Today's Status:
                            </span>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleMarkAttendance(cls, "present")}
                                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition-all cursor-pointer ${
                                  cls.todayStatus === "present"
                                    ? "bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/20 scale-105"
                                    : "bg-slate-800 border-slate-700 text-emerald-400 hover:bg-emerald-500/10"
                                }`}
                              >
                                <CheckCircle className="w-3.5 h-3.5" /> Present
                              </button>

                              <button
                                onClick={() => handleMarkAttendance(cls, "absent")}
                                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition-all cursor-pointer ${
                                  cls.todayStatus === "absent"
                                    ? "bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/20 scale-105"
                                    : "bg-slate-800 border-slate-700 text-rose-400 hover:bg-rose-500/10"
                                }`}
                              >
                                <XCircle className="w-3.5 h-3.5" /> Absent
                              </button>

                              <button
                                onClick={() => handleMarkAttendance(cls, "cancelled")}
                                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition-all cursor-pointer ${
                                  cls.todayStatus === "cancelled"
                                    ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 scale-105"
                                    : "bg-slate-800 border-slate-700 text-amber-400 hover:bg-amber-500/10"
                                }`}
                              >
                                <AlertCircle className="w-3.5 h-3.5" /> Cancelled
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Footer Summary */}
                <div className="pt-4 mt-4 border-t border-slate-800 text-xs text-slate-400 font-semibold flex flex-wrap justify-between items-center gap-2">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <CheckCircle className="w-3.5 h-3.5" /> Attended: {totalPresent} ({attendanceStats.overall?.attendedPoints ?? totalPresent} pts)
                    </span>
                    <span className="flex items-center gap-1 text-rose-400 font-bold">
                      <XCircle className="w-3.5 h-3.5" /> Missed: {totalAbsent}
                    </span>
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <AlertCircle className="w-3.5 h-3.5" /> Cancelled: {totalCancelled}
                    </span>
                  </div>

                  <span className="font-extrabold text-slate-100">
                    Weighted Rate: {overallAttendanceRate}%
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
        onClick={() => {
          setShowNoteForm(!showNoteForm);
          setEditingNoteId(null);
          setNewNoteTitle("");
          setNewNoteContent("");
        }}
        className="w-7 h-7 rounded-lg border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-slate-800"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>

    {notesError && (
      <p className="text-[10px] text-rose-400 font-semibold mb-2">{notesError}</p>
    )}

    {showNoteForm ? (
      <form
        onSubmit={
          editingNoteId
            ? (e) => { e.preventDefault(); handleEditNote(newNoteTitle, newNoteContent); }
            : handleAddNote
        }
        className="flex flex-col gap-2 p-2 bg-slate-900/50 border border-slate-800 rounded-2xl animate-fade-in mb-3"
      >
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
          <button
            type="button"
            onClick={() => {
              setShowNoteForm(false);
              setEditingNoteId(null);
              setNewNoteTitle("");
              setNewNoteContent("");
            }}
            className="text-[9px] font-bold px-2 py-1 text-slate-500 hover:underline"
          >
            Cancel
          </button>
          <button type="submit" className="text-[9px] font-bold px-3 py-1 bg-brand-blue text-white rounded-lg">
            {editingNoteId ? "Update" : "Save"}
          </button>
        </div>
      </form>
    ) : (
      <div className="flex flex-col gap-3 max-h-[160px] overflow-y-auto pr-1">
        {notes.map((note) => (
          <div key={note._id} className="p-2.5 bg-slate-900/40 border border-slate-800 rounded-2xl flex justify-between items-start gap-2">
            <div className="min-w-0 text-left">
              <span className="font-heading font-bold text-xs text-slate-200 block truncate">{note.title}</span>
              <span className="text-[10px] text-slate-400 leading-normal block mt-0.5 truncate">{note.content}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => {
                  openEditNote(note);
                  setShowNoteForm(true);
                }}
                className="text-slate-400 hover:text-brand-purple p-0.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDeleteNote(note._id)}
                className="text-slate-400 hover:text-rose-500 p-0.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
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
                     {tasksError && (
                        <p className="text-[10px] text-rose-400 font-semibold mb-2">{tasksError}</p>
                      )}

                    <form onSubmit={handleAddTask} className="flex gap-2 mb-3">
                      <input 
                        type="text" 
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                        placeholder="Add a task..."
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-purple font-medium"
                      />
                      <input
                        type="date"
                        value={newTaskDeadline}
                        onChange={(e)=> setNewTaskDeadline(e.target.value)} 
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-purple font-medium"/>
                      <select
                        value={newTaskPriority}
                        onChange={(e)=>setNewTaskPriority(e.target.value)}
                        className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-purple font-medium"
                        >
                          <option value="">Priority</option>
                              {[...Array(10)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                              ))}
                      </select>
                      
                      <button type="submit" className="px-3 bg-brand-purple text-white rounded-xl flex items-center justify-center">
                        <Plus className="w-4 h-4" />
                      </button>
                    </form>

                    <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto pr-1">
                      {tasks.map((task) => (
                        <div key={task._id} className="flex items-center justify-between p-2.5 bg-slate-900/50 border border-slate-800/40 rounded-xl">
                          <button 
                            onClick={() => handleToggleTask(task._id,task.status)}
                            className="flex items-center gap-2.5 text-left w-full focus:outline-none cursor-pointer"
                          >
                            {task.status==='completed' ? (
                              <CheckSquare className="w-4 h-4 text-brand-purple shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-600 shrink-0" />
                            )}
                            <span className={`text-xs font-medium text-slate-200 ${task.status==='completed'? "line-through text-slate-500" : ""}`}>
                              {task.title}
                            </span>
                          </button>
                          <button onClick={() => handleDeleteTask(task._id)} className="text-slate-400 hover:text-rose-500 p-0.5">
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

              {/* WIDGET 4: KEEP CALENDAR REMINDERS (real /events — Option A, no mute toggle) */}
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

                {remindersError && (
                  <p className="text-[10px] text-rose-400 font-semibold mb-2">{remindersError}</p>
                )}

                {showReminderForm && (
                  <form onSubmit={handleAddReminder} className="mb-6 p-4 bg-slate-900/80 border border-slate-800 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in">
                    <div className="flex flex-col gap-1 sm:col-span-2">
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
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Starts</label>
                      <input
                        type="datetime-local"
                        value={newReminderStart}
                        onChange={(e) => setNewReminderStart(e.target.value)}
                        className="px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-brand-purple text-slate-100 font-medium"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Ends (optional)</label>
                      <input
                        type="datetime-local"
                        value={newReminderEnd}
                        onChange={(e) => setNewReminderEnd(e.target.value)}
                        className="px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-brand-purple text-slate-100 font-medium"
                      />
                    </div>
                    <div className="flex flex-col gap-1 sm:col-span-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Location (optional)</label>
                      <input
                        type="text"
                        placeholder="Room / link"
                        value={newReminderLocation}
                        onChange={(e) => setNewReminderLocation(e.target.value)}
                        className="px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-brand-purple text-slate-100 font-medium"
                      />
                    </div>
                    <div className="sm:col-span-2 flex justify-end gap-2 mt-2">
                      <button type="button" onClick={() => setShowReminderForm(false)} className="text-xs font-bold text-slate-500 hover:underline">Cancel</button>
                      <button type="submit" className="text-xs font-bold px-4 py-1.5 bg-brand-purple text-white rounded-xl">Add Event</button>
                    </div>
                  </form>
                )}

                {loadingReminders ? (
                  <div className="py-8 flex items-center justify-center text-slate-400 text-xs">
                    <Loader2 className="w-5 h-5 animate-spin text-brand-purple mr-2" /> Loading reminders...
                  </div>
                ) : reminders.length === 0 ? (
                  <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 text-center text-slate-400 text-xs">
                    No reminders yet — add one above.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {reminders.map((rem) => (
                      <div 
                        key={rem._id} 
                        className="p-4 rounded-2xl border border-brand-purple/20 bg-brand-purple/15 shadow-sm transition-all flex flex-col justify-between min-h-[120px]"
                      >
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <span className="font-heading font-extrabold text-xs text-slate-100 leading-tight block">{rem.title}</span>
                            <button 
                              onClick={() => handleDeleteReminder(rem._id)}
                              className="p-1 rounded-lg text-slate-500 hover:text-rose-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold block mt-1.5 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-brand-purple" />
                            {new Date(rem.event_start).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                          </span>
                          {rem.location && rem.location !== "N/A" && (
                            <span className="text-[9px] text-slate-500 block mt-0.5">📍 {rem.location}</span>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-2 border-t border-slate-800">
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300">
                            {new Date(rem.event_start).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                      <span>Upcoming Reminders</span>
                      <span className="text-slate-200">{reminders.length} Scheduled</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-brand-purple h-full rounded-full" style={{ width: `${Math.min(100, reminders.length * 25)}%` }} />
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );

}