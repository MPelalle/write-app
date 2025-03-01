import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import connectDB from "./src/config/db.js";

import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import path from "path";
const app = express();
dotenv.config();
connectDB();




app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*", credentials: true }));


app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);


app.get('/ping', (req, res) => {
    res.send('API funcionando');
});


app.get("/api/auth/register", (req, res) => {
    res.json({ message: "Registro funcionando!" });
});


if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
}


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor funcionando en: http://localhost:${PORT}`));
