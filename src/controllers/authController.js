import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../config/mail.config.js";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};


// REGISTRO DE USUARIO
export const register = async (req, res) => {
    try {
        console.log("✅ Petición recibida:", req.body);

        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        const existingUser = await User.findOne({ email }); //Verificacion de usuario, si existe o no
        if (existingUser) {
            return res.status(400).json({ message: "El usuario ya está registrado" });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Encriptar contraseña
        
        const newUser = new User({ username, email, password: hashedPassword }); // Crear nuevo usuario

        await newUser.save(); // Guardar nuevo usuario

        const token = generateToken(newUser._id); // Generar token de verificación

        await sendVerificationEmail(email, token); // Enviar correo de verificación

        console.log("Usuario registrado con éxito y email enviado:", newUser);
        res.status(201).json({ message: "Usuario registrado exitosamente. Verifica tu email." });

    } catch (error) {
        console.error("Error en registerUser:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

//VERIFICACION DE MAIL
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params; //obtiene token de la url

        const decoded = jwt.verify(token, process.env.JWT_SECRET); //verifica token

        const user = await User.findById(decoded.id);  //busca usuario

        if (!user) {
            return res.status(400).send("<h1>Usuario no encontrado</h1>"); 
        }

        if (user.verified) {
            return res.send("<h1>Tu cuenta ya está verificada</h1>");
        }

        user.verified = true; //Cambia el estado de verificado
        await user.save(); //Guarda los cambios

        res.send("<h1>Cuenta verificada con éxito, ya puedes iniciar sesión</h1>");
    } catch (error) {
        console.error("Error verificando email:", error);
        res.status(400).send("<h1>Token inválido o expirado</h1>");
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }); //Busca por email
        if (!user) return res.status(401).json({ message: "Usuario no encontrado" });

        if (!user.verified) return res.status(401).json({ message: "Debes verificar tu correo electrónico" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Contraseña incorrecta" });

        const token = generateToken(user._id); //Me muestra el token de usuario en la consola
        console.log("Token generado por backend:", token);

        res.json({
            _id: user.id,
            name: user.username,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};


export const getUserProfile = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Extraer el token
        console.log("Token recibido en backend:", token); 

        if (!token) return res.status(401).json({ message: "No autorizado" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token decodificado:", decoded); 

        const user = await User.findById(decoded.id).select("-password");
        console.log("Usuario autenticado:", user);

        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        res.json({ user });
    } catch (error) {
        console.error("Error en getProfile:", error);
        res.status(401).json({ message: "Token inválido o expirado" });
    }
};

