import { Router } from 'express';
import {
    getBatches,
    getElectives,
    selectBatch,
    getTimetable,
    getWeeklyTimetable,
    markAttendance,
    calculateAttendance
} from '../controllers/attendance.controller.js';
import { validateAttendance } from '../middlewares/validateAttendance.js';
import { verifyJWT } from '../middlewares/auth.js';

const router = Router();

// Public: allows unauthenticated visitors to get batch list during signup
router.get('/batches', getBatches);

// Protected routes requiring authentication
router.use(verifyJWT);
router.get('/weekly', getWeeklyTimetable);
router.get('/electives', getElectives);
router.post('/batch', selectBatch);
router.get('/timetable', getTimetable);
router.get('/timetable/:date', getTimetable);
router.post('/mark', validateAttendance, markAttendance);
router.post('/', validateAttendance, markAttendance);
router.get('/stats', calculateAttendance);

export default router;