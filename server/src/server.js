import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import router from "./routes/index.js";
import { pool } from "./config/database.js";

dotenv.config({ quiet: true });

const app = express();

app.use(cors({ origin: process.env.FRONTEND_ORIGIN }));
app.use(express.json());
app.use("/api", router);
app.use(express.static(fileURLToPath(new URL("../../dist", import.meta.url))));

const iniciar = async () => {
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("Configure JWT_SECRET no arquivo .env.");
        }

        await pool.query("SELECT 1");

        app.listen(process.env.PORT || 3000, "127.0.0.1", () => {
            console.log(`Servidor iniciado em http://localhost:${process.env.PORT || 3000}`);
        });
    } catch (erro) {
        console.error("Falha ao iniciar. Confira a conexão no .env:", erro.message);
        await pool.end();
        process.exitCode = 1;
    }
};

iniciar();
