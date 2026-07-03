import mongoose, { Schema, model } from 'mongoose';
const TimetableSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    day_of_week: { type: Number, required: true, min: 0, max: 6 },
    class_number: { type: Number, required: true }
}, { timestamps: true });


TimetableSchema.index({ user: 1, day_of_week: 1 })

TimetableSchema.index({user:1,day_of_week:1,class_number:1},{unique:true})

export const Timetable = mongoose.models.Timetable || model('Timetable', TimetableSchema);