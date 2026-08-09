import { Router } from 'express';
import { createNote, getNotes, getNoteById, updateNote, deleteNote } from '../controllers/note.controller.js';

const router = Router();

// All routes are protected by the verifyJWT middleware in app.js, so no need to add it here again.
router.post('/', createNote);
router.get('/', getNotes);
router.get('/:id', getNoteById);
router.patch('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;