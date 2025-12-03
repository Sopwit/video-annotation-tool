import React, { forwardRef, useState, useEffect, useRef, useImperativeHandle } from 'react';

const VideoPlayer = forwardRef(({ videoUrl, isPlaying, onProgress, onDuration }, ref) => {
    const [status, setStatus] = useState('idle');
    const videoRef = useRef(null);
    const iframeRef = useRef(null);
    
    // Timer for YouTube simulation
    const [simulatedTime, setSimulatedTime] = useState(0);
    const timerRef = useRef(null);

    // Extract YouTube video ID
    const getYouTubeId = (url) => {
        if (!url) return null;
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
        return match ? match[1] : null;
    };

    const youtubeId = getYouTubeId(videoUrl);
    const isYouTube = !!youtubeId;

    // Combine refs and expose methods
    useImperativeHandle(ref, () => {
        if (isYouTube) {
            return {
                play: () => {
                    if (iframeRef.current) {
                        iframeRef.current.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                    }
                },
                pause: () => {
                    if (iframeRef.current) {
                        iframeRef.current.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                    }
                },
                seekTo: (time) => {
                     if (iframeRef.current) {
                        iframeRef.current.contentWindow.postMessage(JSON.stringify({
                            "event": "command",
                            "func": "seekTo",
                            "args": [time, true]
                        }), '*');
                        setSimulatedTime(time); // Sync timer
                    }
                },
                getCurrentTime: () => simulatedTime // Return our timer
            };
        }
        
        // Native Video Wrapper
        return {
            play: () => videoRef.current?.play(),
            pause: () => videoRef.current?.pause(),
            seekTo: (time) => {
                if (videoRef.current) videoRef.current.currentTime = time;
            },
            getCurrentTime: () => videoRef.current ? videoRef.current.currentTime : 0,
            videoElement: videoRef.current
        };
    }, [isYouTube, simulatedTime]);

    // Native Video Control Effect
    useEffect(() => {
        if (!isYouTube && videoRef.current) {
            if (isPlaying) {
                videoRef.current.play().catch(e => console.error("Play error:", e));
            } else {
                videoRef.current.pause();
            }
        }
    }, [isPlaying, isYouTube]);

    // YouTube Timer Logic (Simulation)
    useEffect(() => {
        if (isYouTube && isPlaying) {
            timerRef.current = setInterval(() => {
                setSimulatedTime(prev => {
                    const newTime = prev + 1;
                    // Report progress to parent for slider
                    if (onProgress) {
                        onProgress({ playedSeconds: newTime });
                    }
                    return newTime;
                });
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isYouTube, isPlaying, onProgress]);

    // Reset timer on URL change
    useEffect(() => {
        setSimulatedTime(0);
    }, [videoUrl]);

    const handleTimeUpdate = () => {
        const video = videoRef.current;
        if (video && onProgress) {
            onProgress({
                played: video.currentTime / (video.duration || 1),
                playedSeconds: video.currentTime
            });
        }
    };

    const handleLoadedMetadata = () => {
        const video = videoRef.current;
        setStatus('ready');
        if (video && onDuration) {
            onDuration(video.duration);
        }
    };

    // YouTube Player (Iframe)
    if (isYouTube) {
        return (
            <div className="relative w-full h-full bg-black/90 overflow-hidden rounded-2xl shadow-2xl border border-white/10 flex items-center justify-center">
                <iframe
                    ref={iframeRef}
                    src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=0&controls=1&modestbranding=1&rel=0&showinfo=0&enablejsapi=1`}
                    className="w-full h-full absolute top-0 left-0 z-10"
                    style={{ border: 'none' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        );
    }

    // Native Video Player
    return (
        <div className="relative w-full h-full bg-black/90 overflow-hidden rounded-2xl shadow-2xl border border-white/10 flex items-center justify-center">
            {videoUrl ? (
                <video
                    ref={videoRef}
                    className="w-full h-full object-contain"
                    controls
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    crossOrigin="anonymous"
                >
                    <source src={videoUrl} type="video/mp4" />
                    <source src={videoUrl} type="video/webm" />
                    <source src={videoUrl} type="video/ogg" />
                    Your browser does not support video playback.
                </video>
            ) : (
                <div className="flex flex-col items-center justify-center text-white/30 gap-4">
                    <div className="w-16 h-16 rounded-full border-2 border-white/10 flex items-center justify-center">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-sm font-medium tracking-wide">Enter Video URL</p>
                </div>
            )}
        </div>
    );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
