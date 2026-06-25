import mongoose from 'mongoose';
import {User} from '../models/User.js';
import {Subject} from '../models/Subject.js';

export const storeSubject = async(req,res)=>{
    try{
        
        const {subject_name,subject_code}=req.body;
        if(!subject_name||subject_name.trim()===''){
            return res.status(400).json({message:"Input subject name"});
        }
         if(!subject_code||subject_code.trim()===''){
            return res.status(400).json({message:"Input subject code"});
        }
        const user = await User.findById(req.user.id);
        if (!user){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const subject = await Subject.create({
            user: user._id,
            subject_name,
            subject_code
        });
        res.status(201).json({message:"Subject added successfully"});
    }catch(error){
        if (error.code===11000){
            return res.status(409).json({message:"Subject already exists"});
        }
        res.status(500).json({message:"Internal Server Error"});
    }
    };