import mongoose from 'mongoose';
import {User} from '../models/User.js';
import {Subject} from '../models/Subject.js';

export const storeSubject = async(req,res)=>{
    try{
        if (!req.body){
            return res.status(400).json({message: "Input the fields"});
        }        
        const {subject_name,subject_code}=req.body;
        if(!subject_name||subject_name.trim()===''){
            return res.status(400).json({message:"Input subject name"});
        }
         if(!subject_code||subject_code.trim()===''){
            return res.status(400).json({message:"Input subject code"});
        }
        const user = await User.findById(req.user.id);
        if (!user){
            return res.status(401).json({message:"Invalid credentials"});
        }
        const subject = await Subject.create({
            user: user._id,
            subject_name,
            subject_code
        });
        res.status(201).json({message:"Subject added successfully",subject});
    }catch(error){
        if (error.code===11000){
            return res.status(409).json({message:"Subject already exists"});
        }
        res.status(500).json({message:"Internal Server Error"});
    }
    };

    export const getSubject = async(req,res)=>{
        try{
            const user = await User.findById(req.user.id);
            if(!user){
                return res.status(401).json({message:"Invalid Credentials"});
            }
            const subjects = await Subject.find({ user: user._id }).sort({ createdAt: -1 });
            res.status(200).json({ subjects });
             } catch (error) {
                console.error('Error fetching subjects:', error);
                res.status(500).json({ message: 'Internal server error' });
        }

    };

    export const updateSubject=async(req,res)=>{
        try{
            const subjectId=req.params?.id;
            if (!subjectId || mongoose.Types.ObjectId.isValid(subjectId)===false) {
                        return res.status(400).json({ message: 'Subjet ID is required' });
                }
            if (!req.body){
                return res.status(400).json({message:"Fill the subject details"});
            }
            const{subject_code,subject_name}=req.body;
            if (!subject_code || subject_code.trim()===''){
                return res.status(400).json({message:"Fill the subject code"});
            }
            if (!subject_name || subject_name.trim()===''){
                return res.status(400).json({message:"Fill the subject name"});
            }
            const subject = await Subject.findOneAndUpdate(
                { _id:subjectId, user: req.user.id },
                { $set: { subject_name, subject_code } },
                { new: true }
            );
            if(!subject){
                return res.status(400).json({message:"Subject not found"});
            }
            res.status(200).json({ message: 'Subject updated successfully', subject });
        } catch (error) {
            console.error('Error updating subject:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
};

export const deleteSubject=async(req,res)=>{
    try{
        const user=await User.findById(req.user.id);
        const subject_id=req.params?.id;
        if(!user){
            return res.status(401).json({message:"Invalid credentials"});
        }
        if(!subject_id||mongoose.Types.ObjectId.isValid(subject_id)===false){
            return res.status(400).json({message:"subject_id required"});

        }
        const subject = await Subject.findOneAndDelete({ _id: subject_id, user: req.user.id });
        if(!subject){
            return res.status(400).json({message:"no such subject is there"});
        }
        res.status(200).json({message:"Subject deleted"})
    }catch(error){
        return res.status(500).json({message:"Internal server error"});
    }
}