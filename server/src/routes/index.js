import { Router } from "express";
import { autenticar } from "../middlewares/auth.js";
import { login } from "../controllers/authController.js";
import { listarProprietarios, criarProprietario } from "../controllers/proprietarioController.js";
import { listarVeiculos, criarVeiculo } from "../controllers/veiculoController.js";
import { listarOrdensServico, criarOrdemServico, atualizarStatus } from "../controllers/ordemServicoController.js";

const router = Router();

router.post("/auth/login", login);

router.get("/proprietarios", autenticar, listarProprietarios);
router.post("/proprietarios", autenticar, criarProprietario);

router.get("/veiculos", autenticar, listarVeiculos);
router.post("/veiculos", autenticar, criarVeiculo);

router.get("/ordens-servico", autenticar, listarOrdensServico);
router.post("/ordens-servico", autenticar, criarOrdemServico);
router.patch("/ordens-servico/:id/status", autenticar, atualizarStatus);

export default router;
