import mongoose from 'mongoose';
import {User} from '../models/User.js'
import {Attendance} from '../models/Attendance.js'
import { Subject} from '../models/Subject.js';
import { Timetable } from '../models/Timetable.js';

export const markAttendance=async(req,res)=>{
    try{
        const subjectId = req.params?.subjectId;
        if (!subjectId || mongoose.Types.ObjectId.isValid(subjectId) === false) {
            return res.status(400).json({ message: "Valid subject id is required" });
        }

        const { status, date, class_number } = req.body;
        if (!status || !['present','absent','cancelled'].includes(status)){
            return res.status(400).json({ message: "Mark status of attendence" });
        }
        if (class_number === undefined || !Number.isInteger(Number(class_number))) {
            return res.status(400).json({ message: "class_number is required" });
        }
        const subject=await Subject.findOne({_id:subjectId,user:req.user.id});
        if(!subject){
            return res.status(404).json({message:"Subject not found"});

        }
        const targetDate= date? new Date(date):new Date();
         if (isNaN(targetDate.getTime())) {
            return res.status(400).json({ message: "Invalid date" });
        }
        targetDate.setUTCHours(0, 0, 0, 0);
        const attendance=await Attendance.findOneAndUpdate(
            {subject:subject._id,date:targetDate,class_number:Number(class_number)},
            {$set:{status},$setOnInsert:{user: req.user.id}},
            {new:true,upsert:true,runValidators:true}

        )
         res.status(200).json({ message: "Attendance marked", attendance });
    }catch(error){
        if(error.code===11000){
            return res.status(409).json({ message: "This class is already being updated, try again" });
        }
        return res.status(500).json({message:"Internal server error"});
    }

};
export const getTodaySchedule = async (req, res) => {
    try {
        const dateParam = req.query.date;
        if (!dateParam) {
        return res.status(400).json({ message: "Date query parameter (YYYY-MM-DD) is required" });
        }
        let targetDate = new Date(dateParam + 'T00:00:00.000Z');
        if (isNaN(targetDate.getTime())) {
            return res.status(400).json({ message: "Invalid date" });
        }
        const dayOfWeek=targetDate.getUTCDay();
        const scheduled=await Timetable.find({user:req.user.id,day_of_week:dayOfWeek})
                .populate('subject','subject_name subject_code')
                .sort({class_number:1});
        
        const marked = await Attendance.find({ user: req.user.id, date: targetDate })
            .populate('subject', 'subject_name subject_code');

        const markedMap=new Map(
            marked.filter(a=>a.subject).map(a=>[`${a.subject._id}-${a.class_number}`,a])
        );
        const schedule=scheduled
            .filter(entry =>entry.subject)
            .map(entry => {
                const existing =markedMap.get(`${entry.subject._id}-${entry.class_number}`);
                return{
                    subject_id: entry.subject._id,
                    subject_name: entry.subject.subject_name,
                    subject_code: entry.subject.subject_code,
                    class_number: entry.class_number,
                    status: existing ? existing.status : null,
                    attendance_id: existing ? existing._id : null
                };
            });
        const scheduledKeys = new Set(scheduled.filter(e=>e.subject).map(e=>`${e.subject._id}-${e.class_number}`));
        const extras = marked.filter(a=>a.subject && !scheduledKeys.has(`${a.subject._id}-${a.class_number}`))
                .map(a => ({
                subject_id: a.subject._id,
                subject_name: a.subject.subject_name,
                subject_code: a.subject.subject_code,
                class_number: a.class_number,
                status: a.status,
                attendance_id: a._id,
                extra: true
            }));
            res.status(200).json({ date: targetDate, day_of_week: dayOfWeek, scheduled: schedule, extras });
    }catch(error){
        return res.status(500).json({message:"Internal server error"});
    }
}