import { enterRoom, saveMessage, getMessage, getLatestVoiceMessage } from '@/utils/requests';
import { RtmChannel, RtmClient } from 'agora-rtm-sdk';
import { message, Input, Button } from 'antd';
import React, { useState } from 'react'
import { APIResponse } from '../RegisterForm/RegisterForm';
import Recorder from '../Recorder/Recorder';
import ReactAudioPlayer from 'react-audio-player';
import ChatBubble from '../ChatBubble';

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
    duration: number|undefined;
}

type HistoryMessageType = {
    userId: number;
    userName: string;
    content: string;
    audio: string;
    createdAt: string;
    roomId: number;
    type: string;
    duration: number|undefined;
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
export type setVoiceDurationType = React.Dispatch<React.SetStateAction<number>>;

const ChatPanel: React.FC<Props> = ({ userId, selectedRoomId, selectedRoomName, chatClient, userName }): JSX.Element => {

    const [userInput, setUserInput] = useState<string>('');
    const [channel, setChannel] = useState<RtmChannel | undefined>(void 0);
    const [historyMessages, setHistoryMessages] = useState<HistoryMessageType[]>([]);
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [voiceMessage, setVoiceMessage] = useState<string>();
    const [voice, setVoice] = useState<string>();
    const [voiceDuration, setVoiceDuration] = useState<number>(0);

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
                                            setMessages(prev => [...prev, { ...content, type: 'audio', audio: data.messages.audio,text:undefined, duration:voiceDuration }])
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

    React.useEffect(() => {
        if (!selectedRoomId) return;
        if (!channel) return;
        if (voiceMessage) {
            (async () => {
                const saveMessageToDb = await saveMessage(selectedRoomId, voiceMessage, 'audio', voiceDuration) as unknown as APIResponse;
                setMessages(prev => [...prev, { userId, userName: userName, text: undefined, type: 'audio', audio: voiceMessage, duration: voiceDuration }]);
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
        setMessages(prev => [...prev, { userId, userName: userName, text: inp, type: 'text', audio: undefined, duration: undefined}]);
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
                                <ChatBubble type={message.type} audio={message.audio} duration={message.duration}
                                userName={message.userName} key={`voice${index}`} text={undefined} userId={0} setVoice={setVoice}/>
                
                            )
                        }
                        return (
                            <ChatBubble type={message.type}  audio={message.audio} duration={message.duration}
                            userName={message.userName} key={`text${index}`} text={message.content} userId={0} setVoice={void 0}/>
                        )
                    })
                }
                {messages.map((message, index) => {
                    if (message?.type === 'audio') {
                        return (
                            <ChatBubble type={message.type} audio={message.audio} duration={message.duration}
                            userName={message.userName} key={`voice${index}`}  text={undefined} userId={0} setVoice={setVoice}/>
                        )
                    }
                    return (
                        <ChatBubble type={message.type}  audio={message.audio} duration={message.duration}
                        userName={message.userName} key={`text${index}`} text={message.text} userId={0} setVoice={void 0}/>
                    )
                }
                )}
            </div>
            <Input className="pl-3" style={{ height: '50px' }} placeholder="Type your message" value={userInput} onPressEnter={handleSubmit} onChange={(e) => setUserInput(e.target.value)} />
            <Recorder setVoiceMessage={setVoiceMessage as setVoiceMessageType} setVoiceDuration={setVoiceDuration as setVoiceDurationType}></Recorder>
            <ReactAudioPlayer src={voice} autoPlay controls></ReactAudioPlayer>
        </div>
    )
}

export default ChatPanel

function duration(selectedRoomId: number, voiceMessage: string, arg2: string, duration: any, voiceDuration: number): unknown {
    throw new Error('Function not implemented.');
}
