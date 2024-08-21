import express from 'express';
import citasControllers from '../controllers/citas-controllers';
import atencionesControllers from '../controllers/atenciones-controllers';
// import {  register, login } from "../controllers/authControllers";
const router = express.Router();

router.post('/', atencionesControllers.createAtencion);
router.get('/:id', atencionesControllers.getAllAtencionesForCita);
// router.get('/', citasControllers.getAllCitas);
// router.get('/search/', citasControllers.getCitasSearch);
// router.patch('/:id/cancelar', citasControllers.cancelarCita);
// router.patch('/:id/modificar-fecha', citasControllers.modificarFechaCita);
// router.get('/:id', citasControllers.getCita);

// router.delete('/:id',clienteControllers.deleteCliente)
// router.get('/:id',clienteControllers.getClientebyID)
// router.put('/:id',clienteControllers.updateCliente)

export default router;
