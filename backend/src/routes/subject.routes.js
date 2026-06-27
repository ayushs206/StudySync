import {Router} from 'express';
import {storeSubject,getSubject,updateSubject,deleteSubject} from '../controllers/subject.js'
const router=Router();

router.post('/',storeSubject);
router.get('/',getSubject);
router.patch('/:id',updateSubject);
router.delete('/:id',deleteSubject);

export default router;
