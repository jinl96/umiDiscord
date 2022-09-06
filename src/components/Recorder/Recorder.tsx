import { blobUrlToBase64, blobUrlToObject } from "@/utils/helpers";
import { Button } from "antd";
import React, { useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { useStopwatch, useTimer } from 'react-timer-hook';
import { setVoiceMessageType, setVoiceDurationType } from "../ChatPanel/ChatPanel";

type Props = {
    setVoiceMessage: setVoiceMessageType;
    setVoiceDuration: setVoiceDurationType;
}


const Recorder: React.FC<Props> = ({ setVoiceMessage, setVoiceDuration }) => {
    const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ audio: true });
    const [recordingBase64, setRecordingBase64] = useState<string>('');
    const [recordDuration, setRecordDuration] = useState<number>(0);
    const { seconds, minutes, hours, start, pause, reset } = useStopwatch({ autoStart: false });

    const sendRecording = async () => {
        try {
            const base64 = await blobUrlToBase64(mediaBlobUrl as string);
            const blobObj = await blobUrlToObject(mediaBlobUrl as string);
            setRecordingBase64(base64 as string);
            setVoiceMessage(base64 as string);
            setVoiceDuration(seconds);
            reset()
            pause()
        } catch (error) {
            console.log(error)
            reset()
            pause()
        }
    }
    React.useEffect(() => {
        if (status === 'stopped') {
            sendRecording()
        }
    }, [mediaBlobUrl])

    return (
        <div>
            <Button
                onPointerDown=
                {() => {
                    startRecording()
                    start()
                }}
                onPointerUp=
                {() => {
                    stopRecording()
                }}
            >
                Hold to Record Voice Message
            </Button>
        </div>
    );
}

export default Recorder;