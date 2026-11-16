import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/database.js";

export const login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (typeof email !== "string" || typeof senha !== "string" || !email || !senha) {
            return res.status(400).json({ mensagem: "Informe e-mail e senha." });
        }

        const resultado = await pool.query(
            `SELECT id, nome, email, senha, perfil
             FROM usuarios WHERE email = $1`,
            [email.trim().toLowerCase()]
        );

        const usuario = resultado.rows[0];
        const senhaValida = usuario && await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            return res.status(401).json({ mensagem: "E-mail ou senha incorretos." });
        }

        const token = jwt.sign(
            { id: usuario.id, perfil: usuario.perfil },
            process.env.JWT_SECRET,
            { expiresIn: "30m" }
        );

        return res.json({
            token,
            usuario: { id: usuario.id, nome: usuario.nome, perfil: usuario.perfil }
        });
    } catch (erro) {
        return res.status(500).json({ mensagem: "Erro ao realizar login." });
    }
};
