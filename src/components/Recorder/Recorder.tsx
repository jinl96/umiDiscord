import { blobUrlToBase64, blobUrlToObject} from "@/utils/helpers";
import { Button } from "antd";
import React, { useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import ReactAudioPlayer from 'react-audio-player';
import { setVoiceMessageType } from "../ChatPanel/ChatPanel";

type Props = {
    setVoiceMessage: setVoiceMessageType;
}


const Recorder: React.FC<Props> = ({setVoiceMessage}) => {
    const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ audio: true });
    const [recordingBase64, setRecordingBase64] = useState<string>('');

    const sendRecording = async () => {
        try {
            const base64 = await blobUrlToBase64(mediaBlobUrl as string);
            const blobObj = await blobUrlToObject(mediaBlobUrl as string);
            setRecordingBase64(base64 as string);
            setVoiceMessage(base64 as string);
        } catch (error) {
            console.log(error)
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
                onPointerDown={startRecording}
                onPointerUp={stopRecording}
            >
                Hold to Record Voice Message
            </Button>
            {/* <ReactAudioPlayer src={recordingBase64} autoPlay/> */}
        </div>
    );
}

export default Recorder;