import type { UmiApiRequest, UmiApiResponse } from "umi";
import pris from "../../../utils/prisma";
import { verifyToken } from "../../../utils/jwt";

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  switch (req.method) {
    case "POST":
      try {
        const prisma = pris;
        const roomId: number = req.body.roomId;
        const tok = req.headers.authorization?.split(" ")[1];
        const token = await verifyToken(tok as string);
        const message = req.body.message;
        const user = await prisma.user.findUnique({
          where: { id: token.id },
        });
        if (!user || !token) {
          res.status(500).json({ message: "Invalid token" });
          break;
        }
        const messages = await prisma.message.findMany({
            where: { roomId: roomId },
            orderBy: { createdAt: "asc" },
        })
        res.status(200).json({ message: "Loaded Messages", messages: messages });
      } catch (error: any) {
        res.status(500).json(error);
      }
      break;
    default:
      res.status(405).json({ errof: "Method not allowed" });
  }
}
