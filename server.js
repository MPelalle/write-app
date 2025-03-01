import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import path from "path";

import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import noteRoutes from "./src/routes/noteRoutes.js";

const app = express();
dotenv.config();
connectDB();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*", credentials: true }));

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.get("/ping", (req, res) => {
    res.send("API funcionando");
});

app.get("/api/auth/register", (req, res) => {
    res.json({ message: "Registro funcionando!" });
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor funcionando en: http://localhost:${PORT}`));
