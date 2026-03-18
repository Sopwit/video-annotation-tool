let model = null;
let modelPromise = null;

/**
 * Loads the COCO-SSD model. Single entry point.
 */
export const loadModel = async () => {
  if (model) return model;
  if (modelPromise) return modelPromise;

  modelPromise = (async () => {
    // Lazy-load only required TFJS modules to avoid pulling the full tfjs bundle.
    const tf = await import('@tensorflow/tfjs-core');
    await Promise.all([
      import('@tensorflow/tfjs-backend-webgl'),
      import('@tensorflow/tfjs-backend-cpu'),
      import('@tensorflow/tfjs-converter'),
    ]);

    // Prefer WebGL backend for speed; fallback to CPU.
    try {
      if (tf.getBackend() !== 'webgl') {
        await tf.setBackend('webgl');
      }
    } catch {
      await tf.setBackend('cpu');
    }
    await tf.ready();

    const cocoSsd = await import('@tensorflow-models/coco-ssd');
    return cocoSsd.load();
  })();

  try {
    model = await modelPromise;
    return model;
  } catch (error) {
    modelPromise = null;
    console.error('Failed to load AI model:', error);
    throw error;
  }
};

/**
 * Detects objects in the given image/video element
 * @param {HTMLVideoElement | HTMLImageElement} visualElement 
 * @returns {Promise<Array>} List of detected objects formatted as annotations
 */
export const detectObjects = async (visualElement) => {
  const loadedModel = await loadModel();
  
  // Run detection
  const predictions = await loadedModel.detect(visualElement);
  
  // Convert predictions to our annotation format (Rectangles)
  return predictions.map((pred, index) => {
    // pred.bbox is [x, y, width, height]
    const [x, y, width, height] = pred.bbox;

    return {
      id: Date.now() + index,
      type: 'rectangle',
      x,
      y,
      width,
      height,
      color: '#00ff00', // Default AI color (Green)
      strokeWidth: 2,
      text: `${pred.class} (${Math.round(pred.score * 100)}%)`, // Label with confidence
      isAiGenerated: true
    };
  });
};
