import express from "express";
import Note from "../models/notes.js";
import authMiddleware from "../middleware/authMiddleware.js"; 

const router = express.Router();


router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) return res.status(400).json({ message: "Todos los campos son obligatorios" });

        const newNote = new Note({ user: req.user.id, title, content });
        await newNote.save();
        res.status(201).json(newNote);
    } catch (error) {
        res.status(500).json({ message: "Error al crear la nota" });
    }
});

router.get("/", authMiddleware, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las notas" });
    }
});


router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { title, content } = req.body;
        const note = await Note.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { title, content },
            { new: true }
        );

        if (!note) return res.status(404).json({ message: "Nota no encontrada" });

        res.json(note);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la nota" });
    }
});


router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id });

        if (!note) return res.status(404).json({ message: "Nota no encontrada" });

        res.json({ message: "Nota eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la nota" });
    }
});

export default router;
