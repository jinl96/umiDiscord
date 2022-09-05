import type { UmiApiRequest, UmiApiResponse } from "umi";
import pris from "../../../utils/prisma";
import { verifyToken } from "../../../utils/jwt";
import verify from "../../token";
import { Prisma } from "@prisma/client";

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  switch (req.method) {
    case "POST":
      try {
        const prisma = pris;
        const roomName: string = req.body.roomName;
        const serverId: number = parseInt(req.body.serverId);
        const tok = req.headers.authorization?.split(" ")[1];
        const token = await verifyToken(tok as string);
        const user = await prisma.user.findUnique({
          where: { id: token.id },
        });
        if (!user || !token) {
          res.status(500).json({ message: "Invalid token" });
          break;
        }
        const server = await prisma.server.findUnique({
            where: { id: serverId },
        });
        if (!server) {
            res.status(500).json({ message: "Invalid server" });
            break;
            }
        if (server.userId !== user.id) {
            res.status(500).json({ message: "User doesn't own the server" });
            break;
            }
        const room = await prisma.room.create({
            data: {
                serverId: serverId,
                name: roomName,
            }
        })

        res.status(200).json({ message: "Room created", room: room });
      } catch (error: any) {
        res.status(500).json(error);
      }
      break;
    default:
      res.status(405).json({ errof: "Method not allowed" });
  }
}
