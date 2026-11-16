import { readFile } from "node:fs/promises";
import { pool } from "../config/database.js";

const popularBanco = async () => {
    const conexao = await pool.connect();

    try {
        await conexao.query("BEGIN");
        const estrutura = await readFile(new URL("../../../database/schema.sql", import.meta.url), "utf8");
        const dados = await readFile(new URL("../../../database/seed.sql", import.meta.url), "utf8");
        await conexao.query(estrutura);
        await conexao.query(dados);
        await conexao.query("COMMIT");
        console.log("Banco preparado com os dados de exemplo.");
    } catch (erro) {
        await conexao.query("ROLLBACK");
        throw erro;
    } finally {
        conexao.release();
    }
};

popularBanco()
    .catch((erro) => {
        console.error("Erro ao preparar banco:", erro.message);
        process.exitCode = 1;
    })
    .finally(() => pool.end());
