import timetable from "..middlewares/assets/timetable.json" with { type: "json" };
import {Attendance} from "../models/Attendance.js";
import { Timetable } from "../models/Timetable.js";

export function getTimetable(req, res) {
    try{
        const{date}=req.params;
        const batch=req.user.batch;
        if(!batch){
            return res.status(400).json({message:"Batch invalid"});
        }
        const day = new Date(date).toLocaleDateString("en-US", {
            weekday: "long"
        });
        const timetableForBatch = timetable[batch];
        if (!timetableForBatch) {
            return res.status(404).json({ message: "Timetable not found for the specified batch" });
        }
        const timetableForDay = timetableForBatch[day];
        if (!timetableForDay) {
            return res.status(404).json({ message: "No timetable found for the specified day" });
        }
        return res.status(200).json({ 
            date,
            batch,
            day,
            timetable: timetableForDay
         });
    }catch(err){
        console.error(err);
        return res.status(500).json({ message: "Error loading timetable" });
    }
}

export async function markAttendance(req, res) {
    try{
        const userId = req.user.id;
        const { date, status, subjectCode, slotId } = req.body;
        const attendance=await Attendance.findOneAndUpdate({
            user: userId,
            date: date,
            slotId: slotId
        },
        {
            user: userId,
            date: date,
            status: status,
            subjectCode: subjectCode,
            slotId: slotId
        },
       {
        new: true, // Return the updated document
        upsert: true,// Create a new document if it doesn't exist
        runValidators: true
       }
    );
    }catch(err){
        console.error(err);
        return res.status(500).json({ message: "Error marking attendance" });
    }
}

export async function calculateAttendance(req,res){
    try{
        const userId=req.user.id;
        const attendancerecords=await Attendance.find({user:userId});
        const subjects={};
        for(const record of attendancerecords){
            const subjectCode=record.subjectCode;
            if(!subjects[subjectCode]){
                subjects[subjectCode]={
                    totalClasses:0,
                    attendedClasses:0
                };
            }
            if(record.status==='present'){
                continue;
            }
            if(record.status==='absent'){
                subjects[subjectCode].totalClasses++;
            }
            if(record.status==='present'){
                subjects[subjectCode].attendedClasses++;
                subjects[subjectCode].totalClasses++;
            }
        }
        for(const subjectCode in subjects){
            const subject=subjects[subjectCode];
            subject.percentage=subject.totalClasses>0?(subject.attendedClasses/subject.totalClasses)*100:0;
        }
        return res.status(200).json({
            attendance:subjects
        });

    }catch(err){
        console.error(err);
        return res.status(500).json({ message: "Error calculating attendance" });
    }
}