import { PrismaClient } from '@prisma/client';
import { comparePasswords, hashPassword } from '../utils/password.utils'; // Asegúrate de tener una función de hash
import { generateToken } from '../utils/auth.utils';

const prisma = new PrismaClient();

export class UsuarioServices {
    loginUser = async (data: { email: string; passwordHash: string }): Promise<any> => {
        // Verificar si el usuario existe
        const usuario = await prisma.usuario.findUnique({
            where: { email: data.email },
        });

        if (!usuario) {
            throw new Error('Credenciales incorrectas');
        }

        // Comparar la contraseña
        const isPasswordValid = await comparePasswords(data.passwordHash, usuario.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Credenciales incorrectas');
        }

        // Generar el token
        const token = generateToken({ id: usuario.id, email: usuario.email });
        return {
            token,
            user: {
                id: usuario.id,
                email: usuario.email,
            },
        };
    };

    async createUser(data: { nombreUsuario: string; email: string; passwordHash: string }) {
        //validaciones

        const existingUser = await prisma.usuario.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new Error('El email ya está en uso');
        }

        const hashedPassword = await hashPassword(data.passwordHash);
        return await prisma.usuario.create({
            data: {
                nombreUsuario: data.nombreUsuario,
                email: data.email,
                passwordHash: hashedPassword,
                rol: 'admin',
            },
        });
    }
}
