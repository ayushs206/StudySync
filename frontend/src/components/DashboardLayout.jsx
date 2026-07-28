import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  Layers, 
  BookMarked,
  UserCheck,
  Menu,
  X,
  Award,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { api, setAccessToken } from "../api";

export default function DashboardLayout({ children, activeTab = "dashboard" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        if (isMounted) {
          navigate("/login");
        }
      }
    }

    fetchUser();
    return () => { isMounted = false; };
  }, [navigate]);

  const handleLogout = async () => {
    try { await api.logout(); } catch (e) {}
    setAccessToken(null);
    localStorage.removeItem("studysync_user");
    navigate("/login");
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090d16] text-slate-100 font-heading font-bold text-sm">
        Loading workspace...
      </div>
    );
  }

  if (!currentUser) return null;

  const userInitials = (currentUser.first_name?.charAt(0) || "") + (currentUser.last_name?.charAt(0) || "");
  const yearString = currentUser.year_of_study 
    ? `${currentUser.year_of_study}${currentUser.year_of_study === 1 ? "st" : currentUser.year_of_study === 2 ? "nd" : currentUser.year_of_study === 3 ? "rd" : "th"} Year Student`
    : "Student";

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Layers, path: "/dashboard" },
    { id: "classes", label: "My Classes", icon: BookMarked, path: "/classes" },
    { id: "schedule", label: "Schedule", icon: Calendar, path: "/schedule" },
    { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#090d16] text-slate-100 relative">
      
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-slate-950/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
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

          {/* User Profile Card with Email Verification Status Badge */}
          <div className="p-4 rounded-2xl bg-gradient-to-tr from-brand-blue/10 via-brand-purple/10 to-brand-green/10 border border-slate-800 flex items-center gap-3 text-left">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center text-white font-bold shadow-md shadow-brand-purple/10 uppercase shrink-0">
              {userInitials || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <p className="font-heading font-bold text-sm text-slate-100 truncate">{currentUser.first_name} {currentUser.last_name}</p>
                
                {/* Email Verification Status Badge */}
                {currentUser.isVerified ? (
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20 shrink-0" title="Email Verified">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full border border-amber-500/20 shrink-0" title="Email Unverified">
                    <AlertCircle className="w-2.5 h-2.5" /> Unverified
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 font-medium truncate">
                {currentUser.role === "admin" ? "System Admin" : yearString}
              </p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-1 text-left">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || activeTab === item.id;
              
              if (item.onClick) {
                return (
                  <button 
                    key={item.id}
                    onClick={item.onClick}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-brand-purple/10 hover:text-purple-400 font-medium text-sm transition-colors w-full cursor-pointer"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors w-full ${
                    isActive 
                      ? "bg-brand-purple/20 text-purple-400 border border-brand-purple/30" 
                      : "text-slate-400 hover:bg-brand-purple/10 hover:text-purple-400"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
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

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Mobile Hamburger Header */}
        <div className="flex items-center justify-between md:hidden mb-6">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 shadow-sm"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-heading font-bold text-lg text-slate-100 capitalize">{activeTab}</span>
        </div>

        {children}
      </main>

    </div>
  );
}
