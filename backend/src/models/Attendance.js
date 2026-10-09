import mongoose,{ Schema,model } from 'mongoose';
const AttendanceSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    status: { 
        type: String,
         enum: ['present', 'absent','cancelled'], 
         required: true },
    subject:{type:Schema.Types.ObjectId, ref:'Subject', required:true},
    class_number:{type:Number, required:true},
    type:{type:String, enum:['lecture', 'lab', 'tutorial'], required:true},
    weight:{type:Number, required:true}

},{timestamps: true});

AttendanceSchema.pre("save", function (next) {
    if (this.date){
    this.date.setHours(0, 0, 0, 0);}
    next();
});

AttendanceSchema.index(
    { subject: 1, date: 1 },
    { unique: true }
);

export const Attendance = mongoose.models.Attendance||model('Attendance', AttendanceSchema);