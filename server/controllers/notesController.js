import mongoose from "mongoose";
import Note from "../models/Note.js";

export async function getAllNotes(_, res) {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    console.error("getAllNotes:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function getNoteById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Note not found." });
    }
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: "Note not found." });
    res.json(note);
  } catch (error) {
    console.error("getNoteById:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function createNote(req, res) {
  try {
    const { title, content } = req.body;
    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ message: "Title and content are required." });
    }
    const note = new Note({ title: title.trim(), content: content.trim() });
    const saved = await note.save();
    res.status(201).json(saved);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.error("createNote:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function updateNote(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Note not found." });
    }
    const { title, content } = req.body;
    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ message: "Title and content are required." });
    }
    const updated = await Note.findByIdAndUpdate(
      id,
      { title: title.trim(), content: content.trim() },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Note not found." });
    res.status(200).json(updated);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.error("updateNote:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function deleteNote(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Note not found." });
    }
    const deleted = await Note.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Note not found." });
    res.status(200).json({ message: "Note deleted", id: deleted._id });
  } catch (error) {
    console.error("deleteNote:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
}
