"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/.pnpm/@umijs+preset-umi@4.0.15_rbiprd2jedhqzym5fmfgp6qxse/node_modules/@umijs/preset-umi/dist/features/apiRoute/utils.js
var require_utils = __commonJS({
  "node_modules/.pnpm/@umijs+preset-umi@4.0.15_rbiprd2jedhqzym5fmfgp6qxse/node_modules/@umijs/preset-umi/dist/features/apiRoute/utils.js"(exports, module2) {
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var utils_exports = {};
    __export2(utils_exports, {
      esbuildIgnorePathPrefixPlugin: () => esbuildIgnorePathPrefixPlugin,
      matchApiRoute: () => matchApiRoute2
    });
    module2.exports = __toCommonJS2(utils_exports);
    function esbuildIgnorePathPrefixPlugin() {
      return {
        name: "ignore-path-prefix",
        setup(build) {
          build.onResolve({ filter: /^@fs/ }, (args) => ({
            path: args.path.replace(/^@fs/, "")
          }));
        }
      };
    }
    function matchApiRoute2(apiRoutes2, path) {
      if (path.startsWith("/"))
        path = path.substring(1);
      if (path.startsWith("api/"))
        path = path.substring(4);
      const pathSegments = path.split("/").filter((p) => p !== "");
      if (pathSegments.length === 0 || pathSegments.length === 1 && pathSegments[0] === "api") {
        const route2 = apiRoutes2.find((r) => r.path === "/");
        if (route2)
          return { route: route2, params: {} };
        else
          return void 0;
      }
      const params = {};
      const route = apiRoutes2.find((route2) => {
        const routePathSegments = route2.path.split("/").filter((p) => p !== "");
        if (routePathSegments.length !== pathSegments.length)
          return false;
        for (let i = 0; i < routePathSegments.length; i++) {
          const routePathSegment = routePathSegments[i];
          if (routePathSegment.match(/^\[.*]$/)) {
            params[routePathSegment.substring(1, routePathSegment.length - 1)] = pathSegments[i];
            if (i == routePathSegments.length - 1)
              return true;
            continue;
          }
          if (routePathSegment !== pathSegments[i])
            return false;
          if (i == routePathSegments.length - 1)
            return true;
        }
      });
      if (route)
        return { route, params };
    }
  }
});

// node_modules/.pnpm/@umijs+preset-umi@4.0.15_rbiprd2jedhqzym5fmfgp6qxse/node_modules/@umijs/preset-umi/dist/features/apiRoute/request.js
var require_request = __commonJS({
  "node_modules/.pnpm/@umijs+preset-umi@4.0.15_rbiprd2jedhqzym5fmfgp6qxse/node_modules/@umijs/preset-umi/dist/features/apiRoute/request.js"(exports, module2) {
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var request_exports = {};
    __export2(request_exports, {
      default: () => request_default,
      parseMultipart: () => parseMultipart,
      parseUrlEncoded: () => parseUrlEncoded
    });
    module2.exports = __toCommonJS2(request_exports);
    var import_utils = require_utils();
    var UmiApiRequest3 = class {
      constructor(req, apiRoutes2) {
        this._params = {};
        this._body = null;
        this._req = req;
        const m = (0, import_utils.matchApiRoute)(apiRoutes2, this.pathName || "");
        if (m)
          this._params = m.params;
      }
      get params() {
        return this._params;
      }
      get body() {
        return this._body;
      }
      get headers() {
        return this._req.headers;
      }
      get method() {
        return this._req.method;
      }
      get query() {
        var _a, _b;
        return ((_b = (_a = this._req.url) == null ? void 0 : _a.split("?")[1]) == null ? void 0 : _b.split("&").reduce((acc, cur) => {
          const [key, value] = cur.split("=");
          const k = acc[key];
          if (k) {
            if (k instanceof Array) {
              k.push(value);
            } else {
              acc[key] = [k, value];
            }
          } else {
            acc[key] = value;
          }
          return acc;
        }, {})) || {};
      }
      get cookies() {
        var _a;
        return (_a = this._req.headers.cookie) == null ? void 0 : _a.split(";").reduce((acc, cur) => {
          const [key, value] = cur.split("=");
          acc[key.trim()] = value;
          return acc;
        }, {});
      }
      get url() {
        return this._req.url;
      }
      get pathName() {
        var _a;
        return (_a = this._req.url) == null ? void 0 : _a.split("?")[0];
      }
      readBody() {
        if (this._req.headers["content-length"] === "0") {
          return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
          let body = [];
          this._req.on("data", (chunk) => {
            body.push(chunk);
          });
          this._req.on("end", () => {
            var _a, _b;
            const bodyBuffer = Buffer.concat(body);
            switch ((_a = this._req.headers["content-type"]) == null ? void 0 : _a.split(";")[0]) {
              case "application/json":
                try {
                  this._body = JSON.parse(bodyBuffer.toString());
                } catch (e) {
                  this._body = body;
                }
                break;
              case "multipart/form-data":
                const boundary = (_b = this.headers["content-type"]) == null ? void 0 : _b.split("boundary=")[1];
                if (!boundary) {
                  this._body = body;
                  break;
                }
                this._body = parseMultipart(bodyBuffer, boundary);
                break;
              case "application/x-www-form-urlencoded":
                this._body = parseUrlEncoded(bodyBuffer.toString());
                break;
              default:
                this._body = body;
                break;
            }
            resolve();
          });
          this._req.on("error", reject);
        });
      }
    };
    function parseMultipart(body, boundary) {
      const hexBoundary = Buffer.from(`--${boundary}`, "utf-8").toString("hex");
      return body.toString("hex").split(hexBoundary).reduce((acc, cur) => {
        var _a, _b;
        const [hexMeta, hexValue] = cur.split(Buffer.from("\r\n\r\n").toString("hex"));
        const meta = Buffer.from(hexMeta, "hex").toString("utf-8");
        const name = (_a = meta.split('name="')[1]) == null ? void 0 : _a.split('"')[0];
        if (!name)
          return acc;
        const fileName = (_b = meta.split('filename="')[1]) == null ? void 0 : _b.split('"')[0];
        if (fileName) {
          const fileBufferBeforeTrim = Buffer.from(hexValue, "hex");
          const fileBuffer = fileBufferBeforeTrim.slice(0, fileBufferBeforeTrim.byteLength - 2);
          const contentType = meta.split("Content-Type: ")[1];
          acc[name] = {
            fileName,
            data: fileBuffer,
            contentType
          };
          return acc;
        }
        const valueBufferBeforeTrim = Buffer.from(hexValue, "hex");
        const valueBuffer = valueBufferBeforeTrim.slice(0, valueBufferBeforeTrim.byteLength - 2);
        acc[name] = valueBuffer.toString("utf-8");
        return acc;
      }, {});
    }
    function parseUrlEncoded(body) {
      return body.split("&").reduce((acc, cur) => {
        const [key, value] = cur.split("=");
        acc[key] = decodeURIComponent(value);
        return acc;
      }, {});
    }
    var request_default = UmiApiRequest3;
  }
});

// node_modules/.pnpm/@umijs+preset-umi@4.0.15_rbiprd2jedhqzym5fmfgp6qxse/node_modules/@umijs/preset-umi/dist/features/apiRoute/response.js
var require_response = __commonJS({
  "node_modules/.pnpm/@umijs+preset-umi@4.0.15_rbiprd2jedhqzym5fmfgp6qxse/node_modules/@umijs/preset-umi/dist/features/apiRoute/response.js"(exports, module2) {
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var response_exports = {};
    __export2(response_exports, {
      default: () => response_default
    });
    module2.exports = __toCommonJS2(response_exports);
    var UmiApiResponse3 = class {
      constructor(res) {
        this._res = res;
      }
      status(statusCode) {
        this._res.statusCode = statusCode;
        return this;
      }
      header(key, value) {
        this._res.setHeader(key, value);
        return this;
      }
      setCookie(key, value) {
        this._res.setHeader("Set-Cookie", `${key}=${value}; path=/`);
        return this;
      }
      end(data) {
        this._res.end(data);
        return this;
      }
      text(data) {
        this._res.setHeader("Content-Type", "text/plain; charset=utf-8");
        this._res.end(data);
        return this;
      }
      html(data) {
        this._res.setHeader("Content-Type", "text/html; charset=utf-8");
        this._res.end(data);
        return this;
      }
      json(data) {
        this._res.setHeader("Content-Type", "application/json");
        this._res.end(JSON.stringify(data));
        return this;
      }
    };
    var response_default = UmiApiResponse3;
  }
});

// node_modules/.pnpm/@umijs+preset-umi@4.0.15_rbiprd2jedhqzym5fmfgp6qxse/node_modules/@umijs/preset-umi/dist/features/apiRoute/index.js
var require_apiRoute = __commonJS({
  "node_modules/.pnpm/@umijs+preset-umi@4.0.15_rbiprd2jedhqzym5fmfgp6qxse/node_modules/@umijs/preset-umi/dist/features/apiRoute/index.js"(exports, module2) {
    var __create2 = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __getProtoOf2 = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toESM2 = (mod, isNodeMode, target) => (target = mod != null ? __create2(__getProtoOf2(mod)) : {}, __copyProps2(isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target, mod));
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var apiRoute_exports = {};
    __export2(apiRoute_exports, {
      UmiApiRequest: () => import_request.default,
      UmiApiResponse: () => import_response.default,
      matchApiRoute: () => import_utils.matchApiRoute
    });
    module2.exports = __toCommonJS2(apiRoute_exports);
    var import_request = __toESM2(require_request());
    var import_response = __toESM2(require_response());
    var import_utils = require_utils();
  }
});

// src/.umi/api/URL.ts
var URL_exports = {};
__export(URL_exports, {
  default: () => URL_default2
});
module.exports = __toCommonJS(URL_exports);

// src/.umi/api/_middlewares.ts
var middlewares_default = async (req, res, next) => {
  next();
};

// src/api/URL.ts
var API_URL = "http://localhost:8000";
var URL_default = API_URL;

// src/.umi/api/URL.ts
var import_apiRoute = __toESM(require_apiRoute());
var apiRoutes = [{ "path": "room/voiceMessage/[roomId]", "id": "room/voiceMessage/[roomId]", "file": "room/voiceMessage/[roomId].ts", "absPath": "/room/voiceMessage/[roomId]", "__content": 'import type { UmiApiRequest, UmiApiResponse } from "umi";\nimport pris from "../../../utils/prisma";\nimport { verifyToken } from "../../../utils/jwt";\n\nexport default async function (req: UmiApiRequest, res: UmiApiResponse) {\n  switch (req.method) {\n    case "GET":\n      try {\n        const prisma = pris;\n        const roomId: number = parseInt(req.params.roomId);\n        const tok = req.headers.authorization?.split(" ")[1];\n        const token = await verifyToken(tok as string);\n        const message = req.body.message;\n        const user = await prisma.user.findUnique({\n          where: { id: token.id },\n        });\n        if (!user || !token) {\n          res.status(500).json({ message: "Invalid token" });\n          break;\n        }\n        const messages = await prisma.message.findMany({\n          where: { roomId: roomId, type: "audio" },\n          orderBy: { createdAt: "desc" },\n        });\n        res\n          .status(200)\n          .json({ message: "Loaded Messages", messages: messages[0] });\n      } catch (error: any) {\n        res.status(500).json(error);\n      }\n      break;\n    default:\n      res.status(405).json({ errof: "Method not allowed" });\n  }\n}\n' }, { "path": "room/historyMessage", "id": "room/historyMessage/index", "file": "room/historyMessage/index.ts", "absPath": "/room/historyMessage", "__content": 'import type { UmiApiRequest, UmiApiResponse } from "umi";\nimport pris from "../../../utils/prisma";\nimport { verifyToken } from "../../../utils/jwt";\n\nexport default async function (req: UmiApiRequest, res: UmiApiResponse) {\n  switch (req.method) {\n    case "POST":\n      try {\n        const prisma = pris;\n        const roomId: number = req.body.roomId;\n        const tok = req.headers.authorization?.split(" ")[1];\n        const token = await verifyToken(tok as string);\n        const message = req.body.message;\n        const user = await prisma.user.findUnique({\n          where: { id: token.id },\n        });\n        if (!user || !token) {\n          res.status(500).json({ message: "Invalid token" });\n          break;\n        }\n        const messages = await prisma.message.findMany({\n            where: { roomId: roomId },\n            orderBy: { createdAt: "asc" },\n        })\n        res.status(200).json({ message: "Loaded Messages", messages: messages });\n      } catch (error: any) {\n        res.status(500).json(error);\n      }\n      break;\n    default:\n      res.status(405).json({ errof: "Method not allowed" });\n  }\n}\n' }, { "path": "server/subscription", "id": "server/subscription/index", "file": "server/subscription/index.ts", "absPath": "/server/subscription", "__content": `import type { UmiApiRequest, UmiApiResponse } from "umi";
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
` }, { "path": "server/serverList", "id": "server/serverList/index", "file": "server/serverList/index.ts", "absPath": "/server/serverList", "__content": `import type { UmiApiRequest, UmiApiResponse } from "umi";
import pris from "../../../utils/prisma";
import { verifyToken } from "../../../utils/jwt";
import verify from "../../token";
import { Server } from "@prisma/client";


export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  console.log('serverlist')
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
        const subscribedServers = await prisma.userSubscription.findMany({
          where: { userId: user.id },
        });
        let subscribedServerList: (Server | null)[] = [];
        await Promise.all(subscribedServers.map(async server => {
          const serverFound = await prisma.server.findUnique({
            where: { id: server.serverId }
          })
          subscribedServerList.push(serverFound)
          
        }))
        res.status(200).json({ ownedServers, subscribedServerList });
      } catch (error: any) {
        res.status(500).json(error);
      }
      break;
    default:
      res.status(405).json({ errof: "Method not allowed" });
  }
}
` }, { "path": "room/message", "id": "room/message/index", "file": "room/message/index.ts", "absPath": "/room/message", "__content": 'import type { UmiApiRequest, UmiApiResponse } from "umi";\nimport pris from "../../../utils/prisma";\nimport { verifyToken } from "../../../utils/jwt";\n\nexport default async function (req: UmiApiRequest, res: UmiApiResponse) {\n  switch (req.method) {\n    case "POST":\n      try {\n        const prisma = pris;\n        const roomId: number = req.body.roomId;\n        const tok = req.headers.authorization?.split(" ")[1];\n        const token = await verifyToken(tok as string);\n        const message = req.body.message;\n        const user = await prisma.user.findUnique({\n          where: { id: token.id },\n        });\n        if (!user || !token) {\n          res.status(500).json({ message: "Invalid token" });\n          break;\n        }\n        if (req.body.type === "text") {\n          console.log("m", req.body.message);\n          const messageUpdate = await prisma.message.create({\n            data: {\n              roomId: roomId,\n              content: message,\n              userId: user.id,\n              userName: user.name,\n            },\n          });\n        } else {\n          const messageUpdate = await prisma.message.create({\n            data: {\n              roomId: roomId,\n              audio: req.body.message,\n              userId: user.id,\n              userName: user.name,\n              duration: req.body?.duration,\n              type: "audio",\n            },\n          });\n        }\n        res.status(200).json({ message: "Message Saved" });\n      } catch (e: any) {\n        // The .code property can be accessed in a type-safe manner\n        if (e?.code === "P2002") {\n          console.log(\n            "There is a unique constraint violation, a new user cannot be created with this email"\n          );\n        }\n\n        throw e;\n      }\n      break;\n    default:\n      res.status(405).json({ errof: "Method not allowed" });\n  }\n}\n' }, { "path": "server/[serverId]", "id": "server/[serverId]", "file": "server/[serverId].ts", "absPath": "/server/[serverId]", "__content": 'import type { UmiApiRequest, UmiApiResponse } from "umi";\nimport pris from "../../utils/prisma";\ninterface user {\n  id: number;\n}\n\nexport default async function (req: UmiApiRequest, res: UmiApiResponse) {\n  switch (req.method) {\n    case "GET":\n      try {\n        const prisma = pris;\n        const serverId:number = parseInt(req.params.serverId);\n        const rooms = await prisma.room.findMany({\n            where: { serverId: serverId },\n        });\n        res.status(200).json({ ...rooms });\n      } catch (error: any) {\n        res.status(500).json(error);\n      }\n      break;\n    default:\n      res.status(405).json({ errof: "Method not allowed" });\n  }\n}\n' }, { "path": "room/room", "id": "room/room/index", "file": "room/room/index.ts", "absPath": "/room/room", "__content": 'import type { UmiApiRequest, UmiApiResponse } from "umi";\nimport pris from "../../../utils/prisma";\nimport { verifyToken } from "../../../utils/jwt";\n\nexport default async function (req: UmiApiRequest, res: UmiApiResponse) {\n    switch (req.method) {\n        case "PATCH":\n        try {\n            const prisma = pris;\n            const roomId: number = parseInt(req.body.roomId);\n            const tok = req.headers.authorization?.split(" ")[1];\n            const token = await verifyToken(tok as string);\n            const user = await prisma.user.findUnique({\n            where: { id: token.id },\n            });\n            if (!user || !token) {\n            res.status(500).json({ message: "Invalid token" });\n            break;\n            }\n            console.log(token)\n            const joinRoom = await prisma.user.update({\n                where: {\n                    id: user.id\n                },\n                data: {\n                    roomId: roomId\n                }\n            })\n\n            res.status(201).json({ message: "Joined" });\n        } catch (error: any) {\n            res.status(500).json(error);\n        }\n        break;\n        default:\n        res.status(405).json({ errof: "Method not allowed" });\n    }\n}\n' }, { "path": "register", "id": "register/index", "file": "register/index.ts", "absPath": "/register", "__content": 'import type { UmiApiRequest, UmiApiResponse } from "umi";\nimport bcrypt from "bcryptjs";\nimport { signToken } from "../../utils/jwt";\nimport pris from "../../utils/prisma";\n\nexport default async function (req: UmiApiRequest, res: UmiApiResponse) {\n  switch (req.method) {\n    case "POST":\n      try {\n        const prisma = pris;\n\n        const findUser = await prisma.user.findUnique({\n          where: { email: req.body.email },\n        });\n        if (findUser) {\n          res.status(409)\n            .json({ message: "User already exists" });\n          break;\n        }\n        const user = await prisma.user.create({\n          data: {\n            email: req.body.email,\n            passwordHash: bcrypt.hashSync(req.body.password, 8),\n            name: req.body.name,\n            avatarUrl: req.body.avatarUrl,\n          },\n        });\n        const token = await signToken(user.id);\n        const server = await prisma.server.create({\n          data: {\n            userId: user.id,\n            serverName: `${user.name}\'s server`\n          }\n        });\n        const userServers = await prisma.userServers.create({\n          data:{\n            userId: user.id,\n            serverId: server.id,\n          }\n        })\n        res\n          .status(201)\n          .setCookie("token", token)\n          .json({ ...user, passwordHash: undefined, token: token });\n        await prisma.$disconnect();\n      } catch (e: any) {\n        res.status(500).json({\n          result: false,\n          message:\n            typeof e.code === "string"\n              ? "https://www.prisma.io/docs/reference/api-reference/error-reference#" +\n                e.code.toLowerCase()\n              : e,\n        });\n      }\n      break;\n    default:\n      // \u5982\u679C\u4E0D\u662F POST \u8BF7\u6C42\uFF0C\u4EE3\u8868\u4ED6\u6B63\u5728\u7528\u9519\u8BEF\u7684\u65B9\u5F0F\u8BBF\u95EE\u8FD9\u4E2A API\n      res.status(405).json({ error: "Method not allowed" });\n  }\n}\n' }, { "path": "room/new", "id": "room/new/index", "file": "room/new/index.ts", "absPath": "/room/new", "__content": `import type { UmiApiRequest, UmiApiResponse } from "umi";
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
` }, { "path": "server", "id": "server/index", "file": "server/index.ts", "absPath": "/server", "__content": `import type { UmiApiRequest, UmiApiResponse } from "umi";
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
` }, { "path": "login", "id": "login/index", "file": "login/index.ts", "absPath": "/login", "__content": ` import type { UmiApiRequest, UmiApiResponse } from "umi";
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { signToken } from "../../utils/jwt";
import pris from "../../utils/prisma";

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
}` }, { "path": "token", "id": "token/index", "file": "token/index.ts", "absPath": "/token", "__content": `import type { UmiApiRequest, UmiApiResponse } from "umi";
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { verifyToken } from "../../utils/jwt";
import pris from "../../utils/prisma";

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
}` }, { "path": "URL", "id": "URL", "file": "URL.ts", "absPath": "/URL", "__content": "export const API_URL = 'http://localhost:8000';\nexport default API_URL;" }];
var URL_default2 = async (req, res) => {
  const umiReq = new import_apiRoute.UmiApiRequest(req, apiRoutes);
  await umiReq.readBody();
  const umiRes = new import_apiRoute.UmiApiResponse(res);
  await new Promise((resolve) => middlewares_default(umiReq, umiRes, resolve));
  await URL_default(umiReq, umiRes);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
