import mongoose from 'mongoose';
import { Subject } from '../models/Subject.js';

export const storeSubject = async (req, res) => {
    try {
        const { subject_name, subject_code } = req.body;

        if (!subject_name || subject_name.trim() === '') {
            return res.status(400).json({ message: "Input subject name" });
        }
        if (!subject_code || subject_code.trim() === '') {
            return res.status(400).json({ message: "Input subject code" });
        }

        const subject = await Subject.create({
            user: req.user.id,
            subject_name: subject_name.toLowerCase().trim(),
            subject_code: subject_code.toLowerCase().trim()
        });

        res.status(201).json({ message: "Subject added successfully", subject });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "Subject already exists" });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find({ user: req.user.id }).sort({ createdAt: -1 });
        return res.status(200).json({ subjects });
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateSubject = async (req, res) => {
    try {
        const subjectId = req.params?.id;
        if (!subjectId || !mongoose.Types.ObjectId.isValid(subjectId)) {
            return res.status(400).json({ message: "Valid Subject id required" });
        }

        const updates = {};
        if (req.body.subject_code !== undefined) {
            if (req.body.subject_code.trim() === '') {
                return res.status(400).json({ message: "Subject code cannot be empty" });
            }
            updates.subject_code = req.body.subject_code.trim();
        }
        if (req.body.subject_name !== undefined) {
            if (req.body.subject_name.trim() === '') {
                return res.status(400).json({ message: "Subject name cannot be empty" });
            }
            updates.subject_name = req.body.subject_name.trim();
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No valid fields to update" });
        }

        const subject = await Subject.findOneAndUpdate(
            { _id: subjectId, user: req.user.id },
            { $set: updates },
            { new: true }
        );

        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        res.status(200).json({ message: 'Subject updated successfully', subject });
    } catch (error) {
        if (error.code === 11000) {
        const field = Object.keys(error.keyPattern || {})[0];
        const fieldMap = {
        subject_code: "Subject code already exists",
        subject_name: "Subject name already exists"
    };
    return res.status(409).json({ message: fieldMap[field] || "Subject already exists" });
}
    }
};

export const deleteSubject = async (req, res) => {
    try {
        const subjectId = req.params?.id;
        if (!subjectId || mongoose.Types.ObjectId.isValid(subjectId) === false) {
            return res.status(400).json({ message: "Enter valid subject id" });
        }

        const subject = await Subject.findOneAndDelete({ _id: subjectId, user: req.user.id });

        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        res.status(200).json({ message: "Subject deleted successfully" });
    } catch (error) {
        console.error('Error deleting subject:', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};