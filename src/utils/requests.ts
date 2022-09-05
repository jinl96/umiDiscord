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
      'Content-Type': 'application/json;charset=utf-8',
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
  return apiRequest({ method: "GET", url: "/api/token" });
};

export const addServer = (serverName: string) => {
  return apiRequest({
    method: "POST",
    url: "/api/server",
    body: { serverName: serverName },
  });
};

export const getServerList = () => {
  return apiRequest({ method: "GET", url: "/api/server/serverList" });
};

export const getRoomList = (serverId: number) => {
  return apiRequest({ method: "GET", url: `/api/server/${serverId}` });
};

export const addRoom = (roomName: string, serverId: number) => {
  return apiRequest({
    method: "POST",
    url: "/api/room/new",
    body: { roomName: roomName, serverId: serverId },
  });
};

export const enterRoom = (roomId: number) => {
    return apiRequest({ method: "PATCH", url: `/api/room/room`, body: { roomId: roomId } })
}

export const saveMessage = (roomId:number, message:string|Blob, type:string='text') => {
    return apiRequest({ method:'POST', url:`/api/room/message`, body: { roomId, message, type:type } })
}

export const getMessage = (roomId:number) => {
  return apiRequest({ method:'POST', url:`/api/room/historyMessage`, body: { roomId: roomId } })
}

export const getLatestVoiceMessage = (roomId:number) => {
  return apiRequest({ method:'GET', url:`/api/room/voiceMessage/${roomId}` })
}

export const serverSubscription = (serverId: number) => {
  return apiRequest({ method: "POST", url: "/api/server/subscription", body: { serverId: serverId } });
}

export const getTokenForUser = (userId: number): string => {
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
