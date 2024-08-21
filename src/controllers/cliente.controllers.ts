import { Request, Response } from "express";
import { UsuarioServices } from "../services/usuario.services";
import { ClienteServices } from "../services/cliente.services";
import { Prisma } from "@prisma/client";
import { json } from "stream/consumers";



class ClienteController {
  private clienteServices: ClienteServices

  constructor() {
    this.clienteServices = new ClienteServices
  }

  agregar = async (req: Request, res: Response): Promise<void> => {
    try {
      const newCliente = await this.clienteServices.clienteAdd(req.body)
      res.status(201).json(newCliente);
    } catch (error: any) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  getClientes = async (req: Request, res: Response) => {
    try {
      const AllCliente = await this.clienteServices.clienteGetAll();
      res.status(200).json(AllCliente)

    } catch (error: any) {
      res.status(500).json({ message: 'Server error', error: error.menssage })
    }
  }

  deleteCliente = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id)
    try {
      const deleteCliente = await this.clienteServices.clienteDelete(id)
      res.status(200).json(deleteCliente)
    } catch (error: any) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  getClientebyID = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id)
    try {
      const getClienteId = await this.clienteServices.clienteGet(id)
      res.status(200).json(getClienteId)
    } catch (error: any) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  updateCliente = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id)
    try {
      const clienteUpdate = await this.clienteServices.clienteUpdate(req.body, id)
      res.status(200).json(clienteUpdate)
    } catch (error: any) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }






}

export default new ClienteController();




