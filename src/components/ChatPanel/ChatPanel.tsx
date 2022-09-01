import { enterRoom, getTokenForRoomEnter } from '@/utils/requests';
import { RtmChannel, RtmClient } from 'agora-rtm-sdk';
import { message } from 'antd';
import { resolveOnChange } from 'antd/lib/input/Input';
import React from 'react'
import { APIResponse } from '../RegisterForm/RegisterForm';

type Props = {
    selectedRoomId: number | undefined;
    selectedRoomName: string | undefined;
    userId: number;
}

const ChatPanel: React.FC<Props> = ({ userId, selectedRoomId, selectedRoomName }): JSX.Element => {

    React.useEffect(() => {
        let client: RtmClient;
        let channel: RtmChannel;
        if (selectedRoomId) {
            (async () => {
                try {
                    const res = await enterRoom(selectedRoomId) as APIResponse;
                    if (res.ok) {
                        const { default: AgoraRTM } = await import('agora-rtm-sdk');
                        const token = getTokenForRoomEnter(userId);
                        client = AgoraRTM.createInstance(process.env.AGORA_ID!)
                        const uid = userId.toString();
                        await client.login({ uid: uid, token: token });
                        channel = client.createChannel(selectedRoomId.toString()!);
                        await channel.join();
                        const text = 'hi there'
                        setInterval(() => {
                            channel.sendMessage({
                                text:'testing'
                            }).then(

                            ).catch(error=>console.log(error))
                        }, 1000);
                        channel.on('ChannelMessage', (message, peerId) => {
                            console.log('message in')
                            console.log(message);
                        })
                    }
                } catch (error) {
                    message.warning('Something went wrong', 2)
                }
            })()
            return () => {
                if (client && channel) {
                    channel?.leave();
                    client?.logout();
                }
            }
        }
    }, [selectedRoomId])

    return (
        <div>
            <h2>{selectedRoomName}</h2>
        </div>
    )
}

export default ChatPanel