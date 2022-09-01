import type { UmiApiRequest, UmiApiResponse } from "umi";
import pris from "../utils/prisma";
import { verifyToken } from "../utils/jwt";
import verify from "./verify";

interface user {
  id: number;
}

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  switch (req.method) {
    case "GET":
      try {
        const prisma = pris;
        const tok = req.headers.authorization?.split(" ")[1];
        const token = await verifyToken(tok as string);
        const user = await prisma.user.findUnique({
          where: { id: token.id },
        });
        if (!user || !token) {
          res.status(500).json({ message: "Invalid token" });
          break;
        }
        const ownedServers = await prisma.server.findMany({
          where: { userId: user.id },
        });
        res.status(200).json({ ...ownedServers });
      } catch (error: any) {
        res.status(500).json(error);
      }
      break;
    default:
      res.status(405).json({ errof: "Method not allowed" });
  }
}
