import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  Lightbulb, 
  ArrowRight, 
  Compass, 
  Cpu, 
  Menu, 
  X 
} from "lucide-react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [subject1, setSubject1] = useState("subject 1");
  const [subject2, setSubject2] = useState("subject 2");
  const [subject3, setSubject3] = useState("subject 3");
  const [subject4, setSubject4] = useState("subject 4");

  const [currentUser] = useState(() => {
    const session = localStorage.getItem("studysync_user");
    return session ? JSON.parse(session) : null;
  });

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Decorative Blob Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-brand-purple/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-brand-green/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 glass-card border-b border-white/40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue via-brand-purple to-brand-green p-0.5 shadow-md shadow-brand-blue/20">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-brand-purple group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <span className="font-heading font-bold text-2xl tracking-tight bg-gradient-to-r from-brand-blue via-brand-purple to-brand-green bg-clip-text text-transparent">
              StudySync
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#offerings" className="font-medium text-slate-600 hover:text-brand-blue transition-colors">Offerings</a>
            <a href="#why-studysync" className="font-medium text-slate-600 hover:text-brand-purple transition-colors">Why StudySync</a>
            <a href="#stories" className="font-medium text-slate-600 hover:text-brand-green transition-colors">Stories</a>
            <a href="#help" className="font-medium text-slate-600 hover:text-brand-blue transition-colors">Help</a>
          </nav>

          {/* Desktop Action Button */}
          <div className="hidden md:flex items-center gap-4">
            {currentUser ? (
              <Link 
                to="/dashboard" 
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-brand-blue to-brand-purple text-white font-medium hover:shadow-lg hover:shadow-brand-purple/25 hover:-translate-y-0.5 transition-all"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-6 py-2.5 rounded-full border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors shadow-sm"
                >
                  Login
                </Link>
                <Link 
                  to="/login" 
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-brand-blue to-brand-purple text-white font-medium hover:shadow-lg hover:shadow-brand-purple/25 hover:-translate-y-0.5 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-brand-purple focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-lg px-6 py-6 flex flex-col gap-4 animate-fade-in shadow-lg">
            <a 
              href="#offerings" 
              onClick={() => setMobileMenuOpen(false)}
              className="font-medium text-slate-700 py-2 border-b border-slate-50"
            >
              Offerings
            </a>
            <a 
              href="#why-studysync" 
              onClick={() => setMobileMenuOpen(false)}
              className="font-medium text-slate-700 py-2 border-b border-slate-50"
            >
              Why StudySync
            </a>
            <a 
              href="#stories" 
              onClick={() => setMobileMenuOpen(false)}
              className="font-medium text-slate-700 py-2 border-b border-slate-50"
            >
              Stories
            </a>
            <a 
              href="#help" 
              onClick={() => setMobileMenuOpen(false)}
              className="font-medium text-slate-700 py-2 border-b border-slate-50"
            >
              Help
            </a>
            <div className="flex flex-col gap-3 mt-4">
              {currentUser ? (
                <Link 
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple text-center font-medium text-white shadow-md shadow-brand-purple/10"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link 
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 rounded-xl border border-slate-200 text-center font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple text-center font-medium text-white shadow-md shadow-brand-purple/10"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:py-32 flex-1">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Copy */}
          <div className="lg:col-span-6 flex flex-col gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-sm font-semibold w-fit animate-pulse-subtle">
              <Compass className="w-4 h-4" />
              <span>Explore your academic horizon</span>
            </div>
            
            <h1 className="font-heading font-extrabold text-5xl md:text-6xl text-slate-900 leading-tight tracking-tight">
              Explore the knowledge you want to master. <br />
              <span className="bg-gradient-to-r from-brand-blue via-brand-purple to-brand-green bg-clip-text text-transparent">
                Put your mind to work.
              </span>
            </h1>
            
            <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
              StudySync connects your courses,tracks attendance, tasks, keeps reminders of upcoming events, and stores important notes. It includes everything a student wants in one productivity app.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
              <Link 
                to={currentUser ? "/dashboard" : "/login"} 
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-brand-blue via-brand-purple to-brand-green text-white font-semibold text-center hover:shadow-xl hover:shadow-brand-purple/25 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
              >
                {currentUser ? "Go to Dashboard" : "Start Learning Now"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a 
                href="#offerings" 
                className="w-full sm:w-auto px-8 py-4 rounded-full border border-slate-300 text-slate-700 font-semibold text-center hover:bg-slate-50 transition-colors"
              >
                Learn More
              </a>
            </div>

           
          </div>

          {/* Right Column: Creative SVG Illustration (Telescope / Constellations) */}
          <div className="lg:col-span-6 flex justify-center relative">
            <div className="w-full max-w-lg md:max-w-xl aspect-square relative animate-float-slow">
              {/* Decorative glows behind the SVG */}
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/20 via-brand-purple/20 to-brand-green/20 rounded-full blur-[80px]" />
              
              {/* Creative Stargazing / Learning Constellation SVG */}
              <svg viewBox="0 0 500 500" className="w-full h-full relative z-10 select-none">
                <defs>
                  {/* Gradients */}
                  <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#f5f3ff" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#ecfdf5" stopOpacity="0.4" />
                  </linearGradient>
                  
                  <linearGradient id="hillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0f172a" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0.02" />
                  </linearGradient>

                  <linearGradient id="blueGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                  
                  <linearGradient id="purpleGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#6d28d9" />
                  </linearGradient>

                  <linearGradient id="greenGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>
                </defs>

                {/* Sky circle backdrop */}
                <circle cx="250" cy="250" r="230" fill="url(#skyGrad)" stroke="rgba(255,255,255,0.8)" strokeWidth="4" />

                {/* Star constellation lines */}
                <path d="M 120,120 L 210,100 L 310,140 L 390,90 M 210,100 L 260,180 L 310,140" 
                      stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="4,4" fill="none" opacity="0.6" />
                <path d="M 100,240 L 160,200 L 260,180 L 350,260 L 410,210" 
                      stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,4" fill="none" opacity="0.6" />
                <path d="M 310,140 L 350,260" 
                      stroke="#10b981" strokeWidth="1.5" strokeDasharray="4,4" fill="none" opacity="0.6" />

                {/* Constellation Glow Stars */}
                <circle cx="120" cy="120" r="4" fill="#8b5cf6" className="animate-pulse" />
                <circle cx="210" cy="100" r="5" fill="#3b82f6" />
                <circle cx="310" cy="140" r="6" fill="#10b981" />
                <circle cx="390" cy="90" r="4" fill="#8b5cf6" />
                <circle cx="260" cy="180" r="5" fill="#8b5cf6" />
                <circle cx="100" cy="240" r="4" fill="#3b82f6" />
                <circle cx="160" cy="200" r="5" fill="#10b981" />
                <circle cx="350" cy="260" r="6" fill="#3b82f6" />
                <circle cx="410" cy="210" r="4" fill="#10b981" />

                {/* Interactive Node Badges (Atoms, Code brackets, graduation hat, books) */}
                
                {/* Node 1: Code (Blue) */}
                <g transform="translate(210, 100)" className="cursor-pointer hover:scale-125 transition-transform origin-center">
                  <circle cx="0" cy="0" r="22" fill="url(#blueGlow)" />
                  <path d="M -6,-4 L -10,0 L -6,4 M 6,-4 L 10,0 L 6,4 M -2,6 L 2,-6" stroke="white" strokeWidth="1.5" fill="none" />
                </g>

                {/* Node 2: Math/Book (Purple) */}
                <g transform="translate(310, 140)" className="cursor-pointer hover:scale-125 transition-transform origin-center">
                  <circle cx="0" cy="0" r="24" fill="url(#purpleGlow)" />
                  {/* Book Icon */}
                  <path d="M -8,-6 H 8 V 6 H -8 Z M -8,-2 H 8 M -8,2 H 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                </g>

                {/* Node 3: Science/Atom (Green) */}
                <g transform="translate(160, 200)" className="cursor-pointer hover:scale-125 transition-transform origin-center">
                  <circle cx="0" cy="0" r="22" fill="url(#greenGlow)" />
                  {/* Atom orbits */}
                  <ellipse rx="10" ry="4" transform="rotate(30)" stroke="white" strokeWidth="1" fill="none" opacity="0.8" />
                  <ellipse rx="10" ry="4" transform="rotate(-30)" stroke="white" strokeWidth="1" fill="none" opacity="0.8" />
                  <circle cx="0" cy="0" r="2.5" fill="white" />
                </g>

                {/* Node 4: Graduation Cap (Purple/Green Accent) */}
                <g transform="translate(350, 260)" className="cursor-pointer hover:scale-125 transition-transform origin-center">
                  <circle cx="0" cy="0" r="24" fill="url(#purpleGlow)" />
                  <path d="M -10,-4 L 0,-9 L 10,-4 L 0,1 Z" stroke="white" strokeWidth="1.5" fill="none" />
                  <path d="M -6,-2 V 5 C -6,7 6,7 6,5 V -2" stroke="white" strokeWidth="1.5" fill="none" />
                </g>

                {/* Crescent Moon */}
                <path d="M 370,120 A 20,20 0 0,0 400,150 A 25,25 0 0,1 370,120 Z" fill="#eab308" opacity="0.85" className="animate-pulse" />

                {/* Ground/Hills */}
                <path d="M 20,420 Q 250,380 480,420 L 480,480 L 20,480 Z" fill="url(#hillGrad)" />
                <path d="M 50,440 Q 250,400 450,440 L 450,480 L 50,480 Z" fill="url(#hillGrad)" opacity="0.7" />

                {/* Student Silhouette Looking through Telescope */}
                <g transform="translate(120, 310)">
                  {/* Sitting body */}
                  <path d="M 10,110 C 10,85 20,80 35,80 C 42,80 48,85 50,92 L 55,110 Z" fill="#1e293b" />
                  {/* Arm holding telescope */}
                  <path d="M 30,85 L 55,75 M 55,75 L 75,70" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
                  {/* Leg sitting */}
                  <path d="M 15,110 Q 40,110 50,110 Q 65,110 75,100" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
                  {/* Head */}
                  <circle cx="35" cy="65" r="9" fill="#1e293b" />
                  {/* Hat */}
                  <path d="M 23,60 Q 35,52 47,60 L 42,56 H 28 Z" fill="#1e293b" />
                  {/* Telescope */}
                  <g transform="translate(35, 65) rotate(-22)">
                    <path d="M 5,0 L 55,-2 L 55,4 L 5,2 Z" fill="#475569" />
                    <rect x="0" y="-2" width="5" height="6" rx="1" fill="#f8fafc" />
                    <rect x="52" y="-4" width="4" height="8" rx="1" fill="#f8fafc" />
                    {/* View beam */}
                    <polygon points="55,-1 200,-30 200,10 55,3" fill="url(#skyGrad)" opacity="0.4" />
                  </g>
                </g>

                {/* Floating learning sparkles */}
                <path d="M 80,170 L 83,173 L 80,176 L 77,173 Z" fill="#eab308" />
                <path d="M 430,300 L 434,304 L 430,308 L 426,304 Z" fill="#eab308" />
                <path d="M 280,60 L 282,62 L 280,64 L 278,62 Z" fill="#3b82f6" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* StudySync Advantage Section */}
      <section id="offerings" className="py-24 bg-white/40 border-y border-slate-200/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex flex-col items-center gap-4 mb-16">
            <span className="text-brand-purple font-semibold tracking-wider uppercase text-sm">Features Grid</span>
            <h2 className="font-heading font-extrabold text-4xl text-slate-900">
              The StudySync Advantage
            </h2>
            <p className="text-slate-600 max-w-xl">
              We sync your learning path with the tools needed to fast-track your future.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Academic Excellence */}
            <div className="glass-card p-8 rounded-3xl text-left hover:-translate-y-2 hover:shadow-xl hover:shadow-brand-blue/5 transition-all group duration-300">
              <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue mb-6 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-bold text-xl text-slate-900 mb-3">Academic Excellence</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Track your attendance, assignments, and notes in one place. StudySync helps you stay organized and focused on achieving your academic goals.
              </p>
              <Link to="/login" className="flex items-center gap-2 text-brand-blue font-semibold mt-6 text-sm hover:underline">
                Explore classes <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 2: Smart Collaboration */}
            <div className="glass-card p-8 rounded-3xl text-left hover:-translate-y-2 hover:shadow-xl hover:shadow-brand-purple/5 transition-all group duration-300">
              <div className="w-14 h-14 rounded-2xl bg-brand-purple/10 flex items-center justify-center text-brand-purple mb-6 group-hover:scale-110 transition-transform">
                <Cpu className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-bold text-xl text-slate-900 mb-3">Smart Organization</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Keep all your academic resources in one centralized location. StudySync streamlines your study process with intelligent categorization and easy access to important information.
              </p>
              <Link to="/login" className="flex items-center gap-2 text-brand-purple font-semibold mt-6 text-sm hover:underline">
                View technology <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

        
          
          </div>
        </div>
      </section>

      {/* Analysis and Constellation Section */}
      <section id="why-studysync" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Constellation SVG */}
          <div className="lg:col-span-6 flex justify-center order-2 lg:order-1">
            <div className="w-full max-w-lg aspect-square relative glass-card p-4 rounded-3xl shadow-lg border-white/50">
              {/* Interactive Constellation SVG representing connected learning dots */}
              <svg viewBox="0 0 400 400" className="w-full h-full">
                <defs>
                  <linearGradient id="connGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                  
                  <radialGradient id="glowRad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Glowing area behind connections */}
                <circle cx="280" cy="180" r="100" fill="url(#glowRad)" className="animate-pulse-subtle" />

                {/* Interactive constellation wires */}
                <path d="M 80,320 L 140,250 L 260,180 L 320,120 L 360,60" 
                      stroke="url(#connGrad)" strokeWidth="3" strokeLinecap="round" fill="none" />
                <path d="M 140,250 L 200,320 M 260,180 L 320,240 M 320,120 L 280,80" 
                      stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="3,3" strokeLinecap="round" fill="none" opacity="0.7" />

                {/* Nodes with glowing rings */}
                {/* Node 1: Career Peak (Top Right) */}
                <g transform="translate(360, 60)" className="cursor-pointer hover:scale-125 transition-transform origin-center">
                  <circle cx="0" cy="0" r="14" fill="#eab308" className="animate-pulse" />
                  <circle cx="0" cy="0" r="8" fill="white" />
                  <path d="M -3,-3 L 3,3 M 3,-3 L -3,3" stroke="#eab308" strokeWidth="2" />
                </g>

                {/* Node 2: Robotics / Specialization */}
                <g transform="translate(320, 120)" className="cursor-pointer hover:scale-125 transition-transform origin-center">
                  <circle cx="0" cy="0" r="18" fill="#8b5cf6" opacity="0.2" className="animate-ping" />
                  <circle cx="0" cy="0" r="12" fill="#8b5cf6" />
                  <circle cx="0" cy="0" r="4" fill="white" />
                </g>

                {/* Node 3: Coding / Core */}
                <g transform="translate(260, 180)" className="cursor-pointer hover:scale-125 transition-transform origin-center">
                  <circle cx="0" cy="0" r="16" fill="#3b82f6" opacity="0.3" className="animate-ping" />
                  <circle cx="0" cy="0" r="10" fill="#3b82f6" />
                  <circle cx="0" cy="0" r="3" fill="white" />
                </g>

                {/* Node 4: Math / Foundations */}
                <g transform="translate(140, 250)" className="cursor-pointer hover:scale-125 transition-transform origin-center">
                  <circle cx="0" cy="0" r="12" fill="#10b981" />
                  <circle cx="0" cy="0" r="4" fill="white" />
                </g>

                {/* Branch Nodes */}
                <circle cx="200" cy="320" r="7" fill="#8b5cf6" />
                <circle cx="320" cy="240" r="8" fill="#3b82f6" />
                <circle cx="280" cy="80" r="7" fill="#10b981" />
                <circle cx="80" cy="320" r="6" fill="#eab308" />

                {/* Node Labels */}
                <text x="70" y="340" fill="#64748b" fontSize="10" fontFamily="Outfit" fontWeight="bold">START</text>
                <text x="110" y="235" fill="#10b981" fontSize="11" fontFamily="Outfit" fontWeight="bold">{subject1}</text>
                <text x="220" y="165" fill="#3b82f6" fontSize="11" fontFamily="Outfit" fontWeight="bold">{subject2}</text>
                <text x="330" y="140" fill="#8b5cf6" fontSize="11" fontFamily="Outfit" fontWeight="bold">{subject3}</text>
                <text x="330" y="140" fill="#8b5cf6" fontSize="11" fontFamily="Outfit" fontWeight="bold">{subject4}</text>
                <text x="315" y="50" fill="#eab308" fontSize="12" fontFamily="Outfit" fontWeight="bold">FUTURE CAREER</text>

                {/* Silhouette reaching out */}
                <g transform="translate(50, 220)">
                  {/* Arm reaching upwards to Node Math */}
                  <path d="M 30,110 L 45,85 M 45,85 L 85,32" stroke="#1e293b" strokeWidth="5.5" strokeLinecap="round" />
                  {/* Body */}
                  <path d="M 10,150 C 10,120 18,105 32,105 C 42,105 48,120 50,150 Z" fill="#1e293b" />
                  {/* Head */}
                  <circle cx="32" cy="85" r="9.5" fill="#1e293b" />
                  {/* Pointing light ray */}
                  <polygon points="85,32 140,250 140,255 85,34" fill="url(#connGrad)" opacity="0.25" />
                  <circle cx="85" cy="32" r="5" fill="#facc15" className="animate-pulse" />
                </g>

                {/* Tiny flying particles */}
                <circle cx="100" cy="100" r="1.5" fill="#8b5cf6" className="animate-ping" />
                <circle cx="350" cy="200" r="2" fill="#3b82f6" />
                <circle cx="180" cy="80" r="1.5" fill="#10b981" />
              </svg>
            </div>
          </div>

          {/* Right Column: Copy */}
          <div className="lg:col-span-6 flex flex-col gap-6 text-left order-1 lg:order-2">
            <span className="text-brand-blue font-semibold tracking-wider uppercase text-sm">Analysis of your learning</span>
            <h2 className="font-heading font-extrabold text-4xl text-slate-900 leading-tight">
              Helping you connect the dots. <br />
            </h2>
            
            <blockquote className="border-l-4 border-brand-purple pl-4 italic text-slate-500 py-2">
              "We don't just organize tasks; we build the bridges connecting your study habits directly to your long-term ambitions."
            </blockquote>

            {/* Interactive Subject Customizer */}
            <div className="p-5 rounded-2xl bg-slate-100/50 border border-slate-200/50 flex flex-col gap-3 shadow-inner my-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Customize Your Learning Path Nodes:</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[10px] font-bold text-slate-400">Node 1</label>
                  <input 
                    type="text" 
                    value={subject1} 
                    onChange={(e) => setSubject1(e.target.value)} 
                    className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-green text-slate-700 font-medium"
                    placeholder="Math"
                  />
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[10px] font-bold text-slate-400">Node 2</label>
                  <input 
                    type="text" 
                    value={subject2} 
                    onChange={(e) => setSubject2(e.target.value)} 
                    className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-blue text-slate-700 font-medium"
                    placeholder="Computer Science"
                  />
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[10px] font-bold text-slate-400">Node 3</label>
                  <input 
                    type="text" 
                    value={subject3} 
                    onChange={(e) => setSubject3(e.target.value)} 
                    className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-purple text-slate-700 font-medium"
                    placeholder="Robotics"
                  />
                </div>
              </div>
            </div>

            <div>
              <Link 
                to="/login"
                className="inline-flex items-center gap-2 text-brand-purple font-bold hover:gap-3 transition-all"
              >
                Learn how it works <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <footer id="help" className="bg-slate-900 text-slate-400 py-16 relative overflow-hidden mt-auto">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-purple/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-blue/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10 text-left">
          <div className="flex flex-col gap-4">
            <span className="font-heading font-bold text-2xl text-white tracking-tight">StudySync</span>
       
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4 font-heading">Features</h4>
            <ul className="flex flex-col gap-3.5 text-sm">
              <li><Link to="/login" className="hover:text-white transition-colors">Track Attendance</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Store notes</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Time Management by Event Organiser</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">To do list </Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 font-heading">Company</h4>
            <ul className="flex flex-col gap-3.5 text-sm">
              <li><a href="#why-studysync" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#offerings" className="hover:text-white transition-colors">Offerings</a></li>
              <li><a href="#help" className="hover:text-white transition-colors">Help Center</a></li>
            </ul>
          </div>

        
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 StudySync Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}