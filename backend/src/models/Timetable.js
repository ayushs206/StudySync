import mongoose from 'mongoose';
const TimetableSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subject:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    day:{
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true
    },
    start_time: {
        type: String,
        required: true  
    },
    end_time: {
        type: String,
        required: true  
    }
    type:{
        type: String,
        enum: ['lecture', 'lab', 'tutorial'],
        required: true
    }
}, { timestamps: true });
TimetableSchema.index({ user: 1, subject: 1, day: 1, start_time: 1, end_time: 1 }, { unique: true });
export const Timetable = mongoose.model('Timetable', TimetableSchema);
