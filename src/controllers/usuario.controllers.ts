import { Request, Response } from "express";
import { UsuarioServices } from "../services/usuario.services";



class UsuarioController {
  private usuarioServices: UsuarioServices

  constructor(){
    this.usuarioServices = new UsuarioServices
  }

  register = async (req: Request, res: Response): Promise<void> => {

      const { nombreUsuario, email, passwordHash } = req.body;
      
      if (!nombreUsuario || !email || !passwordHash) {
        res.status(400).json({ message: "Todos los campos son requeridos" });
        return;
      }
  
    try {
      const newUsuario = await this.usuarioServices.createUser(req.body)
      res.status(201).json(newUsuario);
    } catch (error:any) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  login = async (req: Request, res: Response): Promise<void> => {

    const { email, passwordHash } = req.body;
    
    if (!email || !passwordHash) {
      res.status(400).json({ message: "Todos los campos son requeridos" });
      return;
    }

  try {
    const LoginUsuario = await this.usuarioServices.loginUser(req.body)
    res.status(201).json(LoginUsuario);
  } catch (error:any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}


}

export default new UsuarioController();




