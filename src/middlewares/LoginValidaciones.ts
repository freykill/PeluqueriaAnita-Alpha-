import { Request, Response, NextFunction } from 'express';
import { validateEmail, validatePassword } from '../utils/validacion.utils';

export function validateUserCreation(req: Request, res: Response, next: NextFunction) {
  const { email, passwordHash } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Formato de email no válido" });
  }

  if (!validatePassword(passwordHash)) {
    return res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres" });
  }

// minLength: Asegura que la contraseña tenga al menos 8 caracteres.
// hasUpperCase: Verifica que la contraseña contenga al menos una letra mayúscula.
// hasLowerCase: Verifica que la contraseña contenga al menos una letra minúscula.
// hasNumbers: Verifica que la contraseña contenga al menos un número.
// hasSpecialChar: Verifica que la contraseña contenga al menos un carácter especial.

  next();
}

