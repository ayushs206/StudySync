import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertTriangle, BookOpen, ArrowRight } from "lucide-react";
import { api } from "../api";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("idle"); // 'idle' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("No reset token provided in URL. Please request a new password reset link.");
    }
  }, [token]);

  const getPasswordStrength = (pwd) => {
    if (!pwd) return "";
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    
    if (score <= 1) return "weak";
    if (score <= 3) return "medium";
    return "strong";
  };

  const strength = getPasswordStrength(newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!token) {
      setStatus("error");
      setErrorMessage("Reset token is missing from URL.");
      return;
    }

    if (newPassword.length < 8) {
      setStatus("error");
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus("error");
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await api.resetPassword(token, newPassword);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err.message || "Failed to reset password. The link may have expired or is invalid.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-[#090d16] text-slate-100 p-4">
      {/* Decorative Glow Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Card Container */}
      <div className="w-full max-w-md glass-card rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 text-center flex flex-col items-center gap-6 animate-entrance border border-slate-800">
        
        {/* Logo Header */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue via-brand-purple to-brand-green p-0.5 shadow-md">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-brand-purple" />
            </div>
          </div>
          <span className="font-heading font-extrabold text-2xl tracking-tight bg-gradient-to-r from-brand-blue via-brand-purple to-brand-green bg-clip-text text-transparent">
            StudySync
          </span>
        </Link>

        {status !== "success" ? (
          <div className="w-full flex flex-col gap-5 text-left">
            <div className="text-center">
              <h2 className="font-heading font-extrabold text-2xl text-slate-100">
                Reset Password
              </h2>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Enter your new password below to secure your StudySync account.
              </p>
            </div>

            {/* Error Alert */}
            {errorMessage && (
              <div className="p-4 bg-rose-950/40 border border-rose-900 text-rose-300 rounded-2xl text-xs flex items-center gap-2 animate-fade-in font-semibold">
                <AlertTriangle className="w-4.5 h-4.5 text-rose-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {token && (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* New Password Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                    New Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="w-5 h-5 text-slate-400 absolute left-4" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
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

                  {/* Password Strength Indicator */}
                  {newPassword && (
                    <div className="mt-1 flex flex-col gap-1">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                        <span>STRENGTH:</span>
                        <span className={`uppercase font-extrabold ${
                          strength === "weak" ? "text-rose-400" :
                          strength === "medium" ? "text-amber-400" : "text-emerald-400"
                        }`}>{strength}</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                        <div className={`strength-bar ${
                          strength === "weak" ? "strength-weak" :
                          strength === "medium" ? "strength-medium" : "strength-strong"
                        }`} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                    Confirm Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="w-5 h-5 text-slate-400 absolute left-4" />
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      disabled={isLoading}
                      required
                      className="w-full pl-12 pr-12 py-3.5 bg-slate-800/60 border border-slate-700/80 rounded-2xl text-white text-sm focus:outline-none focus:border-brand-purple focus:bg-slate-800 transition-all shadow-sm placeholder:text-slate-500 font-medium focus-glow disabled:opacity-60"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 p-1 text-slate-400 hover:text-slate-200 focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-blue via-brand-purple to-brand-green text-white font-bold text-center hover:shadow-lg hover:shadow-brand-purple/25 hover:-translate-y-0.5 transition-all cursor-pointer btn-premium disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 text-sm"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Resetting password...
                    </>
                  ) : (
                    "RESET PASSWORD"
                  )}
                </button>
              </form>
            )}

            {!token && (
              <Link
                to="/login"
                className="w-full py-3.5 mt-2 rounded-2xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white font-bold text-center transition-colors flex items-center justify-center gap-2"
              >
                Go to Login Page
              </Link>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-4 animate-fade-in w-full">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="font-heading font-extrabold text-2xl text-slate-100">
              Reset Successful!
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Your password has been successfully updated. You can now log in using your new credentials.
            </p>
            <Link
              to="/login"
              className="w-full py-3.5 mt-4 rounded-2xl bg-gradient-to-r from-brand-blue to-brand-purple text-white font-bold text-center hover:shadow-lg hover:shadow-brand-purple/25 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 btn-premium"
            >
              Proceed to Login
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
