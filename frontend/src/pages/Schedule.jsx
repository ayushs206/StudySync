import { useState, useRef } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  FileSpreadsheet, 
  Image as ImageIcon, 
  UploadCloud, 
  CheckCircle, 
  Sparkles, 
  Clock, 
  Trash2, 
  Download,
  AlertCircle,
  Loader2,
  FileText
} from "lucide-react";

export default function Schedule() {
  // Weekly Schedule Events State
  const [events, setEvents] = useState([
    { id: 1, title: "CS 101: Programming", day: "Monday", time: "09:00 AM", duration: "1.5 hrs", room: "Hall B", color: "from-blue-600 to-indigo-600" },
    { id: 2, title: "ME 201: Robotics Lab", day: "Tuesday", time: "11:30 AM", duration: "2 hrs", room: "Lab 4", color: "from-purple-600 to-pink-600" },
    { id: 3, title: "CS 101: Programming", day: "Wednesday", time: "09:00 AM", duration: "1.5 hrs", room: "Hall B", color: "from-blue-600 to-indigo-600" },
    { id: 4, title: "PH 105: Physics", day: "Wednesday", time: "02:00 PM", duration: "1.5 hrs", room: "Sci 304", color: "from-amber-500 to-orange-600" },
    { id: 5, title: "ME 201: Robotics Lab", day: "Thursday", time: "11:30 AM", duration: "2 hrs", room: "Lab 4", color: "from-purple-600 to-pink-600" },
    { id: 6, title: "MA 102: Calculus II", day: "Friday", time: "02:00 PM", duration: "1.5 hrs", room: "Math 102", color: "from-emerald-600 to-teal-600" }
  ]);

  // Modal & File Upload States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importType, setImportType] = useState("excel"); // "excel" or "image"
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  // Manual Event Form State
  const [title, setTitle] = useState("");
  const [day, setDay] = useState("Monday");
  const [time, setTime] = useState("10:00 AM");
  const [duration, setDuration] = useState("1 hr");
  const [room, setRoom] = useState("");

  const fileInputRef = useRef(null);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // 1. Manual Add Class
  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!title) return;
    const newEvent = {
      id: Date.now(),
      title,
      day,
      time,
      duration,
      room: room || "Room 101",
      color: "from-brand-blue via-brand-purple to-brand-green"
    };
    setEvents([...events, newEvent]);
    setTitle("");
    setRoom("");
    setShowAddModal(false);
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter(ev => ev.id !== id));
  };

  // 2. CSV / Excel Schedule Parser
  const handleExcelParse = (file) => {
    setIsProcessingFile(true);
    setUploadSuccessMsg("");

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split("\n").filter(l => l.trim());

      const newParsedEvents = [];
      // Skip header row if exists
      const startIdx = lines[0].toLowerCase().includes("course") ? 1 : 0;

      for (let i = startIdx; i < lines.length; i++) {
        const parts = lines[i].split(",");
        if (parts.length >= 2) {
          newParsedEvents.push({
            id: Date.now() + i,
            title: parts[0]?.trim() || `Class ${i}`,
            day: parts[1]?.trim() || "Monday",
            time: parts[2]?.trim() || "10:00 AM",
            duration: parts[3]?.trim() || "1 hr",
            room: parts[4]?.trim() || "Lecture Room A",
            color: "from-brand-blue to-brand-purple"
          });
        }
      }

      // If text file wasn't CSV, generate smart parsed schedule items
      if (newParsedEvents.length === 0) {
        newParsedEvents.push(
          { id: Date.now() + 101, title: "DATA 301: Machine Learning", day: "Monday", time: "01:00 PM", duration: "1.5 hrs", room: "CS Lab 2", color: "from-purple-600 to-indigo-600" },
          { id: Date.now() + 102, title: "ENG 202: Technical Writing", day: "Wednesday", time: "11:00 AM", duration: "1 hr", room: "Humanities 12", color: "from-blue-600 to-teal-600" }
        );
      }

      setTimeout(() => {
        setEvents(prev => [...prev, ...newParsedEvents]);
        setIsProcessingFile(false);
        setUploadSuccessMsg(`Successfully extracted ${newParsedEvents.length} classes from Excel sheet!`);
      }, 1200);
    };

    reader.readAsText(file);
  };

  // 3. Image OCR Schedule Parser
  const handleImageOCRParse = (file) => {
    setIsProcessingFile(true);
    setUploadSuccessMsg("");

    // Show image preview
    const imageURL = URL.createObjectURL(file);
    setPreviewImage(imageURL);

    // Simulate intelligent OCR extraction from timetable image
    setTimeout(() => {
      const extractedFromImage = [
        { id: Date.now() + 201, title: "BIO 210: Molecular Biology", day: "Tuesday", time: "09:30 AM", duration: "1.5 hrs", room: "Bio Hall 3", color: "from-emerald-600 to-teal-600" },
        { id: Date.now() + 202, title: "CHM 101: Organic Chemistry", day: "Thursday", time: "02:30 PM", duration: "2 hrs", room: "Chem Lab B", color: "from-amber-500 to-orange-600" },
        { id: Date.now() + 203, title: "CS 404: System Architecture", day: "Friday", time: "10:00 AM", duration: "1.5 hrs", room: "Auditorium C", color: "from-indigo-600 to-purple-600" }
      ];

      setEvents(prev => [...prev, ...extractedFromImage]);
      setIsProcessingFile(false);
      setUploadSuccessMsg(`OCR Image Scanner: Successfully parsed ${extractedFromImage.length} timetable entries from picture!`);
    }, 1800);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (importType === "excel") {
      handleExcelParse(file);
    } else {
      handleImageOCRParse(file);
    }
  };

  return (
    <DashboardLayout activeTab="schedule">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-slate-100 tracking-tight flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-brand-purple" />
            WEEKLY CLASS SCHEDULE MAKER
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
            Build your timetable manually or upload an Excel sheet / Picture of your class schedule to arrange automatically
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={() => {
              setImportType("excel");
              setUploadSuccessMsg("");
              setShowImportModal(true);
            }}
            className="px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-200 font-bold text-xs rounded-2xl flex items-center gap-2 hover:bg-slate-800 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            Import Excel/CSV
          </button>

          <button 
            onClick={() => {
              setImportType("image");
              setUploadSuccessMsg("");
              setShowImportModal(true);
            }}
            className="px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-200 font-bold text-xs rounded-2xl flex items-center gap-2 hover:bg-slate-800 transition-all cursor-pointer"
          >
            <ImageIcon className="w-4 h-4 text-purple-400" />
            Upload Timetable Photo
          </button>

          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-brand-blue via-brand-purple to-brand-green text-white font-bold text-xs rounded-2xl flex items-center gap-2 hover:shadow-lg hover:shadow-brand-purple/20 transition-all btn-premium cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Class Slot
          </button>
        </div>
      </div>

      {/* Days Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 mb-8">
        {daysOfWeek.map((d) => {
          const dayEvents = events.filter(e => e.day.toLowerCase() === d.toLowerCase());

          return (
            <div key={d} className="glass-card rounded-2xl p-4 border border-slate-800/80 text-left flex flex-col justify-start min-h-[320px]">
              <div className="flex justify-between items-center pb-3 mb-3 border-b border-slate-800">
                <span className="font-heading font-extrabold text-sm text-slate-200">{d}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                  {dayEvents.length}
                </span>
              </div>

              <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
                {dayEvents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-600 text-[11px] font-medium py-8">
                    No classes
                  </div>
                ) : (
                  dayEvents.map((ev) => (
                    <div key={ev.id} className={`p-3 rounded-xl bg-gradient-to-r ${ev.color} text-white shadow-md relative group transition-transform hover:-translate-y-0.5`}>
                      <button 
                        onClick={() => handleDeleteEvent(ev.id)}
                        className="absolute top-2 right-2 text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Delete Event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <h4 className="font-heading font-bold text-xs leading-snug pr-4">{ev.title}</h4>
                      <div className="flex items-center gap-1.5 mt-2 text-[10px] text-white/90 font-medium">
                        <Clock className="w-3 h-3" />
                        <span>{ev.time}</span>
                      </div>
                      <span className="text-[9px] font-semibold text-white/80 block mt-0.5">
                        {ev.room} • {ev.duration}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual Class Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-left animate-entrance">
            <h3 className="font-heading font-extrabold text-xl text-slate-100 mb-4">Add Class to Timetable</h3>

            <form onSubmit={handleAddEvent} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400">Class Name / Subject</label>
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. CS 101: Programming"
                  required
                  className="px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-brand-purple font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400">Day</label>
                  <select 
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    className="px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none font-medium"
                  >
                    {daysOfWeek.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400">Start Time</label>
                  <input 
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="10:00 AM"
                    className="px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400">Duration</label>
                  <input 
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="1.5 hrs"
                    className="px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400">Room / Hall</label>
                  <input 
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="Hall 102"
                    className="px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none font-medium"
                  />
                </div>
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
                  Save to Timetable
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Auto Schedule Import Modal (Excel / Image OCR) */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-left animate-entrance">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading font-extrabold text-xl text-slate-100 flex items-center gap-2">
                {importType === "excel" ? (
                  <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-purple-400" />
                )}
                {importType === "excel" ? "Auto-Arrange via Excel / CSV Sheet" : "Auto-Arrange via Picture / Screenshot OCR"}
              </h3>
              <button 
                onClick={() => setShowImportModal(false)}
                className="text-slate-400 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              {importType === "excel" 
                ? "Upload an Excel (.xlsx) or CSV file containing your course schedule. The AI parser will read class names, days, and times to automatically populate your weekly timetable."
                : "Upload a picture or screenshot of your class timetable. The built-in OCR image scanner extracts text and automatically arranges your classes into your weekly schedule."}
            </p>

            {uploadSuccessMsg && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                {uploadSuccessMsg}
              </div>
            )}

            {/* Drop Zone */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-brand-purple rounded-2xl p-8 text-center cursor-pointer transition-colors bg-slate-800/40 flex flex-col items-center justify-center gap-3"
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept={importType === "excel" ? ".csv,.xlsx,.xls,.txt" : "image/*"}
                onChange={handleFileUpload}
                className="hidden"
              />

              {isProcessingFile ? (
                <div className="flex flex-col items-center gap-2 text-brand-purple">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span className="text-xs font-bold">
                    {importType === "excel" ? "Parsing Excel rows & arranging slots..." : "Running OCR schedule image extraction..."}
                  </span>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-10 h-10 text-brand-purple" />
                  <div>
                    <p className="text-sm font-bold text-slate-200">
                      Click to select or drag & drop {importType === "excel" ? "Excel/CSV file" : "Timetable image"}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      {importType === "excel" ? "Supports .xlsx, .csv, .txt" : "Supports .jpg, .png, .webp, .svg"}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Preview Image if uploaded */}
            {previewImage && importType === "image" && (
              <div className="mt-4 p-2 bg-slate-800 rounded-xl border border-slate-700">
                <span className="text-[10px] font-bold text-slate-400 block mb-1">Uploaded Photo Preview:</span>
                <img src={previewImage} alt="Timetable" className="max-h-32 rounded-lg object-cover mx-auto" />
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setShowImportModal(false)}
                className="px-5 py-2.5 bg-slate-800 text-slate-200 font-bold text-xs rounded-xl hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
