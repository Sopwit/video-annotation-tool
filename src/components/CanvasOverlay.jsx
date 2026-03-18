import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef, useCallback } from 'react';

const CanvasOverlay = forwardRef(
  ({ width, height, tool, color, brushSize, clearTrigger, isYouTube, activeStamp, videoUrl, currentLayer, layers }, ref) => {
    const MAX_HISTORY_STEPS = 30;
    const canvasRefs = useRef({});
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

    const exportLayerData = useCallback(() => {
      const output = {};
      layers.forEach((layer) => {
        const canvas = canvasRefs.current[layer.id];
        if (canvas && canvas.width > 0 && canvas.height > 0) {
          output[layer.id] = canvas.toDataURL('image/png');
        }
      });
      return output;
    }, [layers]);

    const loadLayerData = useCallback(async (layerData) => {
      if (!layerData || typeof layerData !== 'object') return;

      const drawTasks = Object.entries(layerData).map(([layerId, dataUrl]) => {
        if (!dataUrl) return Promise.resolve();
        const canvas = canvasRefs.current[Number(layerId)];
        if (!canvas) return Promise.resolve();

        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve();
          };
          img.onerror = () => resolve();
          img.src = dataUrl;
        });
      });

      await Promise.all(drawTasks);
    }, []);

    const captureFrame = async (targetWidth, targetHeight) => {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = targetWidth;
      tempCanvas.height = targetHeight;
      const tempCtx = tempCanvas.getContext('2d');

      // Draw Video Background
      if (isYouTube) {
        const id = getYouTubeId(videoUrl);
        if (id) {
          try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
            });
            tempCtx.drawImage(img, 0, 0, targetWidth, targetHeight);
          } catch {
            tempCtx.fillStyle = '#000';
            tempCtx.fillRect(0, 0, targetWidth, targetHeight);
          }
        }
      } else {
        const video = document.querySelector('video');
        if (video) {
          try {
            tempCtx.drawImage(video, 0, 0, targetWidth, targetHeight);
          } catch {
            tempCtx.fillStyle = '#000';
            tempCtx.fillRect(0, 0, targetWidth, targetHeight);
          }
        }
      }

      // Draw all visible layers
      layers
        .filter((l) => l.visible)
        .forEach((layer) => {
          const canvas = canvasRefs.current[layer.id];
          if (canvas) {
            tempCtx.globalAlpha = layer.opacity;
            tempCtx.drawImage(canvas, 0, 0, width, height, 0, 0, targetWidth, targetHeight);
          }
        });

      tempCtx.globalAlpha = 1;
      return tempCanvas.toDataURL(targetWidth === width ? 'image/png' : 'image/jpeg', 0.8);
    };

    // Helper functions - defined before imperative handle to avoid hoisting issues
    const clearAllLayers = useCallback(() => {
      layers.forEach((layer) => {
        const canvas = canvasRefs.current[layer.id];
        if (canvas) {
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      });
    }, [layers]);

    const restoreState = useCallback((layersData) => {
      if (!layersData) return;
      Object.entries(layersData).forEach(([layerId, imageData]) => {
        const canvas = canvasRefs.current[parseInt(layerId)];
        if (canvas && imageData) {
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.putImageData(imageData, 0, 0);
        }
      });
    }, []);



    // Initialize canvases for all layers
    useEffect(() => {
      layers.forEach((layer) => {
        const canvas = canvasRefs.current[layer.id];
        if (!canvas) return;

        const prevWidth = canvas.width;
        const prevHeight = canvas.height;
        const sizeChanged = prevWidth !== width || prevHeight !== height;

        let buffer = null;
        if (sizeChanged && prevWidth > 0 && prevHeight > 0) {
          buffer = document.createElement('canvas');
          buffer.width = prevWidth;
          buffer.height = prevHeight;
          buffer.getContext('2d').drawImage(canvas, 0, 0);
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (buffer) {
          ctx.drawImage(buffer, 0, 0, prevWidth, prevHeight, 0, 0, width, height);
        }
      });
    }, [width, height, layers]);

    // Update current canvas context when tools change
    useEffect(() => {
      const canvas = canvasRefs.current[currentLayer];
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }, [color, brushSize, currentLayer]);

    useEffect(() => {
      clearAllLayers();
      // Use timeout to avoid synchronous setState in effect
      const timer = setTimeout(() => {
        setHistory([]);
        setHistoryStep(-1);
      }, 0);
      return () => clearTimeout(timer);
    }, [clearTrigger, clearAllLayers]);

    const getCurrentCanvas = () => canvasRefs.current[currentLayer];

    const saveState = () => {
      const layersData = {};
      layers.forEach((layer) => {
        const canvas = canvasRefs.current[layer.id];
        if (canvas) {
          const ctx = canvas.getContext('2d');
          layersData[layer.id] = ctx.getImageData(0, 0, canvas.width, canvas.height);
        }
      });

      const newHistory = history.slice(0, historyStep + 1);
      newHistory.push(layersData);
      const trimmedHistory =
        newHistory.length > MAX_HISTORY_STEPS
          ? newHistory.slice(newHistory.length - MAX_HISTORY_STEPS)
          : newHistory;
      setHistory(trimmedHistory);
      setHistoryStep(trimmedHistory.length - 1);
    };

    const getPos = (e) => {
      const canvas = getCurrentCanvas();
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const startDrawing = (e) => {
      if (tool === 'cursor' || tool === 'text') return;

      // Check if current layer is locked
      const layer = layers.find((l) => l.id === currentLayer);
      if (layer && layer.locked) return;

      const pos = getPos(e);
      const canvas = getCurrentCanvas();
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;

      // Handle Stamp Tool
      if (tool === 'stamp') {
        ctx.font = `${brushSize * 10 + 20}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = color;
        ctx.fillText(activeStamp, pos.x, pos.y);
        saveState();
        return;
      }

      setStartPos(pos);
      setIsDrawing(true);
      setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));

      if (tool === 'pen' || tool === 'eraser') {
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
      }
    };

    const draw = (e) => {
      if (!isDrawing) return;
      const canvas = getCurrentCanvas();
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const currentPos = getPos(e);

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
        // Shape tools
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
          const radius = Math.sqrt(w * w + h * h);
          ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
          ctx.stroke();
        } else if (tool === 'arrow') {
          ctx.moveTo(startPos.x, startPos.y);
          ctx.lineTo(currentPos.x, currentPos.y);
          ctx.stroke();

          const angle = Math.atan2(h, w);
          const headLen = brushSize * 5;
          ctx.beginPath();
          ctx.moveTo(currentPos.x, currentPos.y);
          ctx.lineTo(
            currentPos.x - headLen * Math.cos(angle - Math.PI / 6),
            currentPos.y - headLen * Math.sin(angle - Math.PI / 6)
          );
          ctx.moveTo(currentPos.x, currentPos.y);
          ctx.lineTo(
            currentPos.x - headLen * Math.cos(angle + Math.PI / 6),
            currentPos.y - headLen * Math.sin(angle + Math.PI / 6)
          );
          ctx.stroke();
        } else if (tool === 'line') {
          // NEW: Line tool
          ctx.moveTo(startPos.x, startPos.y);
          ctx.lineTo(currentPos.x, currentPos.y);
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
        const layer = layers.find((l) => l.id === currentLayer);
        if (layer && layer.locked) return;

        const pos = getPos(e);
        setTextInput({ show: true, x: pos.x, y: pos.y, value: '' });
      }
    };

    const handleTextSubmit = () => {
      if (textInput.value.trim()) {
        const canvas = getCurrentCanvas();
        if (canvas) {
          const ctx = canvas.getContext('2d');
          ctx.font = `${brushSize * 5 + 10}px sans-serif`;
          ctx.fillStyle = color;
          ctx.fillText(textInput.value, textInput.x, textInput.y + (brushSize * 5 + 10));
          saveState();
        }
      }
      setTextInput({ ...textInput, show: false });
    };

    useImperativeHandle(ref, () => ({
      undo: () => {
        if (historyStep > 0) {
          const newStep = historyStep - 1;
          setHistoryStep(newStep);
          restoreState(history[newStep]);
        } else if (historyStep === 0) {
          setHistoryStep(-1);
          clearAllLayers();
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
        const aspectRatio = width / height || 1.77;
        const thumbWidth = 320;
        const thumbHeight = thumbWidth / aspectRatio;
        return await captureFrame(thumbWidth, thumbHeight);
      },
      addAiAnnotations: (annotations) => {
        const canvas = canvasRefs.current[currentLayer];
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        // Draw all annotations
        annotations.forEach(ann => {
          // Draw Rectangle
          ctx.strokeStyle = ann.color || '#00ff00';
          ctx.lineWidth = 2; // Fixed thin line for AI
          ctx.strokeRect(ann.x, ann.y, ann.width, ann.height);
          
          // Draw Label Background
          ctx.fillStyle = ann.color || '#00ff00';
          const fontSize = 12;
          ctx.font = `${fontSize}px sans-serif`;
          const textWidth = ctx.measureText(ann.text).width;
          ctx.fillRect(ann.x, ann.y - fontSize - 4, textWidth + 8, fontSize + 4);
          
          // Draw Label Text
          ctx.fillStyle = '#000000';
          ctx.fillText(ann.text, ann.x + 4, ann.y - 4);
        });
        
        saveState();
      },
      exportLayerData: () => exportLayerData(),
      loadLayerData: async (layerData) => {
        await loadLayerData(layerData);
      },
    }));

    return (
      <>
        {layers.map((layer, layerIndex) => (
          <canvas
            key={layer.id}
            ref={(el) => {
              if (el) canvasRefs.current[layer.id] = el;
            }}
            className={`absolute top-0 left-0 transition-opacity ${
              tool === 'cursor' || layer.id !== currentLayer
                ? 'pointer-events-none'
                : 'pointer-events-auto'
            }`}
            style={{
              width,
              height,
              zIndex: 20 + layerIndex,
              position: 'absolute',
              top: 0,
              left: 0,
              opacity: layer.visible ? layer.opacity : 0,
              cursor:
                layer.id === currentLayer && !layer.locked
                  ? tool === 'text'
                    ? 'text'
                    : tool === 'cursor'
                    ? 'default'
                    : 'crosshair'
                  : 'default',
            }}
            onMouseDown={layer.id === currentLayer ? startDrawing : undefined}
            onMouseMove={layer.id === currentLayer ? draw : undefined}
            onMouseUp={layer.id === currentLayer ? stopDrawing : undefined}
            onMouseLeave={layer.id === currentLayer ? stopDrawing : undefined}
            onClick={layer.id === currentLayer ? handleCanvasClick : undefined}
          />
        ))}

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
              zIndex: 100,
              color: color,
              fontSize: `${brushSize * 5 + 10}px`,
              background: 'transparent',
              border: '1px dashed rgba(255,255,255,0.5)',
              outline: 'none',
              padding: '2px',
              minWidth: '100px',
            }}
            placeholder="Type here..."
          />
        )}
      </>
    );
  }
);

export default CanvasOverlay;
