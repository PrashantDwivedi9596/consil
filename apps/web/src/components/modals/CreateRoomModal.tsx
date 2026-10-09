'use client';
import React, { useState } from 'react';
import { useAppStore } from '../../lib/store';
import { X, Clock, ShieldCheck, Lock, Globe, Users } from 'lucide-react';

export function CreateRoomModal() {
  const { modalState, closeModal, createRoomMock } = useAppStore();
  const [name, setName] = useState('');
  const [isSavedAtCreation, setIsSavedAtCreation] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [maxMembers, setMaxMembers] = useState<number | ''>('');

  if (!modalState.createRoom) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createRoomMock({
      name,
      isSavedAtCreation,
      isPrivate,
      maxMembers: maxMembers ? Number(maxMembers) : undefined,
    });
    setName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-100">Create New Room</h3>
          <button
            onClick={() => closeModal('createRoom')}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Room Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Room Display Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Project Architecture Sync"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Room Persistence Toggle (BR-01) */}
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800 space-y-2">
            <label className="text-xs font-semibold text-slate-200 block">
              Room Persistence Mode (BR-01)
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsSavedAtCreation(false)}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition ${
                  !isSavedAtCreation
                    ? 'bg-amber-500/10 border-amber-500/50 text-amber-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="font-semibold text-xs flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> Temporary
                </span>
                <span className="text-[10px] text-slate-400">
                  Expires when empty (requires vote to save)
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsSavedAtCreation(true)}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition ${
                  isSavedAtCreation
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="font-semibold text-xs flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Saved at Creation
                </span>
                <span className="text-[10px] text-slate-400">
                  Persistent immediately without a vote
                </span>
              </button>
            </div>
          </div>

          {/* Room Privacy Mode Toggle (BR-07) */}
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800 space-y-2">
            <label className="text-xs font-semibold text-slate-200 block">
              Admission Privacy Mode (BR-07)
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsPrivate(false)}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition ${
                  !isPrivate
                    ? 'bg-sky-500/10 border-sky-500/50 text-sky-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="font-semibold text-xs flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-sky-400" /> Open Invitation
                </span>
                <span className="text-[10px] text-slate-400">
                  Anyone with code/link joins directly
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsPrivate(true)}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition ${
                  isPrivate
                    ? 'bg-rose-500/10 border-rose-500/50 text-rose-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="font-semibold text-xs flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-rose-400" /> Private Admission
                </span>
                <span className="text-[10px] text-slate-400">
                  Requires approval by creator or substitute
                </span>
              </button>
            </div>
          </div>

          {/* Max Members Limit */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Maximum Member Capacity (Optional)
            </label>
            <input
              type="number"
              min="2"
              max="100"
              placeholder="e.g. 15 (Leave blank for no limit)"
              value={maxMembers}
              onChange={(e) => setMaxMembers(e.target.value ? Number(e.target.value) : '')}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => closeModal('createRoom')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-sky-600/20 transition active:scale-95"
            >
              Create Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
