import type { UmiApiRequest, UmiApiResponse } from "umi";
import pris from "../../utils/prisma";
interface user {
  id: number;
}

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  switch (req.method) {
    case "GET":
      try {
        const prisma = pris;
        const serverId:number = parseInt(req.params.serverId);
        const rooms = await prisma.room.findMany({
            where: { serverId: serverId },
        });
        res.status(200).json({ ...rooms });
      } catch (error: any) {
        res.status(500).json(error);
      }
      break;
    default:
      res.status(405).json({ errof: "Method not allowed" });
  }
}
