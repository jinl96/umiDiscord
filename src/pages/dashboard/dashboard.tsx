import React, { useState, useRef } from 'react';
import styles from './dashboard.less';
import { addServer, verifyToken, getServerList, getRoomList, addRoom, getTokenForUser, serverSubscription } from '@/utils/requests';
import { message, Button, Modal, Input } from 'antd';
import { Navigate, useNavigate } from 'umi';
import { RtmChannel, RtmClient } from 'agora-rtm-sdk';
import ChatPanel from '@/components/ChatPanel/ChatPanel';

interface APIResponse {
  ok: string,
  status: number,
  json: () => Promise<UserType>
}

type UserType = {
  id?: number,
  email?: string;
  name?: string;
  avatarUrl?: null | string;
}

type RoomType = {
  id: number,
  name: string,
  serverId: number,
  Server?: ServerType,
  Messages?: string[],
  Users?: string[]
}

interface RoomListType {
  [key: string]: RoomType;
}

type ServerType = {
  id: number;
  userId: number;
  serverName: string;
}

interface serverListResponseType {
  ownedServers: ServerType[];
  subscribedServerList: ServerType[];
}

interface ServerListType {
  [key: string]: ServerType;
}


export default function Dashboard() {
  const [user, setUser] = useState<UserType>({});
  // server modal
  const [serverName, setServerName] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  // room modal
  const [roomModalVisible, setRoomModalVisible] = useState<boolean>(false);
  const [roomName, setRoomName] = useState<string>('');
  // server list
  const [serverList, setServerList] = useState<Array<ServerType>>([]);
  const [subscribedServerList, setSubscribedServerList] = useState<Array<ServerType>>([]);
  // room list
  const [roomList, setRoomList] = useState<Array<RoomType>>([]);

  //selection
  const [selectedServerId, setSelectedServerId] = useState<number | undefined>(void 0);
  const [selectedRoomId, setSelectedRoomId] = useState<number | undefined>(void 0);

  const [chatUserClient, setChatUserClient] = useState<RtmClient>();

  const [serverSubInput, setServerSubInput] = useState<number>()

  const selectedRoomName:string|undefined = React.useMemo(() => {  
    let room = roomList.find(item => item.id === selectedRoomId)
    if (room) {
      return room.name
    }
  }, [selectedRoomId])



  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (selectedServerId) {
      updateRoomList();
    }
  }, [selectedServerId, setSelectedServerId])

  React.useEffect(() => {
    const tok = localStorage.getItem('token') as string;
    console.log(process.env);
    if (tok) {
      (async () => {
        try {
          const res = await verifyToken() as APIResponse;
          if (res.ok) {
            res.json().then(async res => {
              setUser(res);
              const { default: AgoraRTM } = await import('agora-rtm-sdk');
              const token = getTokenForUser(res.id!);
              const client = AgoraRTM.createInstance(process.env.AGORA_ID!);
              setChatUserClient(client);
              const uid = res.id!.toString();
              await client.login({ uid, token })
            })
          } else {
            message.warning('Please Log in', 2)
            navigate('/login')
          }
        } catch (error: any) {
          message.warning('Please Log in', 2)
          navigate('/login')
        }
      })();
      updateServerList();
    }
  }, [])

  const updateRoomList = async () => {
    if (!selectedServerId) {
      return
    }
    try {
      const res = await getRoomList(selectedServerId) as APIResponse;
      if (res.ok) {
        const rList = await res.json() as RoomListType;
        let newRoomList = [] as Array<RoomType>;
        Object.values(rList).forEach(room => {
          newRoomList.push(room);
        })
        setRoomList(newRoomList);
      } else {
        message.warning('Something went wrong', 2)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const updateServerList = async () => {
    try {
      const res = await getServerList() as APIResponse;
      const servers = await res.json() as serverListResponseType;
      let ownedSerList = [] as Array<ServerType>;
      let subscribedSerList = [] as Array<ServerType>;
      Object.values(servers.ownedServers).forEach((server) => {
        ownedSerList.push(server);
      })
      Object.values(servers.subscribedServerList).forEach((server) => {
        subscribedSerList.push(server);
      })
      setServerList(ownedSerList);
      setSubscribedServerList(subscribedSerList);
    } catch (error: any) {
      message.warning(error, 2)
    }
  }

  const addNewServer = async () => {
    const res = await addServer(serverName) as APIResponse;
    if (res.ok) {
      message.success('Server added successfully', 2)
      setModalVisible(false);
      setServerName('');
      updateServerList();
    } else {
      message.warning('Something went wrong', 2)
    }
  }

  const addNewRoom = async () => {
    if (roomName === '') {
      message.warning('Room name cannot be empty', 2)
      return;
    }
    if (!selectedServerId) {
      message.warning('Please select a server to add to', 2)
      return;
    }
    const res = await addRoom(roomName, selectedServerId) as APIResponse;
    if (res.ok) {
      message.success('Room added successfully', 2)
      setRoomModalVisible(false);
      setRoomName('');
      updateRoomList();
    } else {
      message.warning('Something went wrong', 2)
    }
  }

  const enterSelectedRoom = (roomId: number) => {
    setSelectedRoomId(roomId);
    if (typeof user?.id === 'number') {
      console.log(getTokenForUser(user.id));
    }
  }

  const subscribeToServer = async () => {
    if (!serverSubInput) {
      return
    }
    try {
      const res = await serverSubscription(serverSubInput) as APIResponse;
      if (res.ok) {
        message.success('Server subscribed successfully', 2)
        setServerSubInput(undefined);
        updateServerList();
      } else {
        message.warning('Already Subscribed', 2)
      }
    } catch (error: any) {
      message.warning(error, 2)
    }
  }

  if (typeof user?.id === 'number') {
    return (
      <div className='min-h-screen flex flex-col overflow-auto'>
        <div className='fixed min-h-50 min-w-150 top-1/2 left-1/2'>
          <Modal onCancel={() => {
            setModalVisible(!modalVisible)
            setServerName('')
          }}
            onOk={addNewServer}
            okType='default' style={{ maxWidth: '400px' }} visible={modalVisible} closable>
            Server Name<Input onChange={(e) => setServerName(e.target.value)} value={serverName} className='w-56 ml-2'></Input>
          </Modal>
        </div>
        <div className='fixed min-h-50 min-w-150 top-1/2 left-1/2'>
          <Modal onCancel={() => {
            setRoomModalVisible(!roomModalVisible)
            setRoomName('')
          }}
            onOk={addNewRoom}
            okType='default' style={{ maxWidth: '400px' }} visible={roomModalVisible} closable>
            Room Name<Input onChange={(e) => setRoomName(e.target.value)} value={roomName} className='w-56 ml-2'></Input>
          </Modal>
        </div>
        <div style={{ width: '100%' }}>
          <h1 className={styles.title}>Welcome, {user.name}({user.email})</h1>
          <Input style={{ width: '100px' }} 
            onChange={(e) => {
              if (typeof parseInt(e.target.value) === 'number') {
              setServerSubInput(parseInt(e.target.value))
              }
              }
            } 
            value={serverSubInput} 
            placeholder='enter server id'>
          </Input>
          <Button onClick={subscribeToServer}>subscribe</Button>
          <div className='h-5 ml-3'>
          {selectedServerId &&  `You are in server: ${selectedServerId}` }
          </div>
        </div>
        <div className='flex flex-row flex-1'>
          <div className='flex flex-col items-center min-h-full bg-indigo-100' style={{ width:'75px' }}>
            Servers
            <div className='flex mt-1 mb-1 flex-col justify-center align-center items-center rounded-full bg-yellow-200 h-14 w-14'>
              <svg onClick={() => setModalVisible(!modalVisible)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            {
              serverList.map((server) => {
                let color
                server.id === selectedServerId ? color = 'bg-indigo-400' : color = 'bg-sky-500/50';
                return (
                  <div key={server.id}
                    onClick={() => {
                      setSelectedServerId(server.id)
                      // setSelectedRoomId(void 0)
                    }} className={`cursor-pointer p-3 flex mt-1 mb-1 flex-col justify-center text-center items-center rounded-full ${color} h-14 w-14`}>
                    {server.serverName}
                  </div>)
              })

            }
            {
              subscribedServerList.map((server) => {
                let color
                server.id === selectedServerId ? color = 'bg-indigo-400' : color = 'bg-sky-500/50';
                return (
                  <div key={server.id}
                    onClick={() => {
                      setSelectedServerId(server.id)
                      // setSelectedRoomId(void 0)
                    }} className={`cursor-pointer p-3 flex mt-1 mb-1 flex-col justify-center text-center items-center rounded-full ${color} h-14 w-14`}>
                    {server.serverName}
                  </div>)
              })
            }
          </div>
          <div className='flex flex-col align-start items-center min-h-full min-w-min w-2/12 bg-neutral-300' style={{ minWidth: '100px' }}>
            Rooms
            <div className='flex mt-1 mb-1 flex-col justify-center items-center rounded-full bg-yellow-200 h-20 w-20'>
              <svg onClick={() => setRoomModalVisible(!roomModalVisible)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            {
              roomList.map((room) => {
                let color;
                room.id === selectedRoomId ? color = 'bg-indigo-400' : color = 'bg-sky-500/50';
                return (
                  <div key={room.id} onClick={() => enterSelectedRoom(room.id)} className={`flex cursor-pointer mt-1 mb-1 p-5 flex-col justify-center items-center ${color} h-20 w-full`}>
                    {room.name}
                  </div>)
              })
            }
          </div>
          <div className='flex min-h-full w-full p-5'>
            <ChatPanel userName={user.name!} chatClient={chatUserClient!} userId={user.id} selectedRoomId={selectedRoomId} selectedRoomName={selectedRoomName}></ChatPanel>
          </div>
        </div>
      </div>
    );
  }
  return (<></>)
}
