import {Router} from 'express';
import{getTimetable, markAttendance, calculateAttendance} from '../controllers/attendance.controller.js';
import { validateAttendance } from '../middlewares/validateAttendance.js';
const router=Router();

router.get('/attendance/timetable/:date',getTimetable);
router.post('/attendance',
    validateAttendance,
    markAttendance);
router.get('/attendance/:date',calculateAttendance);
export default router;