import React, { useState } from 'react'
import { Button } from 'antd'



interface Props {
    type: string;
    text: string | undefined;
    audio: string | undefined;
    duration: number | undefined;
    userId: number;
    userName: string;
    setVoice: undefined | ((voice: string) => void);
}



const index: React.FC<Props> = ({ type, text, audio, duration, userId, userName, setVoice }: Props) => {
    const [voiceDuration, setVoiceDuration] = useState<number | undefined>(duration);
    const timer = React.useRef<NodeJS.Timeout>();

    const voiceSet = () => {
        if (setVoice && voiceDuration) {
            setVoice(audio as string);
            timer.current = setInterval(() => {
                if (voiceDuration >= 0) {
                    setVoiceDuration((prev) => prev ? prev - 1 : 0)
                }
            },1000)
        }
    }

    React.useEffect(() => {
        if (voiceDuration === 0) {
            setTimeout(() => {
                clearInterval(timer.current as NodeJS.Timeout)
                setVoiceDuration(duration)
            }, 1000);
        }
    }, [voiceDuration])


    if (type === 'audio') {
        return (
            <div className='flex flex-row'>
                <p className='font-bold'>{userName}:</p>
                <Button onClick={voiceSet}>audio {voiceDuration}</Button>
            </div>
        )
    } else {
        return (
            <div className='flex flex-row'>
                <p className='font-bold'>{userName}:</p>
                <p className='pl-2'>{text}</p>
            </div>
        )
    }
}

export default index