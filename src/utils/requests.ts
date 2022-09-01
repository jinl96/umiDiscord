import { API_URL } from "../api/URL";

type myRequest = {
  method?: undefined | string;
  url?: string;
  body?: any;
};

type loginBodyType = {
  email: string;
  password: string;
};

interface registerBodyType extends loginBodyType {
  name: string;
}

type verifyType = {
  token: undefined | string;
};

const apiRequest = async ({
  method = undefined,
  url,
  body = undefined,
}: myRequest) => {
  const requestOptions = {
    method: method || "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  };
  try {
    const response = await fetch(`${API_URL}${url}`, requestOptions);
    return response;
  } catch (error) {
    return error;
  }
};

export const login = (body: loginBodyType) => {
  return apiRequest({ method: "POST", url: "/api/login", body: body });
};

export const register = (body: registerBodyType) => {
  return apiRequest({ method: "POST", url: "/api/register", body: body });
};

export const verifyToken = () => {
  return apiRequest({ method: "GET", url: "/api/verify" });
};

export const addServer = (serverName: string) => {
  return apiRequest({
    method: "POST",
    url: "/api/newServer",
    body: { serverName: serverName },
  });
};

export const getServerList = () => {
  return apiRequest({ method: "GET", url: "/api/getServerList" });
};

export const getRoomList = (serverId: number) => {
  return apiRequest({ method: "GET", url: `/api/server/${serverId}` });
};

export const addRoom = (roomName: string, serverId: number) => {
  return apiRequest({
    method: "POST",
    url: "/api/addRoom",
    body: { roomName: roomName, serverId: serverId },
  });
};

export const enterRoom = (roomId: number) => {
    return apiRequest({ method: "POST", url: `/api/room/joinRoom`, body: { roomId: roomId } })
}

export const saveMessage = (roomId:number, message:string) => {
  return apiRequest({ method:'POST', url:`/api/room/sendMessage`, body: { roomId: roomId, message: message } })
}

export const getMessage = (roomId:number) => {
  return apiRequest({ method:'POST', url:`/api/room/getMessage`, body: { roomId: roomId } })
}

export const getTokenForRoomEnter = (userId: number): string => {
  const {
    RtcTokenBuilder,
    RtmTokenBuilder,
    RtcRole,
    RtmRole,
  } = require("agora-access-token");
  const appID = process.env.AGORA_ID;
  const appCertificate = process.env.AGORA_CERTIFICATE;
  const account = userId.toString();

  const expirationTimeInSeconds = 3600;

  const currentTimestamp = Math.floor(Date.now() / 1000);

  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  // Build token with user account
  const token = RtmTokenBuilder.buildToken(
    appID,
    appCertificate,
    account,
    RtmRole.Rtm_user,
    privilegeExpiredTs
  );
  return token;
};
