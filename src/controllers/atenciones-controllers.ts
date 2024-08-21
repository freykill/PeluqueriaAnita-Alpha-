import { Request, Response } from 'express';
import { AtencionServices } from '../services/atencion-services';

class AtencionesController {
    private atencionServices: AtencionServices;

    constructor() {
        this.atencionServices = new AtencionServices();
    }

    createAtencion = async (req: Request, res: Response): Promise<void> => {
        try {
            const { citaId, service, precio } = req.body;

            // Validación del citaId
            if (!Number.isInteger(citaId) || citaId <= 0) {
                res.status(400).json({ message: 'El ID de la cita debe ser un número entero positivo' });
                return;
            }

            // Validación del servicio
            if (typeof service !== 'string' || service.trim().length === 0) {
                res.status(400).json({ message: 'El servicio debe ser una cadena de texto no vacía' });
                return;
            }

            // Validación del precio
            if (typeof precio !== 'number' || precio <= 0) {
                res.status(400).json({ message: 'El precio debe ser un número positivo' });
                return;
            }

            const newAtencion = await this.atencionServices.createAtencion(req.body);
            res.status(200).json(newAtencion);
            return;
        } catch (error: any) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    };

    getAllAtencionesForCita = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);

            // Validación del citaId
            if (!Number.isInteger(id) || id <= 0) {
                res.status(400).json({ message: 'El ID de la cita debe ser un número entero positivo' });
                return;
            }

            const AtencionesForCita = await this.atencionServices.getAllAtencionesForCita(id);
            res.status(200).json(AtencionesForCita);
            return;
        } catch (error: any) {
            res.status(500).json({ message: 'Server error', error: error.message });
            return;
        }
    };
}

export default new AtencionesController();
