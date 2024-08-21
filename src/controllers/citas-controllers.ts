import { Request, Response } from 'express';
import { CitaServices } from '../services/cita-services';

class CitasController {
    private citaServices: CitaServices;

    constructor() {
        this.citaServices = new CitaServices();
    }

    createCita = async (req: Request, res: Response): Promise<void> => {
        try {
            const cita = await this.citaServices.createCita(req.body);
            res.status(200).json(cita);
        } catch (error: any) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    };

    getAllCitas = async (req: Request, res: Response): Promise<void> => {
        try {
            const citas = await this.citaServices.getAllCita();
            res.status(200).json(citas);
            return;
        } catch (error: any) {
            res.status(500).json({ message: 'Server error', error: error.message });
            return;
        }
    };

    getCita = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ message: 'ID de cita no válido' });
                return;
            }
            const citas = await this.citaServices.getCita(id);
            res.status(200).json(citas);
            return;
        } catch (error: any) {
            res.status(500).json({ message: 'Server error', error: error.message });
            return;
        }
    };

    getCitasSearch = async (req: Request, res: Response): Promise<void> => {
        try {
            const clienteId = req.query.clienteId ? parseInt(req.query.clienteId as string) : undefined;
            const fechaInicio = req.query.fechaInicio as string;
            const fechaFin = req.query.fechaFin as string;
            const estado = req.query.estado as string;
            const citas = await this.citaServices.getCitasSearch(clienteId, fechaInicio, fechaFin, estado);
            res.status(200).json(citas);
        } catch (error: any) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    };

    cancelarCita = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({ message: 'ID de cita no válido' });
                return;
            }

            const cita = await this.citaServices.getCita(id);

            if (!cita) {
                res.status(404).json({ message: 'Cita no encontrada' });
                return;
            }

            // Verifica si la cita ya está cancelada
            if (cita.estado === 'cancelado') {
                res.status(400).json({ message: 'La cita ya está cancelada' });
                return;
            }

            // Actualiza el estado de la cita a 'cancelado'
            const citaActualizada = await this.citaServices.actualizarEstadoCita(id, 'cancelado');
            res.status(200).json(citaActualizada);
            return;
        } catch (error: any) {
            res.status(500).json({ message: 'Error del servidor', error: error.message });
            return;
        }
    };

    modificarFechaCita = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const { nuevaFecha } = req.body;

            if (isNaN(id)) {
                res.status(400).json({ message: 'ID de cita no válido' });
                return;
            }

            if (!nuevaFecha) {
                res.status(400).json({ message: 'La nueva fecha es requerida' });
                return;
            }

            const fecha = new Date(nuevaFecha);
            if (isNaN(fecha.getTime())) {
                res.status(400).json({ message: 'Fecha no válida' });
                return;
            }

            // Verifica que la fecha sea futura (opcional)
            const now = new Date();
            if (fecha <= now) {
                res.status(400).json({ message: 'La fecha de la cita debe ser en el futuro' });
                return;
            }

            const cita = await this.citaServices.getCita(id);

            if (!cita) {
                res.status(404).json({ message: 'Cita no encontrada' });
                return;
            }

            // Verifica si la cita está cancelada
            if (cita.estado === 'cancelado') {
                res.status(400).json({ message: 'No se puede modificar una cita cancelada' });
                return;
            }

            // Actualiza la fecha de la cita
            const citaActualizada = await this.citaServices.actualizarFechaCita(id, fecha);

            res.status(200).json(citaActualizada);
            return;
        } catch (error: any) {
            res.status(500).json({ message: 'Error del servidor', error: error.message });
            return;
        }
    };
}

export default new CitasController();
