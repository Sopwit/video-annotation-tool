import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';

/**
 * Export canvas as PNG
 */
export const exportAsPNG = (canvas, filename = 'annotation') => {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `${filename}.png`);
          resolve();
        } else {
          reject(new Error('Failed to create blob'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Export canvas as SVG
 */
export const exportAsSVG = (canvas, annotations, filename = 'annotation') => {
  try {
    const width = canvas.width;
    const height = canvas.height;
    
    let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="transparent"/>
`;
    
    // Convert canvas to data URL and embed as image
    const dataURL = canvas.toDataURL('image/png');
    svgContent += `  <image href="${dataURL}" width="${width}" height="${height}"/>\n`;
    
    svgContent += '</svg>';
    
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    saveAs(blob, `${filename}.svg`);
  } catch (error) {
    console.error('Error exporting as SVG:', error);
    throw error;
  }
};

/**
 * Export annotations as JSON
 */
export const exportAsJSON = (data, filename = 'annotations') => {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    saveAs(blob, `${filename}.json`);
  } catch (error) {
    console.error('Error exporting as JSON:', error);
    throw error;
  }
};

/**
 * Export bookmarks as CSV
 */
export const exportBookmarksAsCSV = (bookmarks, filename = 'bookmarks') => {
  try {
    const headers = ['Timestamp', 'Time (seconds)', 'Note'];
    const rows = bookmarks.map(bm => {
      const timestamp = formatTime(bm.time);
      const noteContent = (bm.text || bm.note || '').replace(/"/g, '""');
      return [timestamp, bm.time, `"${noteContent}"`];
    });
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `${filename}.csv`);
  } catch (error) {
    console.error('Error exporting bookmarks as CSV:', error);
    throw error;
  }
};

/**
 * Copy canvas to clipboard
 */
export const copyToClipboard = async (canvas) => {
  try {
    const blob = await new Promise(resolve => canvas.toBlob(resolve));
    const item = new ClipboardItem({ 'image/png': blob });
    await navigator.clipboard.write([item]);
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    // Fallback to older method
    try {
      const dataURL = canvas.toDataURL();
      const img = document.createElement('img');
      img.src = dataURL;
      document.body.appendChild(img);
      
      const range = document.createRange();
      range.selectNode(img);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand('copy');
      document.body.removeChild(img);
      return true;
    } catch (fallbackError) {
      console.error('Fallback copy failed:', fallbackError);
      throw fallbackError;
    }
  }
};

/**
 * Export full project with video info
 */
export const exportFullProject = (projectData, filename = 'project') => {
  try {
    const exportData = {
      version: '1.2.0',
      exported: new Date().toISOString(),
      ...projectData
    };
    
    exportAsJSON(exportData, filename);
  } catch (error) {
    console.error('Error exporting full project:', error);
    throw error;
  }
};

/**
 * Take screenshot of entire app
 */
export const takeScreenshot = async (elementId = null) => {
  try {
    const element = elementId ? document.getElementById(elementId) : document.body;
    const canvas = await html2canvas(element, {
      backgroundColor: '#0a0a0a',
      scale: 2,
    });
    
    return canvas;
  } catch (error) {
    console.error('Error taking screenshot:', error);
    throw error;
  }
};

/**
 * Batch export screenshots at specific timestamps
 */
export const batchExportScreenshots = async (bookmarks, captureFunction) => {
  const screenshots = [];
  
  for (const bookmark of bookmarks) {
    try {
      const screenshot = await captureFunction(bookmark.time);
      screenshots.push({
        time: bookmark.time,
        note: bookmark.note || bookmark.text,
        image: screenshot
      });
    } catch (error) {
      console.error(`Error capturing screenshot at ${bookmark.time}:`, error);
    }
  }
  
  return screenshots;
};

/**
 * Format time in HH:MM:SS format
 */
const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  return [h, m, s]
    .map(v => v < 10 ? '0' + v : v)
    .join(':');
};

/**
 * Import JSON project
 */
export const importFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        resolve(data);
      } catch {
        reject(new Error('Invalid JSON file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};

export default {
  exportAsPNG,
  exportAsSVG,
  exportAsJSON,
  exportBookmarksAsCSV,
  copyToClipboard,
  exportFullProject,
  takeScreenshot,
  batchExportScreenshots,
  importFromJSON,
};
