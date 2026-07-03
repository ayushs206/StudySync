import mongoose,{ Schema,model } from 'mongoose';
const AttendanceSchema = new Schema({
    date: { type: Date, required: true },
    class_number: { type: Number, required: true },
    status: { type: String, enum: ['present', 'absent','cancelled'], required: true },
    subject:{type:Schema.Types.ObjectId, ref:'Subject', required:true},
    user: {type: Schema.Types.ObjectId, ref:'User', required:true} 
},{timestamps: true});


AttendanceSchema.index({ subject: 1, date: 1, class_number: 1 }, { unique: true });

export const Attendance = mongoose.models.Attendance||model('Attendance', AttendanceSchema);