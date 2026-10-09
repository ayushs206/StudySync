import timetable from "../data/timetable.json" with { type: "json" };
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
