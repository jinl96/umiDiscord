 import type { UmiApiRequest, UmiApiResponse } from "umi";
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { signToken } from "../utils/jwt";
import pris from "../utils/prisma";

export default async function (req:UmiApiRequest, res:UmiApiResponse) {
  switch (req.method){
    case 'POST':
      console.log(req.headers.authorization?.split(' ')[1])
      try {
        const prisma = pris;
        const user = await prisma.user.findUnique({
          where: {email: req.body.email}
        });
        if (!user || !bcrypt.compareSync(req.body.password, user.passwordHash)) {
          return res.status(401).json({
            message: 'Invalid email or password'
          });
        }
        console.log(user);
        const token = await signToken(user.id)
        res.status(200)
          .setCookie('token', token)
          .json({...user, passwordHash:undefined, token: token});
        await prisma.$disconnect();
      } catch(error: any) {
        res.status(500).json(error)
      }
      break;
    default:
      res.status(405).json({ errof:'Method not allowed' })
  }
}