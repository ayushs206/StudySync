import { Attendance } from '../models/Attendance.js';
import { Subject } from '../models/Subject.js';
import { User } from '../models/User.js';
import {
    getAllBatches,
    getElectivesForBatch,
    getScheduleForDay,
    getWeeklySchedule,
    syncUserBatch,
    parseSubjectCode
} from '../services/timetable.service.js';

export async function getWeeklyTimetable(req, res) {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.batch) {
            return res.status(200).json({ batch: null, weeklySchedule: {} });
        }
        const weeklySchedule = getWeeklySchedule(user.batch, user.selectedElectives || {});
        return res.status(200).json({ batch: user.batch, weeklySchedule });
    } catch (err) {
        console.error('Error getting weekly timetable:', err);
        return res.status(500).json({ message: 'Error loading weekly timetable' });
    }
}

export async function getBatches(req, res) {
    try {
        const batches = getAllBatches();
        return res.status(200).json({ batches });
    } catch (err) {
        console.error('Error fetching batches:', err);
        return res.status(500).json({ message: 'Error fetching batches' });
    }
}

export async function getElectives(req, res) {
    try {
        const user = await User.findById(req.user.id);
        const batch = req.query.batch || user?.batch;
        if (!batch) {
            return res.status(200).json({ electives: [] });
        }
        const electives = getElectivesForBatch(batch);
        return res.status(200).json({ batch, electives });
    } catch (err) {
        console.error('Error fetching electives:', err);
        return res.status(500).json({ message: 'Error fetching electives' });
    }
}

export async function selectBatch(req, res) {
    try {
        const { batch, selectedElectives } = req.body;
        if (!batch) {
            return res.status(400).json({ message: 'Batch is required' });
        }

        const syncResult = await syncUserBatch(req.user.id, batch, selectedElectives || {});
        const updatedUser = await User.findById(req.user.id);

        return res.status(200).json({
            message: 'Batch updated successfully',
            user: updatedUser.toSafeObject(),
            subjectsCount: syncResult.subjectsCount
        });
    } catch (err) {
        console.error('Error selecting batch:', err);
        return res.status(500).json({ message: 'Error updating batch' });
    }
}

export async function getTimetable(req, res) {
    try {
        const { date } = req.params;
        const user = await User.findById(req.user.id);
        if (!user || !user.batch) {
            return res.status(200).json({
                date: date || new Date().toISOString().split('T')[0],
                batch: null,
                day: '',
                classes: []
            });
        }

        const targetDate = date ? new Date(date) : new Date();
        const day = targetDate.toLocaleDateString('en-US', { weekday: 'long' });
        const dateStr = date || targetDate.toISOString().split('T')[0];

        const rawSchedule = getScheduleForDay(user.batch, day, user.selectedElectives || {});

        // Fetch attendance records for this user and date
        const attendanceRecords = await Attendance.find({
            user: user._id,
            date: dateStr
        });

        const attendanceMap = new Map();
        for (const record of attendanceRecords) {
            attendanceMap.set(record.slotId, record.status);
        }

        const classes = rawSchedule.map(cls => ({
            ...cls,
            todayStatus: attendanceMap.get(cls.slotId) || null
        }));

        return res.status(200).json({
            date: dateStr,
            batch: user.batch,
            day,
            classes
        });
    } catch (err) {
        console.error('Error loading timetable:', err);
        return res.status(500).json({ message: 'Error loading timetable' });
    }
}

export async function markAttendance(req, res) {
    try {
        const userId = req.user.id;
        const { date, status, subjectCode, slotId } = req.body;

        if (!date || !slotId) {
            return res.status(400).json({ message: 'Date and slotId are required' });
        }

        if (!status) {
            // Unmark
            await Attendance.findOneAndDelete({
                user: userId,
                date,
                slotId
            });
            return res.status(200).json({ message: 'Attendance un-marked', status: null });
        }

        if (!['present', 'absent', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid attendance status' });
        }

        const attendance = await Attendance.findOneAndUpdate(
            { user: userId, date, slotId },
            {
                user: userId,
                date,
                status,
                subjectCode: (subjectCode || 'GENERAL').replace(/\s+/g, '').toUpperCase(),
                slotId
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        return res.status(200).json({
            message: 'Attendance recorded successfully',
            attendance
        });
    } catch (err) {
        console.error('Error marking attendance:', err);
        return res.status(500).json({ message: 'Error marking attendance' });
    }
}

export async function calculateAttendance(req, res) {
    try {
        const userId = req.user.id;
        const attendanceRecords = await Attendance.find({ user: userId });
        const userSubjects = await Subject.find({ user: userId });

        const statsByBase = {};

        // Prepopulate with user's enrolled clubbed subjects
        for (const sub of userSubjects) {
            const parsed = parseSubjectCode(sub.subject_code);
            const base = parsed.baseCode;
            statsByBase[base] = {
                id: sub._id,
                code: base,
                name: sub.subject_name,
                present: 0,
                absent: 0,
                cancelled: 0,
                conducted: 0,
                attendedPoints: 0,
                conductedPoints: 0,
                percentage: 100
            };
        }

        // Process attendance records using weightage:
        // L has 1 weightage, P has 0.5 weightage, T has 0.5 weightage
        for (const record of attendanceRecords) {
            const parsed = parseSubjectCode(record.subjectCode);
            const base = parsed.baseCode;
            const weight = parsed.weight;

            if (!statsByBase[base]) {
                statsByBase[base] = {
                    id: base,
                    code: base,
                    name: record.subjectCode,
                    present: 0,
                    absent: 0,
                    cancelled: 0,
                    conducted: 0,
                    attendedPoints: 0,
                    conductedPoints: 0,
                    percentage: 100
                };
            }

            if (record.status === 'present') {
                statsByBase[base].present++;
                statsByBase[base].attendedPoints += weight;
                statsByBase[base].conductedPoints += weight;
            } else if (record.status === 'absent') {
                statsByBase[base].absent++;
                statsByBase[base].conductedPoints += weight;
            } else if (record.status === 'cancelled') {
                statsByBase[base].cancelled++;
            }
        }

        let totalPresentSessions = 0;
        let totalAbsentSessions = 0;
        let totalCancelledSessions = 0;
        let totalAttendedPoints = 0;
        let totalConductedPoints = 0;

        for (const base of Object.keys(statsByBase)) {
            const sub = statsByBase[base];
            sub.conducted = sub.present + sub.absent;
            sub.percentage = sub.conductedPoints > 0 
                ? Math.round((sub.attendedPoints / sub.conductedPoints) * 100) 
                : 100;

            totalPresentSessions += sub.present;
            totalAbsentSessions += sub.absent;
            totalCancelledSessions += sub.cancelled;
            totalAttendedPoints += sub.attendedPoints;
            totalConductedPoints += sub.conductedPoints;
        }

        const totalConductedSessions = totalPresentSessions + totalAbsentSessions;
        const overallRate = totalConductedPoints > 0 
            ? Math.round((totalAttendedPoints / totalConductedPoints) * 100) 
            : 100;

        return res.status(200).json({
            subjects: Object.values(statsByBase),
            overall: {
                present: totalPresentSessions,
                absent: totalAbsentSessions,
                cancelled: totalCancelledSessions,
                conducted: totalConductedSessions,
                attendedPoints: totalAttendedPoints,
                conductedPoints: totalConductedPoints,
                rate: overallRate
            }
        });
    } catch (err) {
        console.error('Error calculating attendance:', err);
        return res.status(500).json({ message: 'Error calculating attendance' });
    }
}
