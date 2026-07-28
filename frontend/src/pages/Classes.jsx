import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { 
  BookMarked, 
  Plus, 
  Clock, 
  User, 
  ExternalLink, 
  CheckCircle, 
  FileText, 
  Sparkles,
  Search,
  Trash2
} from "lucide-react";

export default function Classes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const [classList, setClassList] = useState([
    {
      id: 1,
      code: "CS 101",
      name: "Intro to Computer Programming",
      instructor: "Dr. Alan Turing",
      room: "Hall B / Online Zoom",
      schedule: "Mon, Wed • 09:00 AM",
      progress: 75,
      color: "from-blue-600 to-indigo-600",
      accent: "text-blue-400",
      bgAccent: "bg-blue-500/10",
      syllabus: ["Variables & Data Types", "Control Loops", "Object Oriented Design", "Data Structures"],
      link: "https://zoom.us/j/demo101"
    },
    {
      id: 2,
      code: "ME 201",
      name: "Robotics & Kinematics Laboratory",
      instructor: "Prof. Sarah Connor",
      room: "Engineering Lab 4",
      schedule: "Tue, Thu • 11:30 AM",
      progress: 60,
      color: "from-purple-600 to-pink-600",
      accent: "text-purple-400",
      bgAccent: "bg-purple-500/10",
      syllabus: ["Matrix Rotations", "Actuator Mechanics", "Microcontroller I2C", "CAD Arms"],
      link: "https://zoom.us/j/demo201"
    },
    {
      id: 3,
      code: "MA 102",
      name: "Calculus & Analysis II",
      instructor: "Dr. Gottfried Leibniz",
      room: "Math Auditorium 102",
      schedule: "Mon, Fri • 02:00 PM",
      progress: 45,
      color: "from-emerald-600 to-teal-600",
      accent: "text-emerald-400",
      bgAccent: "bg-emerald-500/10",
      syllabus: ["Integration by Parts", "Taylor Series", "Differential Equations", "Vector Calculus"],
      link: "https://zoom.us/j/demo102"
    },
    {
      id: 4,
      code: "PH 105",
      name: "Applied Physics & Thermodynamics",
      instructor: "Prof. Richard Feynman",
      room: "Science Center 304",
      schedule: "Wed, Fri • 10:00 AM",
      progress: 80,
      color: "from-amber-500 to-orange-600",
      accent: "text-amber-400",
      bgAccent: "bg-amber-500/10",
      syllabus: ["Laws of Thermodynamics", "Entropy & Heat Engines", "Quantum Mechanics Intro"],
      link: "https://zoom.us/j/demo105"
    }
  ]);

  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newInstructor, setNewInstructor] = useState("");
  const [newSchedule, setNewSchedule] = useState("");

  const handleAddClass = (e) => {
    e.preventDefault();
    if (!newCode || !newName) return;
    const newClass = {
      id: Date.now(),
      code: newCode,
      name: newName,
      instructor: newInstructor || "Staff Instructor",
      room: "Lecture Hall A",
      schedule: newSchedule || "Mon, Wed • 10:00 AM",
      progress: 10,
      color: "from-brand-blue to-brand-purple",
      accent: "text-purple-400",
      bgAccent: "bg-purple-500/10",
      syllabus: ["Course Introduction", "Midterm Prep", "Final Project"],
      link: "#"
    };
    setClassList([newClass, ...classList]);
    setNewCode("");
    setNewName("");
    setNewInstructor("");
    setNewSchedule("");
    setShowAddModal(false);
  };

  const handleDeleteClass = (id) => {
    setClassList(classList.filter(c => c.id !== id));
  };

  const filteredClasses = classList.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout activeTab="classes">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-slate-100 tracking-tight flex items-center gap-3">
            <BookMarked className="w-8 h-8 text-brand-purple" />
            MY ENROLLED CLASSES
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
            Manage active courses, view instructors, and track syllabus progress
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex items-center w-full sm:w-60 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 shadow-inner">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
            <input 
              type="text" 
              placeholder="Search classes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-7 pr-2 text-sm text-slate-200 bg-transparent focus:outline-none w-full placeholder:text-slate-500 font-medium"
            />
          </div>

          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-brand-blue to-brand-purple text-white font-bold text-xs rounded-2xl flex items-center gap-2 hover:shadow-lg hover:shadow-brand-purple/20 transition-all btn-premium cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Class
          </button>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredClasses.map((cls) => (
          <div key={cls.id} className="glass-card rounded-3xl p-6 border border-slate-800 text-left flex flex-col justify-between hover:-translate-y-1 transition-all group">
            <div>
              {/* Card Header */}
              <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r ${cls.color} shadow-md`}>
                    {cls.code}
                  </div>
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-brand-purple" />
                    {cls.schedule}
                  </span>
                </div>

                <button 
                  onClick={() => handleDeleteClass(cls.id)}
                  className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                  aria-label="Remove Class"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Course Title */}
              <h2 className="font-heading font-extrabold text-xl text-slate-100 mb-2 group-hover:text-purple-400 transition-colors">
                {cls.name}
              </h2>

              {/* Instructor & Location */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mb-6 font-medium">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-brand-blue" />
                  {cls.instructor}
                </span>
                <span className="text-slate-600">•</span>
                <span>{cls.room}</span>
              </div>

              {/* Syllabus Topics */}
              <div className="mb-6">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Syllabus Overview</span>
                <div className="flex flex-wrap gap-2">
                  {cls.syllabus.map((topic, i) => (
                    <span key={i} className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Progress & Zoom Link */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-400">Syllabus Completed</span>
                <span className="font-bold text-slate-100">{cls.progress}%</span>
              </div>

              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className={`h-full bg-gradient-to-r ${cls.color} rounded-full transition-all duration-1000`} 
                  style={{ width: `${cls.progress}%` }} 
                />
              </div>

              <div className="flex justify-between items-center mt-2">
               
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  Enrolled
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Class Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-left animate-entrance">
            <h3 className="font-heading font-extrabold text-xl text-slate-100 mb-4">Add New Course</h3>

            <form onSubmit={handleAddClass} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400">Course Code (e.g. CS 201)</label>
                <input 
                  type="text" 
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="CS 201"
                  required
                  className="px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-brand-purple font-medium"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400">Course Name</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Data Structures & Algorithms"
                  required
                  className="px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-brand-purple font-medium"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400">Instructor Name</label>
                <input 
                  type="text" 
                  value={newInstructor}
                  onChange={(e) => setNewInstructor(e.target.value)}
                  placeholder="Dr. Grace Hopper"
                  className="px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-brand-purple font-medium"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400">Schedule (Days & Time)</label>
                <input 
                  type="text" 
                  value={newSchedule}
                  onChange={(e) => setNewSchedule(e.target.value)}
                  placeholder="Tue, Thu • 01:00 PM"
                  className="px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-brand-purple font-medium"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:underline"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-brand-blue to-brand-purple text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Add Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
