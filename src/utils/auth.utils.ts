import jwt from "jsonwebtoken"
import { IUsuario } from "../interfaces/usuario.interface"

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret'


export const generateToken = (usuario: IUsuario):string =>{
return jwt.sign({id:usuario.id,email:usuario.email}, JWT_SECRET,{expiresIn: '1h' })
}