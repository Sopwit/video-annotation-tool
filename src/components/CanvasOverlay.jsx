import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';

const CanvasOverlay = forwardRef(({ width, height, tool, color, brushSize, clearTrigger, isYouTube, activeStamp, videoUrl }, ref) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [snapshot, setSnapshot] = useState(null);
    const [history, setHistory] = useState([]);
    const [historyStep, setHistoryStep] = useState(-1);
    const [textInput, setTextInput] = useState({ show: false, x: 0, y: 0, value: '' });

    const getYouTubeId = (url) => {
        if (!url) return null;
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
        return match ? match[1] : null;
    };

    const captureFrame = async (targetWidth, targetHeight) => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = targetWidth;
        tempCanvas.height = targetHeight;
        const tempCtx = tempCanvas.getContext('2d');
        const canvas = canvasRef.current;

        // 1. Draw Video Background
        if (isYouTube) {
            const id = getYouTubeId(videoUrl);
            if (id) {
                try {
                    // Load thumbnail
                    const img = new Image();
                    img.crossOrigin = "anonymous";
                    img.src = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
                    await new Promise((resolve, reject) => {
                        img.onload = resolve;
                        img.onerror = reject;
                    });
                    
                    // Draw thumbnail maintaining aspect ratio (cover)
                    // Basic implementation: stretch to fit for simplicity or draw centered
                    tempCtx.drawImage(img, 0, 0, targetWidth, targetHeight);
                } catch (e) {
                    // Fallback: Black background
                    tempCtx.fillStyle = '#000';
                    tempCtx.fillRect(0, 0, targetWidth, targetHeight);
                    
                    // Optional: Add text "YouTube Video"
                    tempCtx.fillStyle = '#333';
                    tempCtx.font = '20px sans-serif';
                    tempCtx.textAlign = 'center';
                    tempCtx.fillText('YouTube Video', targetWidth/2, targetHeight/2);
                }
            }
        } else {
             const video = document.querySelector('video');
             if (video) {
                 try {
                     tempCtx.drawImage(video, 0, 0, targetWidth, targetHeight);
                 } catch (e) {
                     // Fallback if protected
                     tempCtx.fillStyle = '#000';
                     tempCtx.fillRect(0, 0, targetWidth, targetHeight);
                 }
             }
        }

        // 2. Draw Annotations
        if (canvas) {
            tempCtx.drawImage(canvas, 0, 0, width, height, 0, 0, targetWidth, targetHeight);
        }

        return tempCanvas.toDataURL(targetWidth === width ? 'image/png' : 'image/jpeg', 0.8);
    };

    useImperativeHandle(ref, () => ({
        undo: () => {
            if (historyStep > 0) {
                const newStep = historyStep - 1;
                setHistoryStep(newStep);
                restoreState(history[newStep]);
            } else if (historyStep === 0) {
                setHistoryStep(-1);
                clearCanvas();
            }
        },
        redo: () => {
            if (historyStep < history.length - 1) {
                const newStep = historyStep + 1;
                setHistoryStep(newStep);
                restoreState(history[newStep]);
            }
        },
        download: async () => {
            const dataUrl = await captureFrame(width, height);
            const link = document.createElement('a');
            link.download = `annotation-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
        },
        getSnapshot: async () => {
             // Create smaller thumbnail (width: 320px)
            const aspectRatio = width / height || 1.77;
            const thumbWidth = 320;
            const thumbHeight = thumbWidth / aspectRatio;
            return await captureFrame(thumbWidth, thumbHeight);
        }
    }));

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
             if (historyStep >= 0 && history[historyStep]) {
                 restoreState(history[historyStep]);
             }
        }
    }, [width, height]);

    // Force context update when tools change
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.strokeStyle = color;
            ctx.lineWidth = brushSize;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        }
    }, [color, brushSize]);

    useEffect(() => {
        clearCanvas();
        setHistory([]);
        setHistoryStep(-1);
    }, [clearTrigger]);

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    const restoreState = (imageData) => {
        const canvas = canvasRef.current;
        if (canvas && imageData) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.putImageData(imageData, 0, 0);
        }
    };

    const saveState = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            const newHistory = history.slice(0, historyStep + 1);
            newHistory.push(imageData);
            setHistory(newHistory);
            setHistoryStep(newHistory.length - 1);
        }
    };

    const getPos = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const startDrawing = (e) => {
        if (tool === 'cursor' || tool === 'text') return;
        
        const pos = getPos(e);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Ensure context is fresh
        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize;
        
        // Handle Stamp Tool Immediately
        if (tool === 'stamp') {
            ctx.font = `${brushSize * 10 + 20}px serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = color; // Although stamps are emojis, fillStyle might affect some renderers or fallback text
            ctx.fillText(activeStamp, pos.x, pos.y);
            saveState();
            return;
        }

        setStartPos(pos);
        setIsDrawing(true);

        // Save current canvas state to restore during shape preview
        setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));

        if (tool === 'pen' || tool === 'eraser') {
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
        }
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const currentPos = getPos(e);

        // Ensure context props are used (fix for color/size bug)
        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize;

        if (tool === 'pen' || tool === 'eraser') {
            ctx.lineTo(currentPos.x, currentPos.y);
            if (tool === 'pen') {
                ctx.globalCompositeOperation = 'source-over';
            } else if (tool === 'eraser') {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.lineWidth = brushSize * 10;
            }
            ctx.stroke();
        } else {
            // Shape tools: Restore original state first
            if (snapshot) {
                ctx.putImageData(snapshot, 0, 0);
            }
            
            ctx.globalCompositeOperation = 'source-over';
            ctx.beginPath();

            const w = currentPos.x - startPos.x;
            const h = currentPos.y - startPos.y;

            if (tool === 'rectangle') {
                ctx.strokeRect(startPos.x, startPos.y, w, h);
            } else if (tool === 'circle') {
                ctx.beginPath();
                const radius = Math.sqrt(w * w + h * h);
                ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
                ctx.stroke();
            } else if (tool === 'arrow') {
                // Draw line
                ctx.moveTo(startPos.x, startPos.y);
                ctx.lineTo(currentPos.x, currentPos.y);
                ctx.stroke();

                // Draw arrowhead
                const angle = Math.atan2(h, w);
                const headLen = brushSize * 5; // length of head in pixels
                ctx.beginPath();
                ctx.moveTo(currentPos.x, currentPos.y);
                ctx.lineTo(currentPos.x - headLen * Math.cos(angle - Math.PI / 6), currentPos.y - headLen * Math.sin(angle - Math.PI / 6));
                ctx.moveTo(currentPos.x, currentPos.y);
                ctx.lineTo(currentPos.x - headLen * Math.cos(angle + Math.PI / 6), currentPos.y - headLen * Math.sin(angle + Math.PI / 6));
                ctx.stroke();
            }
        }
    };

    const stopDrawing = () => {
        if (isDrawing) {
            setIsDrawing(false);
            saveState();
        }
    };

    const handleCanvasClick = (e) => {
        if (tool === 'text') {
            const pos = getPos(e);
            setTextInput({ show: true, x: pos.x, y: pos.y, value: '' });
        }
    };

    const handleTextSubmit = () => {
        if (textInput.value.trim()) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.font = `${brushSize * 5 + 10}px sans-serif`;
            ctx.fillStyle = color;
            ctx.fillText(textInput.value, textInput.x, textInput.y + (brushSize * 5 + 10)); // Adjust Y to draw roughly where clicked
            saveState();
        }
        setTextInput({ ...textInput, show: false });
    };

    return (
        <>
            <canvas
                ref={canvasRef}
                className={`absolute top-0 left-0 transition-opacity ${tool === 'cursor' ? 'pointer-events-none' : 'pointer-events-auto'}`}
                style={{
                    width,
                    height,
                    zIndex: 20,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    cursor: tool === 'text' ? 'text' : tool === 'cursor' ? 'default' : tool === 'stamp' ? 'crosshair' : 'crosshair'
                }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onClick={handleCanvasClick}
            />
            
            {/* Text Input Overlay */}
            {textInput.show && (
                <input
                    type="text"
                    autoFocus
                    value={textInput.value}
                    onChange={(e) => setTextInput({ ...textInput, value: e.target.value })}
                    onBlur={handleTextSubmit}
                    onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
                    style={{
                        position: 'absolute',
                        left: textInput.x,
                        top: textInput.y,
                        zIndex: 30,
                        color: color,
                        fontSize: `${brushSize * 5 + 10}px`,
                        background: 'transparent',
                        border: '1px dashed rgba(255,255,255,0.5)',
                        outline: 'none',
                        padding: '2px',
                        minWidth: '100px'
                    }}
                    placeholder="Type here..."
                />
            )}
        </>
    );
});

export default CanvasOverlay;
