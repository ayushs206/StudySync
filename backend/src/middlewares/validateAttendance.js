export function validateAttendance(req, res, next) {
    try{
    const { date, status, subjectCode, slotId } = req.body;
    if(!date){
        return res.status(400).json({ error: 'Date is required' });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({message: "Invalid date format. Use YYYY-MM-DD"});
    }
    if(!status){
        return res.status(400).json({ error: 'Status is required' });
    }
    if(status !== 'present' && status !== 'absent' && status !== 'cancelled'){
        return res.status(400).json({ error: 'Status must be either present, absent or cancelled' });
    }
    if(!subjectCode){
        return res.status(400).json({ error: 'Subject code is required' });
    }
    if(!slotId){
        return res.status(400).json({ error: 'Slot ID is required' });
    }
    next();
}catch(err){
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
}S
}

