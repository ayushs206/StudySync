import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, BookOpen, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { api } from "../api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("idle"); // 'idle' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = (val) => {
    return /^\S+@\S+\.\S+$/.test(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setStatus("idle");

    if (!email) {
      setErrorMessage("Please enter your email address.");
      setStatus("error");
      return;
    }
    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setIsLoading(true);

    try {
      await api.forgotPassword(email.trim().toLowerCase());
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err.message || "Failed to send password reset email. Please try again.");
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
                Forgot Password?
              </h2>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Enter your email address below, and we'll send you a secure link to reset your password.
              </p>
            </div>

            {/* Error Alert */}
            {status === "error" && errorMessage && (
              <div className="p-4 bg-rose-950/40 border border-rose-900 text-rose-300 rounded-2xl text-xs flex items-center gap-2 animate-fade-in font-semibold">
                <AlertTriangle className="w-4.5 h-4.5 text-rose-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-blue via-brand-purple to-brand-green text-white font-bold text-center hover:shadow-lg hover:shadow-brand-purple/25 hover:-translate-y-0.5 transition-all cursor-pointer btn-premium disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 text-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending reset link...
                  </>
                ) : (
                  "SEND RESET LINK"
                )}
              </button>
            </form>

            <div className="text-center mt-2">
              <Link 
                to="/login" 
                className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 text-sm font-semibold transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Login
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-4 animate-fade-in w-full">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="font-heading font-extrabold text-2xl text-slate-100">
              Reset Link Sent!
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              We have sent a password reset link to <span className="font-bold text-brand-purple">{email}</span>. Please check your inbox and spam folders.
            </p>
            <Link
              to="/login"
              className="w-full py-3.5 mt-4 rounded-2xl bg-gradient-to-r from-brand-blue to-brand-purple text-white font-bold text-center hover:shadow-lg hover:shadow-brand-purple/25 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 btn-premium"
            >
              Back to Login Page
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
