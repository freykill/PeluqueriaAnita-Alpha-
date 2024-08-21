import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AtencionServices {
    // model Atencion {
    //     id             Int       @id @default(autoincrement())
    //     citaId         Int
    //     servicio       String
    //     precio         Float
    //     duracion       Int?      // Duración en minutos, opcional

    createAtencion = async (data: { citaId: number; service: string; precio: number }): Promise<any> => {
        // validamos que la citaID exista
        const ExisteCita = await prisma.cita.findUnique({
            where: {
                id: data.citaId,
            },
        });

        if (!ExisteCita) {
            throw new Error('La cita no existe, por favor revisar');
        } else {
            if (ExisteCita.estado === 'cancelado') {
                throw new Error(
                    'La cita esta en estado cancelada por lo que no se puede establacer una atencion, cree una nueva cita',
                );
            }
        }

        await prisma.cita.update({
            where: { id: data.citaId },
            data: { estado: 'completado' },
        });

        return await prisma.atencion.create({
            data: {
                citaId: data.citaId,
                servicio: data.service,
                precio: data.precio,
            },
        });
    };

    getAllAtencionesForCita = async (idCita: number): Promise<any> => {
        const antenciones = await prisma.atencion.findMany({
            orderBy: {
                fechaAtencion: 'asc', // Ordena por fecha, puedes cambiarlo según tus necesidades
            },
            where: {
                citaId: idCita,
            },
        });

        return {
            antenciones,
        };
    };

    getAllAtencionesForCliente = async (id: number): Promise<any> => {
        const antenciones = await prisma.atencion.findMany({
            orderBy: {
                fechaAtencion: 'asc', // Ordena por fecha, puedes cambiarlo según tus necesidades
            },
            where: {
                citaId: id,
            },
        });

        const totalCitas = await prisma.cita.count(); // Obtener el número total de citas

        return {
            antenciones,
        };
    };

    getCita = async (id: number): Promise<any> => {
        const cita = await prisma.cita.findUnique({
            where: { id: id },
        });

        if (!cita) {
            throw new Error('Cita no encontrada');
        }

        return cita;
    };

    getCitasSearch = async (
        clienteId?: number,
        fechaInicio?: string,
        fechaFin?: string,
        estado?: string,
    ): Promise<any> => {
        const where: any = {};

        //agregar si esta presente el id del cliente
        if (clienteId) {
            if (isNaN(clienteId)) {
                throw new Error('ID de cliente no válido');
            }
            where.clienteId = clienteId;
        }

        // Validar y agregar rango de fechas al filtro si están presentes
        if (fechaInicio || fechaFin) {
            where.fechaCita = {};

            if (fechaInicio) {
                const fechaInicioDate = new Date(fechaInicio);
                if (isNaN(fechaInicioDate.getTime())) {
                    throw new Error('Fecha de inicio no válida');
                }
                where.fechaCita.gte = fechaInicioDate;
            }

            if (fechaFin) {
                const fechaFinDate = new Date(fechaFin);
                if (isNaN(fechaFinDate.getTime())) {
                    throw new Error('Fecha de fin no válida');
                }
                where.fechaCita.lte = fechaFinDate;
            }
        }

        // Validar y agregar estado al filtro si está presente
        if (estado) {
            where.estado = estado;
        }

        // Búsqueda de citas con los filtros aplicados
        const citas = await prisma.cita.findMany({
            where: where,
            orderBy: {
                fechaCita: 'asc', // Ordenar por fecha en orden ascendente
            },
        });

        return citas;
    };

    actualizarEstadoCita = async (id: number, nuevoEstado: string) => {
        return await prisma.cita.update({
            where: { id: id },
            data: { estado: nuevoEstado },
        });
    };

    // Método para actualizar la fecha de una cita
    actualizarFechaCita = async (id: number, nuevaFecha: Date): Promise<any> => {
        const fechaObj = new Date(nuevaFecha);
        return await prisma.cita.update({
            where: { id: id },
            data: { fechaCita: nuevaFecha },
        });
    };
}
