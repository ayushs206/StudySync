import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  BookOpen,
  AlertTriangle,
  Loader2,
  Send,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  XCircle
} from "lucide-react";
import { api, setAccessToken, getAccessToken } from "../api";

export default function Login() {
  const navigate = useNavigate();

  // Redirect to dashboard if token exists
  useEffect(() => {
    if (getAccessToken() || localStorage.getItem("studysync_token")) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Verification states
  const [verificationStatus, setVerificationStatus] = useState(null); // null | 'verified' | 'unverified'
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendSuccessMsg, setResendSuccessMsg] = useState("");

  const validateEmail = (val) => {
    return /^\S+@\S+\.\S+$/.test(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setVerificationStatus(null);
    setResendSuccessMsg("");
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      // Real REST API login call (backend or registered DB search)
      const res = await api.login({
        email: email.trim().toLowerCase(),
        password: password
      });

      if (res.accessToken) {
        setAccessToken(res.accessToken);
      }

      if (res.user) {
        localStorage.setItem("studysync_user", JSON.stringify(res.user));

        if (res.user.isVerified) {
          setVerificationStatus("verified");
        } else {
          setVerificationStatus("unverified");
        }

        // Navigate to dashboard
        setTimeout(() => {
          navigate("/dashboard");
        }, 600);
      }
    } catch (err) {
      // If user is not found or credentials wrong -> Invalid credentials
      setError(err.message || "Invalid credentials. User does not exist or password incorrect.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerificationMail = async () => {
    setResendingEmail(true);
    setResendSuccessMsg("");
    try {
      await api.resendVerification();
      setResendSuccessMsg("Verification email sent! Account marked verified.");
      setVerificationStatus("verified");
    } catch (err) {
      setError(err.message || "Failed to resend verification email.");
    } finally {
      setResendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#090d16] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Decorative Gradient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] bg-brand-blue/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] bg-brand-purple/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 glass-card rounded-3xl overflow-hidden shadow-2xl relative z-10 border border-slate-800/80 min-h-[540px] animate-entrance">
        
        {/* Left Side Panel */}
        <div className="md:col-span-5 bg-gradient-to-tr from-brand-blue via-brand-purple to-brand-green p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
          
          <div className="relative z-10">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-white/90 hover:text-white text-sm font-semibold transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </div>

          <div className="relative z-10 my-auto flex flex-col gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-2 shadow-sm animate-float">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h2 className="font-heading font-extrabold text-3xl tracking-tight leading-snug">
              Syncing thoughts, simplifying study.
            </h2>
            <p className="text-white/90 text-sm leading-relaxed font-medium">
              Step back into your study center. Real account validation and verification tracking in one app.
            </p>
          </div>

          <div className="relative z-10 text-xs text-white/70 text-left font-medium">
            <p>© 2026 StudySync Collaboration</p>
          </div>
        </div>

        {/* Right Side: Form Container */}
        <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-slate-900/90 backdrop-blur-md animate-slide-in-right">
          
          <div className="text-left mb-6">
            <h3 className="font-heading font-extrabold text-3xl text-white tracking-tight">
              Hello there,
            </h3>
            <p className="text-slate-400 mt-1 font-medium">
              welcome to <span className="text-brand-purple font-bold">StudySync</span>
            </p>
          </div>

          {/* Verification Status Banner if checked */}
          {verificationStatus && (
            <div className={`mb-4 p-3.5 rounded-2xl border text-xs font-semibold flex flex-col gap-2 text-left animate-fade-in ${
              verificationStatus === "verified" 
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-amber-500/10 border-amber-500/30 text-amber-300"
            }`}>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold">
                  {verificationStatus === "verified" ? (
                    <> <CheckCircle className="w-4 h-4 text-emerald-400" /> Email Status: Verified </>
                  ) : (
                    <> <ShieldAlert className="w-4 h-4 text-amber-400" /> Email Status: Pending Verification </>
                  )}
                </span>
                
                {verificationStatus === "unverified" && (
                  <button 
                    onClick={handleResendVerificationMail}
                    disabled={resendingEmail}
                    className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg text-[10px] hover:bg-amber-400 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {resendingEmail ? "Sending..." : "Verify / Resend Email"}
                  </button>
                )}
              </div>
              {resendSuccessMsg && <p className="text-[10px] text-emerald-400 font-bold">{resendSuccessMsg}</p>}
            </div>
          )}

          {/* Invalid Credentials Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-rose-950/40 border border-rose-900 text-rose-300 rounded-2xl text-xs text-left font-semibold flex items-center gap-2 animate-fade-in">
              <AlertTriangle className="w-4.5 h-4.5 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-5 h-5 text-slate-400 absolute left-4" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  disabled={isLoading}
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-800/60 border border-slate-700/80 rounded-2xl text-white text-sm focus:outline-none focus:border-brand-purple focus:bg-slate-800 transition-all shadow-sm placeholder:text-slate-500 font-medium focus-glow disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                  Password
                </label>
                <a href="#forgot" className="text-xs font-semibold text-purple-400 hover:underline">
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
                  disabled={isLoading}
                  required
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-800/60 border border-slate-700/80 rounded-2xl text-white text-sm focus:outline-none focus:border-brand-purple focus:bg-slate-800 transition-all shadow-sm placeholder:text-slate-500 font-medium focus-glow disabled:opacity-60"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 p-1 text-slate-400 hover:text-slate-200 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 mt-3 rounded-2xl bg-gradient-to-r from-brand-blue via-brand-purple to-brand-green text-white font-bold text-center hover:shadow-lg hover:shadow-brand-purple/25 hover:-translate-y-0.5 transition-all cursor-pointer btn-premium disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 text-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Validating account...
                </>
              ) : (
                "LOGIN"
              )}
            </button>
          </form>

          <p className="text-sm text-slate-400 mt-8">
            Don't have an account?{" "}
            <Link to="/signup" className="font-bold text-purple-400 hover:underline">
              Sign Up
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
}
