import type { UmiApiRequest, UmiApiResponse } from "umi";
import pris from "../../../utils/prisma";
import { verifyToken } from "../../../utils/jwt";

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  switch (req.method) {
    case "POST":
      try {
        const prisma = pris;
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
        const findServer = await prisma.server.findUnique({
          where: { id: serverId },
        })
        if (findServer?.userId === user.id) {
          res.status(500).json({ message: "Cannot subscribe to your own server" });
          break;
        }
        const userSubscription = await prisma.userSubscription.create({
          data: {
            user: { connect: { id: user.id } },
            server: { connect: { id: serverId } },
          },
        })
        res.status(201).json({ message: "Subscribed" });
      } catch (error: any) {
        res.status(500).json('Already subscribed!');
      }
      break;
    default:
      res.status(405).json({ errof: "Method not allowed" });
  }
}
