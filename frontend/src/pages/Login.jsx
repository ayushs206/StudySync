import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  BookOpen,
  Inbox,
  AlertTriangle
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  
  // Mailbox simulator states
  const [showMailboxSim, setShowMailboxSim] = useState(false);
  const [simName, setSimName] = useState("");
  const [simEmail, setSimEmail] = useState("");

  const validateEmail = (val) => {
    return /^\S+@\S+\.\S+$/.test(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    setError("");

    const lowerEmail = email.trim().toLowerCase();

    // Admin role handling
    if (lowerEmail === "admin@studysync.com") {
      if (password !== "admin12345") {
        setError("Invalid admin credentials. Try password 'admin12345'.");
        return;
      }
      const adminSession = {
        first_name: "System",
        last_name: "Admin",
        email: "admin@studysync.com",
        username: "admin_studysync",
        role: "admin",
        isVerified: true
      };
      localStorage.setItem("studysync_user", JSON.stringify(adminSession));
    } else {
      // User role handling: Retrieve saved info if they registered, otherwise initialize mock session
      const savedUserStr = localStorage.getItem("studysync_user");
      let userSession;

      if (savedUserStr) {
        const savedUser = JSON.parse(savedUserStr);
        if (savedUser.email === lowerEmail) {
          userSession = savedUser;
        }
      }

      if (!userSession) {
        // Fallback dynamic profile creation
        const usernamePart = lowerEmail.split("@")[0];
        userSession = {
          first_name: usernamePart.charAt(0).toUpperCase() + usernamePart.slice(1),
          last_name: "Student",
          email: lowerEmail,
          username: usernamePart,
          year_of_study: 3,
          role: "user",
          isVerified: false
        };
        localStorage.setItem("studysync_user", JSON.stringify(userSession));
        localStorage.setItem("studysync_verification_sent", "true");
      }

      // STRICT VERIFICATION CHECK (User requested: must verify to login and use services)
      if (!userSession.isVerified) {
        setError("Your email is not verified. You have to verify your mail to login and use the services.");
        setSimName(userSession.first_name);
        setSimEmail(userSession.email);
        setShowMailboxSim(true); // Auto open simulator to help them verify
        return;
      }
    }

    // Redirect to dashboard
    navigate("/dashboard");
  };

  const handleSimulateEmailVerification = () => {
    const savedUserStr = localStorage.getItem("studysync_user");
    if (savedUserStr) {
      const savedUser = JSON.parse(savedUserStr);
      savedUser.isVerified = true;
      localStorage.setItem("studysync_user", JSON.stringify(savedUser));
    }
    setShowMailboxSim(false);
    setError("");
    alert("Verification successful! You can now log in.");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Dynamic Botanical SVG Background */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <svg viewBox="0 0 1440 900" className="w-full h-full object-cover opacity-90" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="leafGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="leafGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#eff6ff" />
              <stop offset="50%" stopColor="#f5f3ff" />
              <stop offset="100%" stopColor="#ecfdf5" />
            </linearGradient>
          </defs>

          <rect width="1440" height="900" fill="url(#waveGrad)" />
          <path d="M 0,900 C 300,850 400,650 200,450 C 50,300 0,100 0,0 L 1440,0 L 1440,900 Z" fill="rgba(255, 255, 255, 0.45)" />
          <path d="M 1440,900 C 1140,850 1040,650 1240,450 C 1390,300 1440,100 1440,0 Z" fill="rgba(255, 255, 255, 0.35)" />
          <path d="M 0,900 Q 350,750 720,800 T 1440,900 Z" fill="rgba(255, 255, 255, 0.8)" />

          <g transform="translate(1100, 350) scale(1.4)" className="animate-float">
            <path d="M 10,200 Q 120,100 150,0" stroke="#047857" strokeWidth="3" fill="none" opacity="0.3" />
            <path d="M 102,110 C 130,90 180,90 190,120 C 160,140 120,140 102,110 Z" fill="url(#leafGrad1)" />
            <path d="M 52,150 C 80,120 120,110 140,140 C 110,170 70,170 52,150 Z" fill="url(#leafGrad2)" />
          </g>
        </svg>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 glass-card rounded-3xl overflow-hidden shadow-2xl relative z-10 border border-white/50 min-h-[550px]">
        
        {/* Left Side: Splash Panel */}
        <div className="md:col-span-5 bg-gradient-to-tr from-brand-blue via-brand-purple to-brand-green p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
          
          <div className="relative z-10">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </div>

          <div className="relative z-10 my-auto flex flex-col gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-2 shadow-sm">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h2 className="font-heading font-extrabold text-3xl tracking-tight leading-snug">
              Syncing thoughts, simplifying study.
            </h2>
            <p className="text-white/80 text-sm leading-relaxed">
              Step back into your study center. Collaborate on real-time projects and keep your goals in sight.
            </p>
          </div>

          <div className="relative z-10 text-xs text-white/60 text-left">
            <p>© 2026 StudySync Collaboration</p>
          </div>
        </div>

        {/* Right Side: Form Container */}
        <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white/70 backdrop-blur-md">
          
          <div className="text-left mb-8">
            <h3 className="font-heading font-extrabold text-3xl text-slate-800 tracking-tight">
              Hello there,
            </h3>
            <p className="text-slate-500 mt-1 font-medium">
              welcome to <span className="text-brand-purple font-bold">StudySync</span>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl text-xs text-left font-semibold flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4.5 h-4.5 text-rose-500 shrink-0" />
                <span>{error}</span>
              </div>
              {!error.includes("fields") && !error.includes("characters") && (
                <button 
                  onClick={() => setShowMailboxSim(true)}
                  className="mt-1 text-[10px] font-bold text-brand-purple hover:underline self-start uppercase tracking-wider"
                >
                  Verify via Mailbox Simulator →
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 tracking-wider uppercase">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-5 h-5 text-slate-400 absolute left-4" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-sm focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-inner placeholder:text-slate-400 font-semibold"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 tracking-wider uppercase">
                  Password (min 8 characters)
                </label>
                <a href="#forgot" className="text-xs font-semibold text-brand-purple hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative flex items-center">
                <Lock className="w-5 h-5 text-slate-400 absolute left-4" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-sm focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-inner placeholder:text-slate-400 font-semibold"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 p-1 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full py-4 mt-2 rounded-2xl bg-gradient-to-r from-brand-blue via-brand-purple to-brand-green text-white font-bold text-center hover:shadow-lg hover:shadow-brand-purple/20 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              LOGIN
            </button>
          </form>

          <p className="text-sm text-slate-500 mt-8">
            Don't have an account?{" "}
            <Link to="/signup" className="font-bold text-brand-blue hover:underline">
              Sign Up
            </Link>
          </p>

        </div>
      </div>

      {/* MAILBOX SIMULATOR MODAL (For Login page verify checks) */}
      {showMailboxSim && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col min-h-[420px] animate-fade-in text-left">
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
                  <p>Hi {simName || "Student"},</p>
                  <p>We noticed you are attempting to log in to <strong>StudySync Collaboration</strong>, but your account is not verified. <strong>You have to verify your mail to login and use our services.</strong></p>
                  <p>Please click the button below to verify your email address and authorize your login credentials:</p>
                  
                  <div className="py-4 flex justify-center">
                    <button 
                      onClick={handleSimulateEmailVerification}
                      className="px-6 py-3 bg-gradient-to-r from-brand-blue via-brand-purple to-brand-green text-white font-bold text-center rounded-xl shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all cursor-pointer text-xs"
                    >
                      Verify My Account Email
                    </button>
                  </div>
                  
                  <p className="text-[10px] text-slate-400">
                    If you did not initiate this request, please ignore this email.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-100 p-4 text-center text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Email client interface simulator
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
