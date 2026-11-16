import { pool } from "../config/database.js";

export const listarVeiculos = async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT v.id, v.marca, v.modelo, v.placa, v.ano, v.cor,
                   p.id AS "proprietarioId", p.nome AS "proprietarioNome"
            FROM veiculos v
            INNER JOIN proprietarios p ON p.id = v."proprietarioId"
            ORDER BY v.modelo
        `);

        return res.json(resultado.rows);
    } catch (erro) {
        return res.status(500).json({ mensagem: "Erro ao listar veículos." });
    }
};

export const criarVeiculo = async (req, res) => {
    try {
        const { marca, modelo, placa, ano, cor, proprietarioId } = req.body;

        if (!marca || !modelo || typeof placa !== "string" || !proprietarioId) {
            return res.status(400).json({ mensagem: "Informe marca, modelo, placa e proprietário." });
        }

        const placaLimpa = placa.toUpperCase().replace(/[-\s]/g, "");
        if (!/^[A-Z]{3}(\d{4}|\d[A-Z]\d{2})$/.test(placaLimpa)) {
            return res.status(400).json({ mensagem: "Placa inválida. Exemplo: ABC1D23." });
        }

        const resultado = await pool.query(
            `INSERT INTO veiculos (marca, modelo, placa, ano, cor, "proprietarioId")
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [marca, modelo, placaLimpa, ano || null, cor, proprietarioId]
        );

        return res.status(201).json(resultado.rows[0]);
    } catch (erro) {
        return res.status(400).json({ mensagem: "Não foi possível cadastrar. Confira o proprietário e se a placa já existe." });
    }
};
