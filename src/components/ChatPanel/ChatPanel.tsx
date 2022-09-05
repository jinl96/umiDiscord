import { enterRoom, saveMessage, getMessage, getLatestVoiceMessage } from '@/utils/requests';
import { RtmChannel, RtmClient } from 'agora-rtm-sdk';
import { message, Input, Button } from 'antd';
import { resolveOnChange } from 'antd/lib/input/Input';
import React, { useState } from 'react'
import { APIResponse } from '../RegisterForm/RegisterForm';
import Recorder from '../Recorder/Recorder';
import ReactAudioPlayer from 'react-audio-player';


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
    text: string|undefined;
    audio: string|undefined;
    type: string;
}

type HistoryMessageType = {
    userId: number;
    userName: string;
    content: string;
    audio: string;
    createdAt: string;
    roomId: number;
    type: string;
}

type GetMessageResponse = {
    message: string;
    messages: HistoryMessageType[];
}

type GetVoiceResponse = {
    ok: boolean;
    json: () => Promise<unknown>;

}

export type setVoiceMessageType = React.Dispatch<React.SetStateAction<string | undefined>>;

const ChatPanel: React.FC<Props> = ({ userId, selectedRoomId, selectedRoomName, chatClient, userName }): JSX.Element => {

    const [userInput, setUserInput] = useState<string>('');
    const [channel, setChannel] = useState<RtmChannel | undefined>(void 0);
    const [historyMessages, setHistoryMessages] = useState<HistoryMessageType[]>([]);
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [voiceMessage, setVoiceMessage] = useState<string>();
    const [voice, setVoice] = useState<string>();

    React.useEffect(() => {
        let channel: RtmChannel;
        if (selectedRoomId) {
            setMessages([]);
            setHistoryMessages([]);
            (async () => {
                try {
                    const getMessageReq = await getMessage(selectedRoomId) as APIResponse;
                    if (getMessageReq.ok) {
                        const data = await getMessageReq.json() as unknown as GetMessageResponse;
                        setHistoryMessages(data.messages);
                    }
                    const res = await enterRoom(selectedRoomId) as APIResponse;
                    if (res.ok) {
                        const client = chatClient;
                        channel = client.createChannel(selectedRoomId.toString()!);
                        await channel.join();
                        setChannel(channel);
                        channel.on('ChannelMessage', (message, peerId) => {
                            const content = JSON.parse(message.text!)
                            if (content.text === `${process.env.VOICE_KEY}newVoice${selectedRoomId}`) {
                                getLatestVoiceMessage(selectedRoomId).then((res: any) => {
                                    console.log(res);
                                    if (res?.ok) {
                                        res.json().then((data: any) => {
                                            console.log(data);
                                            setMessages(prev => [...prev, { ...content, type: 'audio', audio: data.messages.audio,text:undefined }])
                                        })
                                    }
                                }).catch((err) => {
                                    console.log(err)
                                })
                            }
                            else { setMessages(prev => [...prev, { ...content, type: 'text' }]) }
                        })
                    }
                } catch (error) {
                    console.log(error)
                }
            })()
            return () => {
            }
        }
    }, [selectedRoomId])

    console.log(voice);

    React.useEffect(() => {
        if (!selectedRoomId) return;
        if (!channel) return;
        if (voiceMessage) {
            (async () => {
                const saveMessageToDb = await saveMessage(selectedRoomId, voiceMessage, 'audio') as unknown as APIResponse;
                setMessages(prev => [...prev, { userId, userName: userName, text: undefined, type: 'audio', audio: voiceMessage }]);
                channel.sendMessage({ text: JSON.stringify({ userId: userId, text: `${process.env.VOICE_KEY}newVoice${selectedRoomId}`, userName: userName }) });
            })()
        }
    }, [voiceMessage])

    const handleSubmit = async () => {
        if (!selectedRoomId) return;
        if (!channel) return;
        const inp = userInput;
        setUserInput('');
        channel.sendMessage({ text: JSON.stringify({ userId: userId, text: inp, userName: userName }) });
        setMessages(prev => [...prev, { userId, userName: userName, text: inp, type: 'text', audio: undefined }]);
        const saveMessageToDb = await saveMessage(selectedRoomId, inp);
    }

    return (
        <div className='flex flex-col w-full h-full overflow-auto text-center'>
            <h1 className='text-2xl'>{selectedRoomName}</h1>
            <div className="h-1/2 pl-3 border-2 flex-1 w-full border-slate-400">
                {
                    historyMessages.map((message, index) => {
                        if (message?.type === 'audio') {
                            return (
                                <div key={index} className='flex flex-row'>
                                    <p className='font-bold'>{message.userName}:</p>
                                    <Button onClick={() => setVoice(message.audio)}>audio</Button>
                                </div>
                            )
                        }
                        return (
                            <div key={index} className='flex flex-row'>
                                <p className='font-bold'>{message.userName}:</p>
                                <p className='pl-2'>{message.content}</p>
                            </div>
                        )
                    })
                }
                {messages.map((message, index) => {
                    if (message?.type === 'audio') {
                        return (
                            <div key={index} className='flex flex-row'>
                                <p className='font-bold'>{message.userName}:</p>
                                <Button onClick={() => setVoice(message.audio)}>audio</Button>
                            </div>
                        )
                    }
                    return (
                        <div key={index} className='flex flex-col items-start'>
                            <div className='flex items-center'>
                                <p className='font-bold'>{message.userName}:</p>
                                <p className='pl-2'>{message.text}</p>
                            </div>
                            <div className='flex-1'></div>
                        </div>
                    )
                }
                )}
            </div>
            <Input className="pl-3" style={{ height: '50px' }} placeholder="Type your message" value={userInput} onPressEnter={handleSubmit} onChange={(e) => setUserInput(e.target.value)} />
            <Recorder setVoiceMessage={setVoiceMessage as setVoiceMessageType}></Recorder>
            <ReactAudioPlayer src={voice} autoPlay></ReactAudioPlayer>
        </div>
    )
}

export default ChatPanel