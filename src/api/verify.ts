import type { UmiApiRequest, UmiApiResponse } from "umi";
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { verifyToken } from "../utils/jwt";
import pris from "../utils/prisma";

export default async function (req:UmiApiRequest, res:UmiApiResponse) {
  switch (req.method){
    case 'GET':
        try {
            const prisma = pris;
            const tok = req.headers.authorization?.split(' ')[1];
            const token = await verifyToken(tok as string);
            const user = await prisma.user.findUnique({
              where:{id:token.id}
            })
            if (!user || !token){
              res.status(500).json({message: 'Invalid token'})
              break;
            }
            res.status(200)
            .json({...user, passwordHash:undefined});
        }
       catch(error: any) {
        res.status(500).json(error)
      }
      break;
    default:
      res.status(405).json({ errof:'Method not allowed' })
  }
}