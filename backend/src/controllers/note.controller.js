import mongoose from 'mongoose';

import { User } from '../models/User.js';
import { Note } from '../models/Note.js';

export const createNote = async (req, res) => {
    try {
        let { title, content } = req.body;
        if (!title || title.trim() === '') {
            return res.status(400).json({ message: 'Title is required' });
        }

        if (!content || content.trim() === '') {
            return res.status(400).json({ message: 'Content is required' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const note = await Note.create({
            user: user._id,
            title,
            content,
        });

        res.status(201).json({ message: 'Note created successfully', note });
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getNotes = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Invalid credentials' });
        }

        const notes = await Note.find({ user: user._id }).sort({ createdAt: -1 });
        res.status(200).json({ notes });
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getNoteById = async (req, res) => {
    try {
        const noteId = req.params?.id;
        if (!noteId || mongoose.Types.ObjectId.isValid(noteId) === false) {
            return res.status(400).json({ message: 'Note ID is required' });
        }

        const note = await Note.findOne({ _id: noteId, user: req.user.id });
        if (!note) {
            return res.status(404).json({ message: 'Invalid note id' });
        }

        res.status(200).json({ note });
    } catch (error) {
        console.error('Error fetching note:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteNote = async (req, res) => {
    try {
        const noteId = req.params?.id;
        if (!noteId || mongoose.Types.ObjectId.isValid(noteId) === false) {
            return res.status(400).json({ message: 'Note ID is required' });
        }
        const note = await Note.findOneAndDelete({ _id: noteId, user: req.user.id });
        if (!note) {
            return res.status(404).json({ message: 'Invalid note id' });
        }
        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const updateNote = async (req, res) => {
    try {
        const noteId = req.params?.id;
        if (!noteId || mongoose.Types.ObjectId.isValid(noteId) === false) {
            return res.status(400).json({ message: 'Note ID is required' });
        }

        if (!req.body) {
            return res.status(400).json({ message: 'Request body is empty' });
        }

        const { title, content } = req.body;
        if (!title || title.trim() === '') {
            return res.status(400).json({ message: 'Title is required' });
        }

        if (!content || content.trim() === '') {
            return res.status(400).json({ message: 'Content is required' });
        }

        const note = await Note.findOneAndUpdate(
            { _id: noteId, user: req.user.id },
            { $set: { title, content } },
            { new: true }
        );

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.status(200).json({ message: 'Note updated successfully', note });
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}