import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import usuarioRoutes from './routes/usuario.routes';
import clienteRoutes from './routes/cliente.routes';
import citasRoutes from './routes/citas.routes';
import atencionesRoutes from './routes/atenciones.routes';
// import authRoutes from './routes/authRoutes';
// import clientesRoutes from './routes/clientesRoutes'
// import serviciosRoutes from './routes/serviciosRoutes'

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

//RUTAS

//REGISTRO, LOGIN
app.use('/login', usuarioRoutes);
// CLIENTES
app.use('/clientes', clienteRoutes);
// //CITAS
app.use('/citas', citasRoutes);
// //SERVICIOS
app.use('/atenciones', atencionesRoutes);
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server Running en el puerto ${PORT}`);
});
