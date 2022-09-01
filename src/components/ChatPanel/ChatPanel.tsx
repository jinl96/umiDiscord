import { enterRoom, getTokenForRoomEnter, saveMessage, getMessage } from '@/utils/requests';
import { RtmChannel, RtmClient } from 'agora-rtm-sdk';
import { message, Input } from 'antd';
import { resolveOnChange } from 'antd/lib/input/Input';
import React, { useState } from 'react'
import { APIResponse } from '../RegisterForm/RegisterForm';

type Props = {
    selectedRoomId: number | undefined;
    selectedRoomName: string | undefined;
    userId: number;
    chatClient: RtmClient;
    userName: string;
}

type MessageType = {
    userId: number;
    userName: string;
    text: string;
}

type HistoryMessageType = {
    userId: number;
    userName: string;
    content: string;
    createdAt: string;
    roomId: number;
}

type GetMessageResponse = {
    message: string;
    messages: HistoryMessageType[];
}

const ChatPanel: React.FC<Props> = ({ userId, selectedRoomId, selectedRoomName, chatClient, userName }): JSX.Element => {

    const [userInput, setUserInput] = useState<string>('');
    const [channel, setChannel] = useState<RtmChannel | undefined>(void 0);
    const [historyMessages, setHistoryMessages] = useState<HistoryMessageType[]>([]);
    const [messages, setMessages] = useState<MessageType[]>([]);

    React.useEffect(() => {
        let channel: RtmChannel;
        if (selectedRoomId) {
            (async () => {
                try {
                    const getMessageReq = await getMessage(selectedRoomId) as APIResponse;
                    console.log(getMessageReq)
                    if (getMessageReq.ok) {
                        const data = await getMessageReq.json() as unknown as GetMessageResponse;
                        console.log(data)
                        setHistoryMessages(data.messages);
                    }
                    const res = await enterRoom(selectedRoomId) as APIResponse;
                if (res.ok) {
                    const client = chatClient;
                    channel = client.createChannel(selectedRoomId.toString()!);
                    await channel.join();
                    setChannel(channel);
                    const text = 'hi there'
                    channel.on('ChannelMessage', (message, peerId) => {
                        console.log('got message')
                        setMessages(prev => [...prev, JSON.parse(message.text!)]);
                    })
                }
            } catch (error) {
                message.warning('Something went wrong', 2)
            }
        })()
    return () => {
        if (chatClient && channel) {
            channel?.leave();
        }
    }
}
    }, [selectedRoomId])
    console.log(historyMessages);

const handleSubmit = async () => {
    if (!selectedRoomId) return;
    if (!channel) return;
    const inp = userInput;
    setUserInput('');
    channel.sendMessage({ text: JSON.stringify({ userId: userId, text: inp, userName: userName }) });
    setMessages(prev => [...prev, { userId, userName: userName, text: inp }]);
    const saveMessageToDb = await saveMessage(selectedRoomId, inp);
    console.log(saveMessageToDb)
}

return (
    <div className='flex flex-col'>
        <h2>{selectedRoomName}</h2>
        <div className="h-1/2 w-full ml-3 border-2 border-slate-400" style={{ minWidth: '600px' }} >
            {   
                historyMessages.map((message, index) => {
                    return (
                        <div key={index} className='flex flex-row'>
                            <p className='font-bold'>{message.userName}:</p>
                            <p className='ml-2'>{message.content}</p>
                        </div>
                    )
                })
            }
                {messages.map((message, index) => {
                    return (
                        <div key={index} className='flex flex-col items-start'>
                            <div className='flex items-center'>
                                <p className='font-bold'>{message.userName}:</p>
                            <p className='ml-2'>{message.text}</p>
                            </div>
                            <div className='flex-1'></div>
                        </div>
                    )
                }
                )}
        </div>
        <Input className="ml-3" style={{ height: '50px' }} placeholder="Type your message" value={userInput} onPressEnter={handleSubmit} onChange={(e) => setUserInput(e.target.value)} />
    </div>
)
}

export default ChatPanel