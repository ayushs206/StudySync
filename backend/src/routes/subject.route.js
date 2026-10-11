import { Router } from 'express';
import {
    storeSubject,
    getSubjects,
    updateSubject,
    deleteSubject
} from '../controllers/subject.js';

const router = Router();

router.get('/', getSubjects);
router.post('/', storeSubject);
router.patch('/:id', updateSubject);
router.delete('/:id', deleteSubject);

export default router;
