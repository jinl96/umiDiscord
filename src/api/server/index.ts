import type { UmiApiRequest, UmiApiResponse } from "umi";
import pris from "../../utils/prisma";
import { verifyToken } from "../../utils/jwt";

interface user {
  id: number;
}

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  switch (req.method) {
    case "POST":
      try {
        const prisma = pris;
        const tok = req.headers.authorization?.split(" ")[1];
        const token = await verifyToken(tok as string);
        const user = await prisma.user.findUnique({
          where: { id: token.id },
        });
        if (!user || !token){
          res.status(500).json({message: 'Invalid token'})
          break;
        }
        if (user) {
          const userId: number = user.id;
          const server = await prisma.server.create({
            data: {
              userId: user.id,
              serverName: req.body.serverName,
            },
          });
          const userServers = await prisma.userServers.create({
            data: {
              userId: user.id,
              serverId: server.id,
            },
          });
          res.status(201).json({ ...userServers });
          await prisma.$disconnect();
        }
      } catch (e: any) {
        res.status(500).json({
          result: false,
          message:
            typeof e.code === "string"
              ? "https://www.prisma.io/docs/reference/api-reference/error-reference#" +
                e.code.toLowerCase()
              : e,
        })
      }
      break;
    default:
      res.status(405).json({ error: "Method not allowed" });
  }
}
