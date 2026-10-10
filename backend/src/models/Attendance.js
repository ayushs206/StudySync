import mongoose,{ Schema,model } from 'mongoose';
const AttendanceSchema = new Schema({
  user:        { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date:        { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
  slotId:      { type: String, required: true },
  subjectCode: { type: String, required: true },
  status:      { type: String, required: true, enum: ['present', 'absent', 'cancelled'] },
}, { timestamps: true });

AttendanceSchema.index({ user: 1, date: 1, slotId: 1 }, { unique: true });  // identity of a mark
AttendanceSchema.index({ user: 1, subjectCode: 1 });                         // per-subject stats
export const Attendance = mongoose.models.Attendance||model('Attendance', AttendanceSchema);