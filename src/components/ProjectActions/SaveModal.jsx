import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SaveModal({ isOpen, onClose, onSave, initialName = '' }) {
  const [projectName, setProjectName] = useState(initialName);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) return;
    setIsSaving(true);
    try {
      await onSave(projectName);
      onClose();
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-5 bg-slate-900/40 backdrop-blur-md">
          <motion.div 
            className="w-full max-w-[440px] bg-white/85 border border-slate-200 rounded-lg p-8 shadow-2xl overflow-hidden backdrop-blur-xl"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Save Project</h3>
              <button className="text-2xl text-slate-400 hover:text-slate-900 hover:rotate-90 transition-all duration-300" onClick={onClose}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col">
              <div className="flex flex-col gap-2 mb-8">
                <label htmlFor="projectName" className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">Project Name</label>
                <input
                  id="projectName"
                  type="text"
                  placeholder="e.g. Ground Floor Beam - B1"
                  className="px-[18px] py-[14px] bg-white border border-slate-200 rounded-lg text-base text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              
              <div className="flex gap-3">
                <button 
                  type="button" 
                  className="flex-1 px-4 py-3 rounded-lg text-sm font-bold text-slate-500 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-all" 
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-3 rounded-lg text-sm font-bold text-white bg-indigo-600 shadow-[0_4px_12px_rgba(99,102,241,0.2)] hover:bg-indigo-700 hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(99,102,241,0.3)] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none" 
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
