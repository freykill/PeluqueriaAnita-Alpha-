export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  

  export function validatePassword(password: string): boolean {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);


// minLength: Asegura que la contraseña tenga al menos 8 caracteres.
// hasUpperCase: Verifica que la contraseña contenga al menos una letra mayúscula.
// hasLowerCase: Verifica que la contraseña contenga al menos una letra minúscula.
// hasNumbers: Verifica que la contraseña contenga al menos un número.
// hasSpecialChar: Verifica que la contraseña contenga al menos un carácter especial.
  
    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar
    );
  }