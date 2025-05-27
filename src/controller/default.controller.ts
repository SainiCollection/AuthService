import {Response, Request} from "express";

export const defaultMessage = (req:Request, res:Response)=>{
  res.status(202).send("This is AuthService Service")
}