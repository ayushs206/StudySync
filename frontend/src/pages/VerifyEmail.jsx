import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, Loader2, ArrowRight, BookOpen } from 'lucide-react';
import { api } from '../api';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('No verification token provided in URL.');
      return;
    }

    let isMounted = true;

    api.verifyEmail(token)
      .then((res) => {
        if (isMounted) {
          setStatus('success');
        }
      })
      .catch((err) => {
        if (isMounted) {
          // If the backend says "Email already verified", treat it as clean success!
          if (err.message && (err.message.toLowerCase().includes('already verified') || err.message.toLowerCase().includes('verified'))) {
            setStatus('success');
            return;
          }
          setStatus('error');
          setErrorMessage(err.message || 'Failed to verify email token.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

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

        {/* Status Views */}
        {status === 'verifying' && (
          <div className="flex flex-col items-center gap-4 py-6">
            <Loader2 className="w-12 h-12 text-brand-purple animate-spin" />
            <h2 className="font-heading font-bold text-xl text-slate-100">
              Verifying your email...
            </h2>
            <p className="text-sm text-slate-400">
              Please wait while we validate your token with the security server.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-4 py-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="font-heading font-extrabold text-2xl text-slate-100">
              Email Verified!
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Your StudySync account is now fully activated. You can log in and access your workspace.
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

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4 py-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <h2 className="font-heading font-extrabold text-2xl text-slate-100">
              Verification Failed
            </h2>
            <p className="text-sm text-rose-300 bg-rose-950/40 p-3 rounded-xl border border-rose-900/50 w-full font-medium">
              {errorMessage}
            </p>
            <p className="text-xs text-slate-400">
              Tokens expire after a short duration. You can request a new verification link after logging in or signing up.
            </p>
            <Link
              to="/login"
              className="w-full py-3 mt-2 rounded-2xl bg-slate-100 text-slate-900 font-bold text-center hover:bg-white transition-colors"
            >
              Go to Login Page
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
