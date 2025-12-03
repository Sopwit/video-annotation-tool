import React, { forwardRef, useState, useEffect } from 'react';

const VideoPlayer = forwardRef(({ videoUrl, isPlaying, onProgress, onDuration }, ref) => {
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState(null);
    const videoRef = React.useRef(null);
    const iframeRef = React.useRef(null);

    // Extract YouTube video ID from various URL formats
    const getYouTubeId = (url) => {
        if (!url) return null;
        
        // youtu.be format
        const match1 = url.match(/youtu\.be\/([^?&]+)/);
        if (match1) return match1[1];
        
        // youtube.com/watch?v= format
        const match2 = url.match(/youtube\.com\/watch\?v=([^&]+)/);
        if (match2) return match2[1];
        
        // youtube.com/embed/ format
        const match3 = url.match(/youtube\.com\/embed\/([^?&]+)/);
        if (match3) return match3[1];
        
        return null;
    };

    const youtubeId = getYouTubeId(videoUrl);
    const isYouTube = !!youtubeId;

    // Combine refs
    React.useImperativeHandle(ref, () => {
        if (isYouTube) {
            return {
                play: () => {
                    if (iframeRef.current) {
                        iframeRef.current.style.pointerEvents = 'auto';
                    }
                },
                pause: () => {
                    if (iframeRef.current) {
                        iframeRef.current.style.pointerEvents = 'none';
                    }
                },
                seekTo: () => {},
                currentTime: 0,
                duration: 0
            };
        }
        return videoRef.current;
    }, [isYouTube]);

    useEffect(() => {
        if (!isYouTube && videoRef.current) {
            if (isPlaying) {
                videoRef.current.play().catch(e => {
                    console.error("Play error:", e);
                    setError(e.message);
                });
            } else {
                videoRef.current.pause();
            }
        }
    }, [isPlaying, isYouTube]);

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

    const handleError = (e) => {
        console.error("Video Error:", e);
        setStatus('error');
        setError(e.target?.error?.message || 'Video yüklenemedi');
    };

    const handleCanPlay = () => {
        setStatus('ready');
    };

    const handlePlay = () => {
        setStatus('playing');
    };

    const handlePause = () => {
        setStatus('paused');
    };

    const handleLoadStart = () => {
        setStatus('loading');
    };

    const handleWaiting = () => {
        setStatus('buffering');
    };

    // YouTube player
    if (isYouTube) {
        return (
            <div className="relative w-full h-full bg-black/90 overflow-hidden rounded-2xl shadow-2xl border border-white/10" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                {videoUrl ? (
                    <>
                        <div style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }}>
                            <iframe
                                ref={iframeRef}
                                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=0&controls=1&modestbranding=1&rel=0&showinfo=0`}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    border: 'none',
                                    borderRadius: '0.75rem',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    zIndex: 5
                                }}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                loading="lazy"
                                onLoad={() => setStatus('ready')}
                                onError={() => {
                                    setStatus('error');
                                    setError('YouTube videosu yüklenemedi');
                                }}
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center text-white/30 gap-4">
                        <div className="w-16 h-16 rounded-full border-2 border-white/10 flex items-center justify-center">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium tracking-wide">Video URL'si girin</p>
                    </div>
                )}
            </div>
        );
    }

    // Local files and direct video links (MP4, WebM, etc)
    return (
        <div className="relative w-full h-full bg-black/90 overflow-hidden rounded-2xl shadow-2xl border border-white/10" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {videoUrl ? (
                <>
                    <video
                        ref={videoRef}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        controls
                        onPlay={handlePlay}
                        onPause={handlePause}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onCanPlay={handleCanPlay}
                        onError={handleError}
                        crossOrigin="anonymous"
                        onLoadStart={handleLoadStart}
                        onWaiting={handleWaiting}
                    >
                        <source src={videoUrl} type="video/mp4" />
                        <source src={videoUrl} type="video/webm" />
                        <source src={videoUrl} type="video/ogg" />
                        Tarayıcınız video oynatmayı desteklemiyor.
                    </video>

                    {/* Status Overlay */}
                    {(status === 'buffering' || status === 'loading') && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10 pointer-events-none">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                                <p className="text-white/50 text-sm">Yükleniyor...</p>
                            </div>
                        </div>
                    )}

                    {/* Error Overlay */}
                    {status === 'error' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md z-20 p-4">
                            <p className="text-red-500 font-medium mb-2">Video yüklenemedi</p>
                            <p className="text-white/50 text-xs max-w-xs text-center mb-2">URL'yi kontrol edin veya başka bir kaynak deneyin.</p>
                            <p className="text-red-400/70 text-xs text-center break-words">{error}</p>
                        </div>
                    )}
                </>
            ) : (
                <div className="flex flex-col items-center justify-center text-white/30 gap-4">
                    <div className="w-16 h-16 rounded-full border-2 border-white/10 flex items-center justify-center">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-sm font-medium tracking-wide">Video URL'si girin</p>
                </div>
            )}
        </div>
    );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
