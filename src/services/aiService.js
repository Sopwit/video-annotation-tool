import '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

let model = null;

/**
 * Loads the COCO-SSD model. Single entry point.
 */
export const loadModel = async () => {
  if (model) return model;
  try {
    console.log('Loading AI Model...');
    model = await cocoSsd.load();
    console.log('AI Model Loaded!');
    return model;
  } catch (error) {
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
