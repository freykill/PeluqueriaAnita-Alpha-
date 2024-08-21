import { Prisma, PrismaClient } from '@prisma/client';
import { comparePasswords, hashPassword } from '../utils/password.utils'; // Asegúrate de tener una función de hash
import { generateToken } from '../utils/auth.utils';

const prisma = new PrismaClient();

export class ClienteServices {

  // model Cliente {
  //   id            Int       @id @default(autoincrement())
  //   nombre        String
  //   apellido      String
  //   telefono      String
  //   email         String?   @unique
  //   direccion     String?
  //   fechaRegistro DateTime  @default(now())

  clienteAdd = async (data: { nombre: string, apellido: string; telefono: string; email: string; direccion: string }) => {

    // Validaciones
    if (!data.email || !data.nombre || !data.apellido || !data.telefono || !data.direccion) {
      throw new Error("Todos los campos son obligatorios");
    }
    // Validación de formato de correo electrónico
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email)) {
      throw new Error("El formato del email no es válido");
    }
    // Validación de longitud de nombre y apellido
    if (data.nombre.length < 2 || data.apellido.length < 2) {
      throw new Error("El nombre y el apellido deben tener al menos 2 caracteres");
    }
    // Validación de número de teléfono (ejemplo de formato español)
    if (!/^\+?(\d{9,12})$/.test(data.telefono)) {
      throw new Error("El número de teléfono debe tener entre 9 y 12 dígitos");
    }

    
    const existingUser = await prisma.cliente.findUnique({where: { email: data.email } });
    if (existingUser) throw new Error("El email ya está en uso");
    

    return await prisma.cliente.create({
      data: {
        nombre: data.nombre,
        apellido: data.apellido,
        telefono: data.telefono,
        email: data.email,
        direccion: data.direccion
      },
    });
  }



  clienteDelete = async (data: number) => {

    const existingUser = await prisma.cliente.findUnique({ where: { id: data }, });
    if (!existingUser) throw new Error("No se encontro usuario");
    
    return await prisma.cliente.delete({
      where: {
        id: data
      }
    })
  }

  clienteUpdate = async (data: { nombre: string, apellido: string; telefono: string; email: string; direccion: string }, id: number) => {

    // Validaciones
    if (!data.email || !data.nombre || !data.apellido || !data.telefono || !data.direccion) {
      throw new Error("Todos los campos son obligatorios");
    }
    // Validación de formato de correo electrónico
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email)) {
      throw new Error("El formato del email no es válido");
    }
    // Validación de longitud de nombre y apellido
    if (data.nombre.length < 2 || data.apellido.length < 2) {
      throw new Error("El nombre y el apellido deben tener al menos 2 caracteres");
    }
    // Validación de número de teléfono (ejemplo de formato español)
    if (!/^\+?(\d{9,12})$/.test(data.telefono)) {
      throw new Error("El número de teléfono debe tener entre 9 y 12 dígitos");
    }

    return await prisma.cliente.update({
      where: {
        id: id
      },
      data: {
        nombre: data.nombre,
        apellido: data.apellido,
        telefono: data.telefono,
        email: data.email,
        direccion: data.direccion
      },
    });
  }

  clienteGetAll = async () => {
    return await prisma.cliente.findMany()
  }

  clienteGet = async (data: number) => {
    const get = await prisma.cliente.findUnique({where: { id: data} })
    if (!get) throw new Error("no se encontro cliente")
    return get
  }



}
