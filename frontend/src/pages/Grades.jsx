import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { 
  Award, 
  TrendingUp, 
  CheckCircle, 
  Calculator, 
  Sparkles, 
  BarChart2, 
  ChevronRight,
  Plus
} from "lucide-react";

export default function Grades() {
  const [courses, setCourses] = useState([
    {
      id: 1,
      code: "CS 101",
      name: "Intro to Computer Programming",
      grade: "A",
      gpa: 4.0,
      percentage: 94.5,
      credits: 4,
      assignments: [
        { name: "Assignment 1: Python Loops", score: "98/100", weight: "10%" },
        { name: "Midterm Exam", score: "92/100", weight: "30%" },
        { name: "Assignment 2: OOP Principles", score: "95/100", weight: "15%" },
        { name: "Final Project Code", score: "95/100", weight: "45%" }
      ]
    },
    {
      id: 2,
      code: "ME 201",
      name: "Robotics & Kinematics Lab",
      grade: "A-",
      gpa: 3.7,
      percentage: 89.2,
      credits: 3,
      assignments: [
        { name: "Lab Report 1: Actuators", score: "88/100", weight: "20%" },
        { name: "Robot CAD Assembly", score: "92/100", weight: "30%" },
        { name: "I2C Communication Demo", score: "87/100", weight: "50%" }
      ]
    },
    {
      id: 3,
      code: "MA 102",
      name: "Calculus & Analysis II",
      grade: "B+",
      gpa: 3.3,
      percentage: 86.8,
      credits: 4,
      assignments: [
        { name: "Quiz 1: Derivatives", score: "85/100", weight: "15%" },
        { name: "Quiz 2: Integration", score: "84/100", weight: "15%" },
        { name: "Midterm Examination", score: "89/100", weight: "35%" },
        { name: "Problem Set 4", score: "88/100", weight: "35%" }
      ]
    },
    {
      id: 4,
      code: "PH 105",
      name: "Applied Physics",
      grade: "A",
      gpa: 4.0,
      percentage: 96.0,
      credits: 3,
      assignments: [
        { name: "Thermodynamics Lab", score: "97/100", weight: "25%" },
        { name: "Entropy Midterm", score: "95/100", weight: "35%" },
        { name: "Physics Seminar Presentation", score: "96/100", weight: "40%" }
      ]
    }
  ]);

  // Calculate Cumulative GPA
  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
  const totalPoints = courses.reduce((sum, c) => sum + (c.gpa * c.credits), 0);
  const cumulativeGPA = (totalPoints / totalCredits).toFixed(2);

  // Target GPA Predictor Calculator
  const [targetCreditHours, setTargetCreditHours] = useState(3);
  const [targetExpectedGrade, setTargetExpectedGrade] = useState("4.0");

  const predictedNewTotalPoints = totalPoints + (parseFloat(targetExpectedGrade) * parseFloat(targetCreditHours));
  const predictedNewTotalCredits = totalCredits + parseFloat(targetCreditHours);
  const predictedGPA = (predictedNewTotalPoints / predictedNewTotalCredits).toFixed(2);

  return (
    <DashboardLayout activeTab="grades">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-slate-100 tracking-tight flex items-center gap-3">
            <Award className="w-8 h-8 text-brand-purple" />
            ACADEMIC GRADES & PERFORMANCE
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
            Track overall GPA, course percentages, weighted assignment scores, and target GPA predictions
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Cumulative GPA Card */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 text-left flex items-center gap-5 hover:-translate-y-0.5 transition-all">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center text-white font-heading font-black text-2xl shadow-lg shadow-brand-purple/20 shrink-0">
            {cumulativeGPA}
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cumulative GPA</span>
            <h2 className="font-heading font-extrabold text-xl text-slate-100 mt-0.5">Top 5% Honor Roll</h2>
            <p className="text-xs text-emerald-400 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +0.12 from last semester
            </p>
          </div>
        </div>

        {/* Total Credits */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 text-left flex items-center gap-5 hover:-translate-y-0.5 transition-all">
          <div className="w-16 h-16 rounded-2xl bg-brand-green/20 text-emerald-400 flex items-center justify-center font-heading font-black text-2xl shrink-0">
            {totalCredits}
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Completed Credits</span>
            <h2 className="font-heading font-extrabold text-xl text-slate-100 mt-0.5">14 Credit Hours</h2>
            <p className="text-xs text-slate-400 font-medium mt-1">4 Active Enrolled Courses</p>
          </div>
        </div>

        {/* GPA Predictor Calculator */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 text-left hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Calculator className="w-3.5 h-3.5 text-brand-purple" />
              GPA Predictor Simulator
            </span>
            <span className="text-xs font-bold text-purple-400">Predicted: {predictedGPA}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">New Credits</label>
              <select 
                value={targetCreditHours}
                onChange={(e) => setTargetCreditHours(e.target.value)}
                className="w-full px-2 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 font-medium focus:outline-none"
              >
                <option value="1">1 Credit</option>
                <option value="2">2 Credits</option>
                <option value="3">3 Credits</option>
                <option value="4">4 Credits</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Target Grade</label>
              <select 
                value={targetExpectedGrade}
                onChange={(e) => setTargetExpectedGrade(e.target.value)}
                className="w-full px-2 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 font-medium focus:outline-none"
              >
                <option value="4.0">A (4.0)</option>
                <option value="3.7">A- (3.7)</option>
                <option value="3.3">B+ (3.3)</option>
                <option value="3.0">B (3.0)</option>
              </select>
            </div>
          </div>
        </div>

      </div>

      {/* Detailed Course Breakdown Table / Cards */}
      <div className="flex flex-col gap-6">
        <h2 className="font-heading font-extrabold text-xl text-slate-100 text-left flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-brand-blue" />
          Course Grade Breakdown
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="glass-card rounded-3xl p-6 border border-slate-800 text-left flex flex-col justify-between hover:-translate-y-0.5 transition-all">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold text-brand-blue bg-brand-blue/10 px-2.5 py-0.5 rounded-lg border border-brand-blue/20">
                      {course.code} • {course.credits} Credits
                    </span>
                    <h3 className="font-heading font-extrabold text-lg text-slate-100 mt-2">{course.name}</h3>
                  </div>

                  <div className="text-right">
                    <span className="font-heading font-black text-3xl text-purple-400">{course.grade}</span>
                    <span className="text-xs text-slate-400 block font-semibold">{course.percentage}%</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800 mb-6">
                  <div 
                    className="h-full bg-gradient-to-r from-brand-blue via-brand-purple to-brand-green rounded-full"
                    style={{ width: `${course.percentage}%` }}
                  />
                </div>

                {/* Assignment list */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Graded Work & Weights
                  </span>
                  {course.assignments.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2.5 bg-slate-900/60 border border-slate-800 rounded-xl text-xs">
                      <span className="font-medium text-slate-300 truncate max-w-[200px]">{item.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-500 font-semibold">{item.weight} weight</span>
                        <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                          {item.score}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold">Grade Point: {course.gpa} / 4.0</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Passing with Distinction
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
