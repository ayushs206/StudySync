import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Subject } from '../models/Subject.js';
import { Attendance } from '../models/Attendance.js';
import { User } from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const timetablePath = path.join(__dirname, '../middlewares/assets/timetable.json');

let cachedTimetable = null;

function loadTimetable() {
    if (!cachedTimetable) {
        const fileData = fs.readFileSync(timetablePath, 'utf8');
        cachedTimetable = JSON.parse(fileData);
    }
    return cachedTimetable;
}

export function getAllBatches() {
    const data = loadTimetable();
    return Object.keys(data).sort();
}

export function getBatchTimetable(batch) {
    if (!batch) return null;
    const data = loadTimetable();
    return data[batch] || null;
}

export function getElectivesForBatch(batch) {
    const batchData = getBatchTimetable(batch);
    if (!batchData) return [];

    const electives = [];
    for (const [day, slots] of Object.entries(batchData)) {
        for (const [time, slot] of Object.entries(slots)) {
            const isElective = slot[3] === 'Elective' || (Array.isArray(slot[5]) && slot[5].length > 0);
            if (isElective && Array.isArray(slot[5]) && slot[5].length > 0) {
                electives.push({
                    day,
                    time,
                    slotKey: `${day}_${time}`,
                    options: slot[5].map(opt => ({
                        subject_code: opt.subject_code,
                        subject_name: opt.subject_name,
                        type: opt.type,
                        place: opt.place
                    }))
                });
            }
        }
    }
    return electives;
}

export function parseSubjectCode(rawCode) {
    if (!rawCode) return { baseCode: 'UNKNOWN', rawCode: '', typeChar: null, weight: 1.0, type: 'Lecture' };
    const clean = String(rawCode).replace(/\s+/g, '').toUpperCase();
    const lastChar = clean.slice(-1);

    if (lastChar === 'L') {
        return {
            baseCode: clean.slice(0, -1),
            rawCode: clean,
            typeChar: 'L',
            type: 'Lecture',
            weight: 1.0
        };
    }
    if (lastChar === 'P') {
        return {
            baseCode: clean.slice(0, -1),
            rawCode: clean,
            typeChar: 'P',
            type: 'Practical',
            weight: 0.5
        };
    }
    if (lastChar === 'T') {
        return {
            baseCode: clean.slice(0, -1),
            rawCode: clean,
            typeChar: 'T',
            type: 'Tutorial',
            weight: 0.5
        };
    }
    return {
        baseCode: clean,
        rawCode: clean,
        typeChar: null,
        type: 'Lecture',
        weight: 1.0
    };
}

export function getSubjectsForBatch(batch, selectedElectives = {}) {
    const batchData = getBatchTimetable(batch);
    if (!batchData) return [];

    const subjectMap = new Map();

    const registerSubject = (rawCode, name, fallbackType = 'Lecture', place = '') => {
        if (!rawCode || !name) return;
        const parsed = parseSubjectCode(rawCode);
        const base = parsed.baseCode;
        const sessionType = parsed.typeChar ? parsed.type : fallbackType;

        if (!subjectMap.has(base)) {
            subjectMap.set(base, {
                subject_code: base,
                subject_name: name.trim(),
                types: new Set([sessionType]),
                raw_codes: new Set([parsed.rawCode]),
                place: place || ''
            });
        } else {
            const entry = subjectMap.get(base);
            entry.types.add(sessionType);
            entry.raw_codes.add(parsed.rawCode);
            if (!entry.place && place) entry.place = place;
        }
    };

    for (const [day, slots] of Object.entries(batchData)) {
        for (const [time, slot] of Object.entries(slots)) {
            const [code, place, name, type, , choices] = slot;
            const slotKey = `${day}_${time}`;

            if (type === 'Elective' || (choices && choices.length > 0)) {
                // If user selected an elective for this slot
                const selectedCode = selectedElectives[slotKey];
                if (selectedCode && Array.isArray(choices)) {
                    const picked = choices.find(c => c.subject_code === selectedCode);
                    if (picked) {
                        registerSubject(picked.subject_code, picked.subject_name, picked.type || 'Elective', picked.place || place);
                        continue;
                    }
                }
                // If not selected or choices exist, register choices
                if (Array.isArray(choices)) {
                    for (const c of choices) {
                        registerSubject(c.subject_code, c.subject_name, c.type || 'Elective', c.place);
                    }
                }
            } else if (code && name) {
                registerSubject(code, name, type || 'Lecture', place);
            }
        }
    }

    return Array.from(subjectMap.values()).map(s => ({
        subject_code: s.subject_code,
        subject_name: s.subject_name,
        type: Array.from(s.types).join(', '),
        types: Array.from(s.types),
        raw_codes: Array.from(s.raw_codes),
        place: s.place
    }));
}

export function getScheduleForDay(batch, dayName, selectedElectives = {}) {
    const batchData = getBatchTimetable(batch);
    if (!batchData || !batchData[dayName]) return [];

    const slots = batchData[dayName];
    const schedule = [];

    for (const [time, slot] of Object.entries(slots)) {
        const [code, place, name, type, , choices] = slot;
        const slotKey = `${dayName}_${time}`;
        const isElective = type === 'Elective' || (Array.isArray(choices) && choices.length > 0);

        let finalCode = code;
        let finalName = name;
        let finalPlace = place;
        let finalType = type;

        if (isElective && Array.isArray(choices) && choices.length > 0) {
            const userPick = selectedElectives[slotKey];
            const matchedChoice = choices.find(c => c.subject_code === userPick) || choices[0];
            finalCode = matchedChoice.subject_code;
            finalName = matchedChoice.subject_name;
            finalPlace = matchedChoice.place;
            finalType = matchedChoice.type || 'Elective';
        }

        const parsed = parseSubjectCode(finalCode);
        const slotId = `${dayName}_${time.replace(/\s+/g, '_')}_${finalCode ? finalCode.replace(/\s+/g, '') : 'UNKNOWN'}`;

        schedule.push({
            slotId,
            time,
            day: dayName,
            subject_code: finalCode,
            base_subject_code: parsed.baseCode,
            weight: parsed.weight,
            sessionType: parsed.typeChar ? parsed.type : finalType,
            subject_name: finalName,
            location: finalPlace,
            type: finalType,
            isElective,
            electiveOptions: isElective ? choices : []
        });
    }

    return schedule;
}

export function getWeeklySchedule(batch, selectedElectives = {}) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const result = {};
    for (const d of days) {
        result[d] = getScheduleForDay(batch, d, selectedElectives);
    }
    return result;
}

export async function syncUserBatch(userId, newBatch, selectedElectives = {}) {
    if (!newBatch) {
        // Clear all
        await Attendance.deleteMany({ user: userId });
        await Subject.deleteMany({ user: userId });
        await User.findByIdAndUpdate(userId, { batch: null, selectedElectives: {} });
        return { subjectsCount: 0 };
    }

    // 1. Remove previous attendance and subjects
    await Attendance.deleteMany({ user: userId });
    await Subject.deleteMany({ user: userId });

    // 2. Extract subjects for newly selected batch
    const batchSubjects = getSubjectsForBatch(newBatch, selectedElectives);

    // 3. Insert new subjects
    if (batchSubjects.length > 0) {
        const subjectDocs = batchSubjects.map(s => ({
            user: userId,
            subject_code: s.subject_code,
            subject_name: s.subject_name
        }));
        await Subject.insertMany(subjectDocs);
    }

    // 4. Update user record
    await User.findByIdAndUpdate(userId, {
        batch: newBatch,
        selectedElectives
    });

    return { subjectsCount: batchSubjects.length, subjects: batchSubjects };
}
