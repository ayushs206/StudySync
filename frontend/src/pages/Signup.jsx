import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  BookOpen,
  GraduationCap,
  CheckCircle,
  Inbox,
  AlertTriangle
} from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  
  // Fields state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("1");
  const [showPassword, setShowPassword] = useState(false);

  // Validation errors state
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  
  // Verification states
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [showMailboxSim, setShowMailboxSim] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [resendStatus, setResendStatus] = useState("");

  const validateEmail = (val) => {
    return /^\S+@\S+\.\S+$/.test(val);
  };

  const validateForm = () => {
    const tempErrors = {};
    
    if (!firstName.trim()) {
      tempErrors.firstName = "First name is required.";
    } else if (firstName.length > 50) {
      tempErrors.firstName = "First name cannot exceed 50 characters.";
    }

    if (!lastName.trim()) {
      tempErrors.lastName = "Last name is required.";
    } else if (lastName.length > 50) {
      tempErrors.lastName = "Last name cannot exceed 50 characters.";
    }

    if (!email.trim()) {
      tempErrors.email = "Email address is required.";
    } else if (!validateEmail(email)) {
      tempErrors.email = "Please enter a valid email address.";
    }

    if (!username.trim()) {
      tempErrors.username = "Username is required.";
    } else if (username.length < 3 || username.length > 30) {
      tempErrors.username = "Username must be between 3 and 30 characters.";
    }

    if (!password) {
      tempErrors.password = "Password is required.";
    } else if (password.length < 8) {
      tempErrors.password = "Password must be at least 8 characters long.";
    } else if (password.length > 100) {
      tempErrors.password = "Password cannot exceed 100 characters.";
    }
    else if (!/[A-Z]/.test(password)) {
      tempErrors.password = "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(password)) {
      tempErrors.password = "Password must contain at least one lowercase letter.";
    } else if (!/[0-9]/.test(password)) {
      tempErrors.password = "Password must contain at least one number.";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      tempErrors.password = "Password must contain at least one special character.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGlobalError("");

    if (!validateForm()) {
      setGlobalError("Please correct the errors in the form.");
      return;
    }

    // Save user as unverified in localStorage to simulate registration
    const userSession = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim().toLowerCase(),
      username: username.trim(),
      year_of_study: parseInt(yearOfStudy, 10),
      role: "user",
      isVerified: false // MUST verify mail to use services
    };

    localStorage.setItem("studysync_user", JSON.stringify(userSession));
    localStorage.setItem("studysync_verification_sent", "true");

    // Transition to the Email Verification Sent view
    setSignUpSuccess(true);
  };

  const handleSimulateEmailVerification = () => {
    // Retrieve registered user, set isVerified to true
    const sessionStr = localStorage.getItem("studysync_user");
    if (sessionStr) {
      const user = JSON.parse(sessionStr);
      user.isVerified = true;
      localStorage.setItem("studysync_user", JSON.stringify(user));
    }
    
    setIsVerified(true);
    setShowMailboxSim(false);
  };

  const handleResendMail = () => {
    setResendStatus("Resending...");
    setTimeout(() => {
      setResendStatus("Sent!");
      alert("A new verification email has been sent! Open the Mailbox Simulator to inspect.");
      setShowMailboxSim(true);
    }, 1000);
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
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 glass-card rounded-3xl overflow-hidden shadow-2xl relative z-10 border border-white/50 min-h-[580px]">
        
        {/* Left Side Panel */}
        <div className="md:col-span-5 bg-gradient-to-tr from-brand-blue via-brand-purple to-brand-green p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
          
          <div className="relative z-10">
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </Link>
          </div>

          <div className="relative z-10 my-auto flex flex-col gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-2 shadow-sm">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h2 className="font-heading font-extrabold text-3xl tracking-tight leading-snug">
              Begin your study journey.
            </h2>
            <p className="text-white/80 text-sm leading-relaxed">
              Create an account to build custom study schedules, track milestones, and sync tasks in one place.
            </p>
          </div>

          <div className="relative z-10 text-xs text-white/60 text-left">
            <p>© 2026 StudySync Collaboration</p>
          </div>
        </div>

        {/* Right Side: Form Container or Success Verification Gate */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-white/70 backdrop-blur-md">
          
          {signUpSuccess ? (
            /* EMAIL VERIFICATION SENT VIEW (Lock Screen) */
            <div className="text-left py-6 flex flex-col gap-6 animate-fade-in">
              <div className="w-16 h-16 rounded-3xl bg-brand-purple/10 text-brand-purple flex items-center justify-center mb-2">
                <Mail className="w-8 h-8 animate-bounce" />
              </div>

              <div>
                <h3 className="font-heading font-extrabold text-3xl text-slate-800 tracking-tight">
                  {isVerified ? "Verification Successful!" : "Verify Your Email"}
                </h3>
                <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                  We've sent a verification email to <strong className="text-slate-700">{email}</strong>.
                </p>
              </div>

              {/* Requirement Subtext (User requested) */}
              <div className="p-4 bg-brand-purple/5 border border-brand-purple/20 rounded-2xl text-slate-700 text-xs leading-relaxed flex gap-3">
                <AlertTriangle className="w-5 h-5 text-brand-purple shrink-0" />
                <div>
                  <span className="font-bold text-brand-purple block uppercase tracking-wider text-[9px] mb-0.5">Important Security Notice</span>
                  You have to verify your mail to login and use the services.
                </div>
              </div>

              {isVerified ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  Your email has been verified! You can now log in to use your workspace.
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  <button 
                    onClick={() => setShowMailboxSim(true)}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-purple text-white font-bold text-center hover:shadow-md transition-all cursor-pointer text-xs"
                  >
                    Open Mailbox Simulator
                  </button>
                  <button 
                    onClick={handleResendMail}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-center hover:bg-slate-50 transition-colors text-xs"
                  >
                    {resendStatus || "Resend Email"}
                  </button>
                </div>
              )}

              <div className="mt-4 pt-6 border-t border-slate-200">
                <Link 
                  to="/login"
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs transition-all ${
                    isVerified 
                      ? "bg-gradient-to-r from-brand-blue to-brand-purple text-white shadow-md" 
                      : "bg-slate-100 text-slate-400 cursor-not-allowed hover:bg-slate-150"
                  }`}
                  onClick={(e) => !isVerified && e.preventDefault()}
                >
                  Proceed to Login
                </Link>
                {!isVerified && (
                  <span className="text-[10px] text-slate-400 block mt-2">
                    (Login button remains locked until email verification is triggered)
                  </span>
                )}
              </div>
            </div>
          ) : (
            /* SIGN UP REGISTRATION FORM WITH DETAILED INLINE VALIDATIONS */
            <div>
              <div className="text-left mb-6">
                <h3 className="font-heading font-extrabold text-3xl text-slate-800 tracking-tight">
                  Create Account,
                </h3>
                <p className="text-slate-500 mt-1 font-medium text-sm">
                  join the <span className="text-brand-purple font-bold">StudySync</span> community
                </p>
              </div>

              {globalError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl text-xs text-left font-semibold">
                  {globalError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
                
                {/* First Name & Last Name (Inline check) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                      First Name
                    </label>
                    <div className="relative flex items-center">
                      <User className="w-4.5 h-4.5 text-slate-400 absolute left-4" />
                      <input 
                        type="text" 
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          if (e.target.value.trim()) setErrors(prev => ({ ...prev, firstName: "" }));
                        }}
                        placeholder="First Name"
                        className={`w-full pl-11 pr-3 py-2.5 bg-slate-50/50 border rounded-2xl text-slate-800 text-sm focus:outline-none focus:bg-white transition-all shadow-inner font-semibold ${
                          errors.firstName ? "border-rose-300 focus:border-rose-500" : "border-slate-200 focus:border-brand-blue"
                        }`}
                      />
                    </div>
                    {errors.firstName && <span className="text-[10px] text-rose-500 font-bold mt-1 pl-1">{errors.firstName}</span>}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                      Last Name
                    </label>
                    <div className="relative flex items-center">
                      <User className="w-4.5 h-4.5 text-slate-400 absolute left-4" />
                      <input 
                        type="text" 
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value);
                          if (e.target.value.trim()) setErrors(prev => ({ ...prev, lastName: "" }));
                        }}
                        placeholder="Last Name"
                        className={`w-full pl-11 pr-3 py-2.5 bg-slate-50/50 border rounded-2xl text-slate-800 text-sm focus:outline-none focus:bg-white transition-all shadow-inner font-semibold ${
                          errors.lastName ? "border-rose-300 focus:border-rose-500" : "border-slate-200 focus:border-brand-blue"
                        }`}
                      />
                    </div>
                    {errors.lastName && <span className="text-[10px] text-rose-500 font-bold mt-1 pl-1">{errors.lastName}</span>}
                  </div>
                </div>

                {/* Email Address (Inline check) */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4.5 h-4.5 text-slate-400 absolute left-4" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (e.target.value.trim()) setErrors(prev => ({ ...prev, email: "" }));
                      }}
                      placeholder="Enter your email address"
                      className={`w-full pl-11 pr-4 py-2.5 bg-slate-50/50 border rounded-2xl text-slate-800 text-sm focus:outline-none focus:bg-white transition-all shadow-inner font-semibold ${
                        errors.email ? "border-rose-300 focus:border-rose-500" : "border-slate-200 focus:border-brand-blue"
                      }`}
                    />
                  </div>
                  {errors.email && <span className="text-[10px] text-rose-500 font-bold mt-1 pl-1">{errors.email}</span>}
                </div>

                {/* Username & Year of Study */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                      Username
                    </label>
                    <div className="relative flex items-center">
                      <User className="w-4.5 h-4.5 text-slate-400 absolute left-4" />
                      <input 
                        type="text" 
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          if (e.target.value.trim().length >= 3) setErrors(prev => ({ ...prev, username: "" }));
                        }}
                        placeholder="Username"
                        className={`w-full pl-11 pr-3 py-2.5 bg-slate-50/50 border rounded-2xl text-slate-800 text-sm focus:outline-none focus:bg-white transition-all shadow-inner font-semibold ${
                          errors.username ? "border-rose-300 focus:border-rose-500" : "border-slate-200 focus:border-brand-blue"
                        }`}
                      />
                    </div>
                    {errors.username && <span className="text-[10px] text-rose-500 font-bold mt-1 pl-1">{errors.username}</span>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                      Year of Study
                    </label>
                    <div className="relative flex items-center">
                      <GraduationCap className="w-4.5 h-4.5 text-slate-400 absolute left-4 z-10" />
                      <select 
                        value={yearOfStudy}
                        onChange={(e) => setYearOfStudy(e.target.value)}
                        className="w-full pl-11 pr-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 text-sm focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-inner appearance-none cursor-pointer font-semibold"
                      >
                        <option value="1">1st Year (Freshman)</option>
                        <option value="2">2nd Year (Sophomore)</option>
                        <option value="3">3rd Year (Junior)</option>
                        <option value="4">4th Year (Senior)</option>
                        <option value="5">5th Year (Graduate)</option>
                      </select>
                      <div className="pointer-events-none absolute right-4 flex items-center">
                        <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Password (Inline check) */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                    Password (min 8 characters)
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="w-4.5 h-4.5 text-slate-400 absolute left-4" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (e.target.value.length >= 8) setErrors(prev => ({ ...prev, password: "" }));
                      }}
                      placeholder="Choose a strong password"
                      className={`w-full pl-11 pr-12 py-2.5 bg-slate-50/50 border rounded-2xl text-slate-800 text-sm focus:outline-none focus:bg-white transition-all shadow-inner font-semibold ${
                        errors.password ? "border-rose-300 focus:border-rose-500" : "border-slate-200 focus:border-brand-blue"
                      }`}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 p-1 text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <span className="text-[10px] text-rose-500 font-bold mt-1 pl-1">{errors.password}</span>}
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  className="w-full py-3.5 mt-2 rounded-2xl bg-gradient-to-r from-brand-blue via-brand-purple to-brand-green text-white font-bold text-center hover:shadow-lg hover:shadow-brand-purple/20 hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  SIGN UP
                </button>
              </form>

              <p className="text-sm text-slate-500 mt-6">
                Already have an account?{" "}
                <Link to="/login" className="font-bold text-brand-purple hover:underline">
                  Login
                </Link>
              </p>
            </div>
          )}

        </div>
      </div>

      {/* MAILBOX SIMULATOR MODAL */}
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
                  <p>Hi {firstName || "Student"},</p>
                  <p>Thank you for registering on <strong>StudySync Collaboration</strong>. You have to verify your mail to login and use our services. Please click the verification button below to activate your account:</p>
                  
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
