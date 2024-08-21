import express from "express";
import clienteControllers from "../controllers/cliente.controllers";
// import {  register, login } from "../controllers/authControllers";
const router = express.Router();

router.post('/', clienteControllers.agregar);
router.get('/',clienteControllers.getClientes)
router.delete('/:id',clienteControllers.deleteCliente)
router.get('/:id',clienteControllers.getClientebyID)
router.put('/:id',clienteControllers.updateCliente)


export default router;