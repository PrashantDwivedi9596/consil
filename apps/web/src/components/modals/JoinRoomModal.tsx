'use client';
import React, { useState } from 'react';
import { useAppStore } from '../../lib/store';
import { X, Compass, Key } from 'lucide-react';

export function JoinRoomModal() {
  const { modalState, closeModal, joinRoomMock } = useAppStore();
  const [code, setCode] = useState('');

  if (!modalState.joinRoom) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    joinRoomMock(code);
    setCode('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
            <Compass className="w-5 h-5 text-sky-400" /> Join Room via Invitation
          </h3>
          <button
            onClick={() => closeModal('joinRoom')}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Invitation Code or Link *
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                placeholder="COUNCIL-ABC-123"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Private rooms will place you in a pending admission state until approved by the creator or assigned substitutes.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => closeModal('joinRoom')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-sky-600/20 transition active:scale-95"
            >
              Join Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
