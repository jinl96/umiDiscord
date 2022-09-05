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
        if (req.body.type === "text") {
          console.log("m", req.body.message);
          const messageUpdate = await prisma.message.create({
            data: {
              roomId: roomId,
              content: message,
              userId: user.id,
              userName: user.name,
            },
          });
        } else {
          const messageUpdate = await prisma.message.create({
            data: {
              roomId: roomId,
              audio: req.body.message,
              userId: user.id,
              userName: user.name,
              type: "audio",
            },
          });
        }
        res.status(200).json({ message: "Message Saved" });
      } catch (e: any) {
        // The .code property can be accessed in a type-safe manner
        if (e?.code === "P2002") {
          console.log(
            "There is a unique constraint violation, a new user cannot be created with this email"
          );
        }

        throw e;
      }
      break;
    default:
      res.status(405).json({ errof: "Method not allowed" });
  }
}
