import Dexie from 'dexie';

class AnnotationDatabase extends Dexie {
  constructor() {
    super('VideoAnnotationDB');
    
    this.version(1).stores({
      projects: '++id, name, videoUrl, created, modified',
      annotations: '++id, projectId, layerId, type, data',
      layers: '++id, projectId, name, visible, opacity',
      bookmarks: '++id, projectId, time, note, thumbnail',
    });
    
    this.projects = this.table('projects');
    this.annotations = this.table('annotations');
    this.layers = this.table('layers');
    this.bookmarks = this.table('bookmarks');
  }
}

const db = new AnnotationDatabase();

// Project Management
export const saveProject = async (projectData) => {
  try {
    const { name, videoUrl, layers, annotations, bookmarks } = projectData;
    
    // Save or update project
    const projectId = await db.projects.put({
      name,
      videoUrl,
      created: projectData.created || new Date().toISOString(),
      modified: new Date().toISOString(),
    });
    
    // Clear existing data for this project
    await db.annotations.where('projectId').equals(projectId).delete();
    await db.layers.where('projectId').equals(projectId).delete();
    await db.bookmarks.where('projectId').equals(projectId).delete();
    
    // Save layers
    if (layers && layers.length > 0) {
      await db.layers.bulkAdd(
        layers.map(layer => ({ ...layer, projectId }))
      );
    }
    
    // Save annotations
    if (annotations && annotations.length > 0) {
      await db.annotations.bulkAdd(
        annotations.map(ann => ({ ...ann, projectId }))
      );
    }
    
    // Save bookmarks
    if (bookmarks && bookmarks.length > 0) {
      await db.bookmarks.bulkAdd(
        bookmarks.map(bm => ({ ...bm, projectId }))
      );
    }
    
    return projectId;
  } catch (error) {
    console.error('Error saving project:', error);
    throw error;
  }
};

export const loadProject = async (projectId) => {
  try {
    const project = await db.projects.get(projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    
    const layers = await db.layers.where('projectId').equals(projectId).toArray();
    const annotations = await db.annotations.where('projectId').equals(projectId).toArray();
    const bookmarks = await db.bookmarks.where('projectId').equals(projectId).toArray();
    
    return {
      ...project,
      layers,
      annotations,
      bookmarks,
    };
  } catch (error) {
    console.error('Error loading project:', error);
    throw error;
  }
};

export const getAllProjects = async () => {
  try {
    return await db.projects.toArray();
  } catch (error) {
    console.error('Error getting projects:', error);
    throw error;
  }
};

export const deleteProject = async (projectId) => {
  try {
    await db.projects.delete(projectId);
    await db.annotations.where('projectId').equals(projectId).delete();
    await db.layers.where('projectId').equals(projectId).delete();
    await db.bookmarks.where('projectId').equals(projectId).delete();
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// Export/Import Functions
export const exportProjectAsJSON = async (projectId) => {
  try {
    const project = await loadProject(projectId);
    return JSON.stringify(project, null, 2);
  } catch (error) {
    console.error('Error exporting project:', error);
    throw error;
  }
};

export const importProjectFromJSON = async (jsonString) => {
  try {
    const projectData = JSON.parse(jsonString);
    const projectId = await saveProject(projectData);
    return projectId;
  } catch (error) {
    console.error('Error importing project:', error);
    throw error;
  }
};

// Auto-save functionality
let autoSaveTimeout = null;

export const scheduleAutoSave = (projectData, delay = 60000) => {
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
  }
  
  autoSaveTimeout = setTimeout(async () => {
    try {
      await saveProject(projectData);
      console.log('Auto-saved project');
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, delay);
};

export const cancelAutoSave = () => {
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = null;
  }
};

export default db;
