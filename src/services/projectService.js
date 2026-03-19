// ─── Project Service (localStorage — no backend) ─────────────────────────────
const STORAGE_KEY = 'ceh_projects';

function readProjects() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function writeProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

/** Save a new project */
export async function saveProjectToFirestore(userId, { tool, projectName, projectData }) {
  const projects = readProjects();
  const id = `proj_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();
  projects.unshift({
    id,
    user_id: userId,
    tool,
    project_name: projectName,
    project_data: projectData,
    created_at: now,
    updated_at: now,
  });
  writeProjects(projects);
  return id;
}

/** Get all projects for a specific user */
export async function getUserProjects(userId) {
  const all = readProjects();
  return all.filter((p) => p.user_id === userId);
}

/** Get a single project by ID */
export async function getProjectById(projectId) {
  const all = readProjects();
  return all.find((p) => p.id === projectId) || null;
}

/** Delete a project */
export async function deleteProjectFromFirestore(projectId) {
  const projects = readProjects().filter((p) => p.id !== projectId);
  writeProjects(projects);
}

/** Admin: Get ALL projects */
export async function getAllProjectsFromFirestore() {
  return readProjects();
}

