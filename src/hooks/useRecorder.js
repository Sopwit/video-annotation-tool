import { useState, useRef, useCallback } from 'react';

const useRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const activeStreamRef = useRef(null);

    const startRecording = useCallback(async (stream) => {
        if (!stream) {
            console.error('No stream provided');
            return;
        }

        try {
            const mimeTypes = [
                'video/webm;codecs=vp9,opus',
                'video/webm;codecs=vp8,opus',
                'video/webm',
            ];

            const supportedMimeType = mimeTypes.find((type) => MediaRecorder.isTypeSupported(type));
            const mediaRecorder = supportedMimeType
                ? new MediaRecorder(stream, { mimeType: supportedMimeType })
                : new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            activeStreamRef.current = stream;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error('Error starting recording:', err);
        }
    }, []);

    const stopRecording = useCallback(() => {
        return new Promise((resolve) => {
            const mediaRecorder = mediaRecorderRef.current;
            if (!mediaRecorder || mediaRecorder.state === 'inactive') {
                resolve(null);
                return;
            }

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'video/webm' });
                setIsRecording(false);
                activeStreamRef.current?.getTracks().forEach((track) => track.stop());
                activeStreamRef.current = null;
                resolve(blob);
            };

            mediaRecorder.stop();
        });
    }, []);

    const saveRecording = useCallback((blob, filename) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style = 'display: none';
        a.href = url;
        a.download = filename.endsWith('.webm') ? filename : `${filename}.webm`;
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }, []);

    return {
        isRecording,
        startRecording,
        stopRecording,
        saveRecording
    };
};

export default useRecorder;
