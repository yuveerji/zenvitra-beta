'use client';

import React, { useState } from 'react';
import { CheckSquare, Plus, Calendar, User, Clock, Check, X } from 'lucide-react';
import { ZenDocument, ZenDocTask } from '@/types/docs';

interface DocTasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeDoc: ZenDocument;
  onAddTask: (title: string, assignee: string, dueDate?: string) => void;
  onToggleTask: (taskId: string) => void;
}

export function DocTasksModal({
  isOpen,
  onClose,
  activeDoc,
  onAddTask,
  onToggleTask,
}: DocTasksModalProps) {
  const [taskTitle, setTaskTitle] = useState('');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');

  if (!isOpen) return null;

  const tasks = activeDoc.tasks || [];
  const completedCount = tasks.filter((t) => t.completed).length;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    onAddTask(taskTitle.trim(), assignee.trim() || 'Self', dueDate.trim() || undefined);
    setTaskTitle('');
    setAssignee('');
    setDueDate('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-3xl bg-[#0b0e17] border border-cyan-500/30 p-6 sm:p-8 space-y-6 shadow-2xl relative text-left">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-mono text-[10px] uppercase font-bold">
              <CheckSquare className="w-3 h-3 text-cyan-400" />
              <span>IN-DOCUMENT TASKS &bull; {completedCount}/{tasks.length} COMPLETED</span>
            </div>
            <h3 className="text-xl font-bold font-display text-white">Tasks &amp; Action Items</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Task Form */}
        <form onSubmit={handleCreate} className="space-y-3 p-4 rounded-2xl bg-black/50 border border-white/5">
          <input
            type="text"
            placeholder="Action item (e.g. Verify Article 4 citations, complete budgetary section)..."
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-neutral-500 text-xs focus:outline-none focus:border-cyan-400"
          />
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <input
              type="text"
              placeholder="Assignee (@delegate)..."
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-neutral-500 text-xs focus:outline-none"
            />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-neutral-300 text-xs focus:outline-none cursor-pointer"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Action Item</span>
          </button>
        </form>

        {/* Tasks List */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {tasks.length === 0 ? (
            <p className="text-center py-6 text-xs text-neutral-500 font-mono">
              No tasks assigned yet. Highlight text or use the form above to assign action items.
            </p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onToggleTask(task.id)}
                className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 text-xs font-mono ${
                  task.completed
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-neutral-500 line-through'
                    : 'bg-white/[0.02] border-white/5 hover:border-cyan-500/30 text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${task.completed ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-white/20'}`}>
                    {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>{task.title}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-neutral-400 shrink-0">
                  <span>@{task.assignee}</span>
                  {task.dueDate && <span>&bull; Due {task.dueDate}</span>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
