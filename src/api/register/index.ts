import type { UmiApiRequest, UmiApiResponse } from "umi";
import bcrypt from "bcryptjs";
import { signToken } from "../../utils/jwt";
import pris from "../../utils/prisma";

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  switch (req.method) {
    case "POST":
      try {
        const prisma = pris;

        const findUser = await prisma.user.findUnique({
          where: { email: req.body.email },
        });
        if (findUser) {
          res.status(409)
            .json({ message: "User already exists" });
          break;
        }
        const user = await prisma.user.create({
          data: {
            email: req.body.email,
            passwordHash: bcrypt.hashSync(req.body.password, 8),
            name: req.body.name,
            avatarUrl: req.body.avatarUrl,
          },
        });
        const token = await signToken(user.id);
        const server = await prisma.server.create({
          data: {
            userId: user.id,
            serverName: `${user.name}'s server`
          }
        });
        const userServers = await prisma.userServers.create({
          data:{
            userId: user.id,
            serverId: server.id,
          }
        })
        res
          .status(201)
          .setCookie("token", token)
          .json({ ...user, passwordHash: undefined, token: token });
        await prisma.$disconnect();
      } catch (e: any) {
        res.status(500).json({
          result: false,
          message:
            typeof e.code === "string"
              ? "https://www.prisma.io/docs/reference/api-reference/error-reference#" +
                e.code.toLowerCase()
              : e,
        });
      }
      break;
    default:
      // 如果不是 POST 请求，代表他正在用错误的方式访问这个 API
      res.status(405).json({ error: "Method not allowed" });
  }
}
