import {Request, Response, Router} from "express";

export const securityDevices = Router();

securityDevices.get("/", async (req:Request, res:Response) =>{
    const ip = req.socket.remoteAddress || req.headers['x-forwarded-for']
})