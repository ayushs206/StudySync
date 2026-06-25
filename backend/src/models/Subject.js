import mongoose,{ Schema,model } from 'mongoose';

const SubjectSchema = new Schema({
    subject_code: { type: String, required: true, trim: true },
    subject_name: { type: String, required: true ,trim:true},
   
    user:{type:Schema.Types.ObjectId, ref:'User', required:true}
},{timestamps: true});

SubjectSchema.index({user:1,subject_code:1},{unique:true});

SubjectSchema.pre("save", function(next) {
    this.subject_code = this.subject_code
        .replace(/\s+/g, "")
        .toUpperCase();

    next();
});

export const Subject = mongoose.models.Subject||model('Subject', SubjectSchema);


