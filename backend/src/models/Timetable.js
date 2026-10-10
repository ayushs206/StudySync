import mongoose from 'mongoose';
const TimetableSchema = new mongoose.Schema({
    batch:{
        type: String,
        required: true

    },
    version:{
        type:Number,
        required:true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
}, { timestamps: true });
TimetableSchema.index({ batch: 1, version: 1 ,user:1}, { unique: true });
export const Timetable = mongoose.model('Timetable', TimetableSchema);
