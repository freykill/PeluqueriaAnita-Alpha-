import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CitaServices {
    // model Cita {
    //     id            Int       @id @default(autoincrement())
    //     clienteId     Int
    //     fechaCita     DateTime
    //     horaCita      DateTime
    //     estado        String
    //     fechaCreacion DateTime  @default(now())
    //     cliente       Cliente   @relation(fields: [clienteId], references: [id])
    //     atenciones    Atencion[]

    //     @@map("citas")
    //   }

    createCita = async (data: { clienteId: number; fechaCita: Date }): Promise<any> => {
        // Convertir las cadenas a objetos Date
        const fechaObj = new Date(data.fechaCita);

        // Validar la fecha
        if (isNaN(fechaObj.getTime())) {
            throw new Error('Fecha no valida');
        }

        // Validar que la fecha sea futura (opcional)
        const now = new Date();
        if (fechaObj <= now) {
            throw new Error('La fecha de la cita debe ser en el futuro');
        }

        // Validar que la hora esté en un intervalo de 30 minutos (0 o 30)
        const minutes = fechaObj.getMinutes();
        if (minutes !== 0 && minutes !== 30) {
            throw new Error(
                'La cita solo puede ser programada en intervalos de 30 minutos (por ejemplo, 1:00 PM, 1:30 PM, 2:00 PM)',
            );
        }

        // Validar que no exista una cita en conflicto (opcional)
        const citaConflicto = await prisma.cita.findFirst({
            where: {
                clienteId: data.clienteId,
                fechaCita: fechaObj,
            },
        });
        if (citaConflicto) {
            throw new Error('Ya existe una cita programada para este cliente en esa fecha y hora');
        }

        const clienteExiste = await prisma.cliente.findUnique({
            where: {
                id: data.clienteId,
            },
        });
        if (!clienteExiste) {
            throw new Error('Cliente no seleccionado');
        }

        return await prisma.cita.create({
            data: {
                clienteId: data.clienteId,
                fechaCita: fechaObj,
                estado: 'pendiente',
            },
        });
    };

    getAllCita = async (): Promise<any> => {
        const citas = await prisma.cita.findMany({
            orderBy: {
                fechaCita: 'asc', // Ordena por fecha, puedes cambiarlo según tus necesidades
            },
        });

        const totalCitas = await prisma.cita.count(); // Obtener el número total de citas

        return {
            citas,
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
