import { pool } from "../config/database.js";

export const listarProprietarios = async (req, res) => {
    try {
        const busca = typeof req.query.busca === "string" ? req.query.busca : "";

        const resultado = await pool.query(
            `SELECT id, nome, email, telefone
             FROM proprietarios
             WHERE nome ILIKE $1 OR email ILIKE $1
             ORDER BY nome`,
            [`%${busca}%`]
        );

        return res.json(resultado.rows);
    } catch (erro) {
        return res.status(500).json({ mensagem: "Erro ao listar proprietários." });
    }
};

export const criarProprietario = async (req, res) => {
    try {
        const { nome, email, telefone, cpf } = req.body;

        if (!nome || !email || !telefone || typeof cpf !== "string") {
            return res.status(400).json({ mensagem: "Preencha todos os campos." });
        }

        const cpfLimpo = cpf.replace(/\D/g, "");
        if (cpfLimpo.length !== 11) {
            return res.status(400).json({ mensagem: "O CPF deve ter 11 números." });
        }

        const resultado = await pool.query(
            `INSERT INTO proprietarios (nome, email, telefone, cpf)
             VALUES ($1, $2, $3, $4)
             RETURNING id, nome, email, telefone`,
            [nome.trim(), email.trim().toLowerCase(), telefone, cpfLimpo]
        );

        return res.status(201).json(resultado.rows[0]);
    } catch (erro) {
        return res.status(400).json({ mensagem: "Não foi possível cadastrar. Verifique os dados e se o e-mail ou CPF já existe." });
    }
};
