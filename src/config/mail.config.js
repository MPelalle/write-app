import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, verificationToken) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail", 
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS, 
            },
        });

        const verificationUrl = `${process.env.API_URL}/api/auth/verify/${verificationToken}`;


        const mailOptions = {
            from: `"Escribe APP" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verifica tu cuenta",
            html: `<h1>Bienvenido!</h1>
                    <p>Haz clic en el enlace para verificar tu cuenta:</p>
                    <a href="${verificationUrl}">Verificar cuenta</a>
                    <p>Si no creaste esta cuenta, ignora este mensaje.</p>`,
        };

        await transporter.sendMail(mailOptions);
        console.log("Correo de verificación enviado a:", email);
    } catch (error) {
        console.error("Error enviando email:", error);
    }
};
