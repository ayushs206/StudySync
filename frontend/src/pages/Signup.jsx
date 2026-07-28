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
  AlertTriangle,
  Loader2,
  Send
} from "lucide-react";
import { api, setAccessToken } from "../api";

/* ── Password strength helper ── */
function getPasswordStrength(password) {
  if (!password) return "weak";
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const types = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

  if (password.length >= 10 && types === 4) return "strong";
  if (password.length >= 8 && types >= 2) return "medium";
  return "weak";
}

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation errors state
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  
  // Real email verification states
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const validateEmail = (val) => {
    return /^\S+@\S+\.\S+$/.test(val);
  };

  const validateForm = () => {
    const tempErrors = {};
    
    if (!firstName.trim()) {
      tempErrors.firstName = "First name is required.";
    }

    if (!lastName.trim()) {
      tempErrors.lastName = "Last name is required.";
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
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError("");

    if (!validateForm()) {
      setGlobalError("Please correct the errors in the form.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        username: username.trim(),
        password: password,
        year_of_study: parseInt(yearOfStudy, 10)
      };

      // Real REST API call to Express backend
      const res = await api.register(payload);

      if (res.accessToken) {
        setAccessToken(res.accessToken);
      }
      if (res.user) {
        localStorage.setItem("studysync_user", JSON.stringify(res.user));
      }

      setSignUpSuccess(true);
    } catch (err) {
      setGlobalError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendRealMail = async () => {
    setResendingEmail(true);
    setResendMessage("");
    try {
      await api.resendVerification();
      setResendMessage("A new verification link has been sent to your email!");
    } catch (err) {
      setResendMessage(err.message || "Failed to resend verification email.");
    } finally {
      setResendingEmail(false);
    }
  };

  const strength = getPasswordStrength(password);

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#090d16] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Decorative Gradient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] bg-brand-blue/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] bg-brand-purple/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 glass-card rounded-3xl overflow-hidden shadow-2xl relative z-10 border border-slate-800/80 min-h-[580px] animate-entrance">
        
        {/* Left Side Panel */}
        <div className="md:col-span-5 bg-gradient-to-tr from-brand-blue via-brand-purple to-brand-green p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
          
          <div className="relative z-10">
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 text-white/90 hover:text-white text-sm font-semibold transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </Link>
          </div>

          <div className="relative z-10 my-auto flex flex-col gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-2 shadow-sm animate-float">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h2 className="font-heading font-extrabold text-3xl tracking-tight leading-snug">
              Begin your study journey.
            </h2>
            <p className="text-white/90 text-sm leading-relaxed font-medium">
              Create an account to build custom study schedules, track milestones, and sync tasks in one place.
            </p>
          </div>

          <div className="relative z-10 text-xs text-white/70 text-left font-medium">
            <p>© 2026 StudySync Collaboration</p>
          </div>
        </div>

        {/* Right Side: Form Container */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-slate-900/90 backdrop-blur-md animate-slide-in-right">
          
          {signUpSuccess ? (
            /* REAL EMAIL VERIFICATION SENT VIEW */
            <div className="text-left py-6 flex flex-col gap-6 animate-slide-up">
              <div className="w-16 h-16 rounded-3xl bg-brand-purple/20 text-purple-400 flex items-center justify-center mb-2">
                <Mail className="w-8 h-8 animate-float" />
              </div>

              <div>
                <h3 className="font-heading font-extrabold text-3xl text-white tracking-tight">
                  Check Your Email Inbox
                </h3>
                <p className="text-slate-300 mt-2 text-sm leading-relaxed">
                  A real email verification link has been sent to <strong className="text-brand-purple font-bold">{email}</strong>.
                </p>
              </div>

              <div className="p-4 bg-brand-purple/15 border border-brand-purple/20 rounded-2xl text-slate-200 text-xs leading-relaxed flex gap-3">
                <AlertTriangle className="w-5 h-5 text-brand-purple shrink-0" />
                <div>
                  <span className="font-bold text-brand-purple block uppercase tracking-wider text-[9px] mb-0.5">Real Email Sent</span>
                  Please open your email inbox (and spam folder) and click the verification button inside the email to activate your StudySync account.
                </div>
              </div>

              {resendMessage && (
                <div className="p-3 bg-blue-950/40 border border-blue-900 text-blue-300 rounded-xl text-xs font-semibold">
                  {resendMessage}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={handleResendRealMail}
                  disabled={resendingEmail}
                  className="px-6 py-3 rounded-xl bg-brand-purple text-white font-bold text-center hover:shadow-md transition-all cursor-pointer text-xs btn-premium flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {resendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Resend Email
                </button>
                <Link
                  to="/login"
                  className="px-6 py-3 rounded-xl border border-slate-700 text-slate-200 font-bold text-center hover:bg-slate-800 transition-colors text-xs flex items-center justify-center"
                >
                  Go to Login
                </Link>
              </div>
            </div>
          ) : (
            /* SIGN UP REGISTRATION FORM */
            <div>
              <div className="text-left mb-6">
                <h3 className="font-heading font-extrabold text-3xl text-white tracking-tight">
                  Create Account
                </h3>
                <p className="text-slate-400 mt-1 font-medium text-sm">
                  join the <span className="text-brand-purple font-bold">StudySync</span> community
                </p>
              </div>

              {globalError && (
                <div className="mb-4 p-3 bg-rose-950/40 border border-rose-900 text-rose-300 rounded-2xl text-xs text-left font-semibold animate-fade-in">
                  {globalError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
                
                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
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
                        className={`w-full pl-11 pr-3 py-2.5 bg-slate-800/60 border rounded-2xl text-white text-sm focus:outline-none focus:border-brand-purple focus:bg-slate-800 transition-all shadow-sm font-medium focus-glow ${
                          errors.firstName ? "border-rose-500 focus:border-rose-500" : "border-slate-700/80"
                        }`}
                      />
                    </div>
                    {errors.firstName && <span className="text-[10px] text-rose-500 font-bold mt-1 pl-1">{errors.firstName}</span>}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
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
                        className={`w-full pl-11 pr-3 py-2.5 bg-slate-800/60 border rounded-2xl text-white text-sm focus:outline-none focus:border-brand-purple focus:bg-slate-800 transition-all shadow-sm font-medium focus-glow ${
                          errors.lastName ? "border-rose-500 focus:border-rose-500" : "border-slate-700/80"
                        }`}
                      />
                    </div>
                    {errors.lastName && <span className="text-[10px] text-rose-500 font-bold mt-1 pl-1">{errors.lastName}</span>}
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
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
                      className={`w-full pl-11 pr-4 py-2.5 bg-slate-800/60 border rounded-2xl text-white text-sm focus:outline-none focus:border-brand-purple focus:bg-slate-800 transition-all shadow-sm font-medium focus-glow ${
                        errors.email ? "border-rose-500 focus:border-rose-500" : "border-slate-700/80"
                      }`}
                    />
                  </div>
                  {errors.email && <span className="text-[10px] text-rose-500 font-bold mt-1 pl-1">{errors.email}</span>}
                </div>

                {/* Username & Year of Study */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
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
                        className={`w-full pl-11 pr-3 py-2.5 bg-slate-800/60 border rounded-2xl text-white text-sm focus:outline-none focus:border-brand-purple focus:bg-slate-800 transition-all shadow-sm font-medium focus-glow ${
                          errors.username ? "border-rose-500 focus:border-rose-500" : "border-slate-700/80"
                        }`}
                      />
                    </div>
                    {errors.username && <span className="text-[10px] text-rose-500 font-bold mt-1 pl-1">{errors.username}</span>}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                      Year of Study
                    </label>
                    <div className="relative flex items-center">
                      <GraduationCap className="w-4.5 h-4.5 text-slate-400 absolute left-4 z-10" />
                      <select 
                        value={yearOfStudy}
                        onChange={(e) => setYearOfStudy(e.target.value)}
                        className="w-full pl-11 pr-3 py-2.5 bg-slate-800/60 border border-slate-700/80 rounded-2xl text-white text-sm focus:outline-none focus:border-brand-purple focus:bg-slate-800 transition-all shadow-sm appearance-none cursor-pointer font-medium"
                      >
                        <option value="1" className="bg-slate-900 text-white">1st Year (Freshman)</option>
                        <option value="2" className="bg-slate-900 text-white">2nd Year (Sophomore)</option>
                        <option value="3" className="bg-slate-900 text-white">3rd Year (Junior)</option>
                        <option value="4" className="bg-slate-900 text-white">4th Year (Senior)</option>
                        <option value="5" className="bg-slate-900 text-white">5th Year (Graduate)</option>
                      </select>
                      <div className="pointer-events-none absolute right-4 flex items-center">
                        <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
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
                      className={`w-full pl-11 pr-12 py-2.5 bg-slate-800/60 border rounded-2xl text-white text-sm focus:outline-none focus:border-brand-purple focus:bg-slate-800 transition-all shadow-sm font-medium focus-glow ${
                        errors.password ? "border-rose-500 focus:border-rose-500" : "border-slate-700/80"
                      }`}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 p-1 text-slate-400 hover:text-slate-200 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <span className="text-[10px] text-rose-500 font-bold mt-1 pl-1">{errors.password}</span>}
                  
                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`strength-bar ${
                          strength === "strong" ? "strength-strong" :
                          strength === "medium" ? "strength-medium" : "strength-weak"
                        }`} />
                      </div>
                      <span className={`text-[10px] font-bold ${
                        strength === "strong" ? "text-emerald-400" :
                        strength === "medium" ? "text-amber-400" : "text-rose-400"
                      }`}>
                        {strength.charAt(0).toUpperCase() + strength.slice(1)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 mt-2 rounded-2xl bg-gradient-to-r from-brand-blue via-brand-purple to-brand-green text-white font-bold text-center hover:shadow-lg hover:shadow-brand-purple/20 hover:-translate-y-0.5 transition-all cursor-pointer btn-premium disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "SIGN UP"
                  )}
                </button>
              </form>

              <p className="text-sm text-slate-400 mt-6">
                Already have an account?{" "}
                <Link to="/login" className="font-bold text-purple-400 hover:underline">
                  Login
                </Link>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
