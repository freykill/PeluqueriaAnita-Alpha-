import express from 'express';
import { validateUserCreation } from '../middlewares/LoginValidaciones';
import usuarioControllers from '../controllers/usuario.controllers';
// import {  register, login } from "../controllers/authControllers";
const router = express.Router();

router.post('/register', validateUserCreation, usuarioControllers.register);
router.post('/', usuarioControllers.login);

export default router;
