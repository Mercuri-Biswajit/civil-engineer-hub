// ─── useSaveProject Hook (localStorage — no backend) ─────────────────────────
import { useState, useCallback } from 'react';
import { saveProjectToFirestore } from '@/services/projectService';

const LOCAL_USER_ID = 'local-user';

/**
 * Hook to save calculator data as a project.
 * Usage: const { save, saving, error, success } = useSaveProject('bbs');
 */
export default function useSaveProject(toolId) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const save = useCallback(
    async (projectName, projectData) => {
      setSaving(true);
      setError(null);
      setSuccess(false);
      try {
        const id = await saveProjectToFirestore(LOCAL_USER_ID, {
          tool: toolId,
          projectName,
          projectData,
        });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        return id;
      } catch (err) {
        setError(err.message);
        return null;
      } finally {
        setSaving(false);
      }
    },
    [toolId]
  );

  return { save, saving, error, success };
}

