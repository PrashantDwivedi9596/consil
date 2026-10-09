'use client';
import React, { useState } from 'react';
import { useAppStore } from '../../lib/store';
import { X, User, Sparkles, RefreshCw, Check } from 'lucide-react';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
];

export function ProfileModal() {
  const { currentUser, setCurrentUser, modalState, closeModal, addToast } = useAppStore();
  const [username, setUsername] = useState(currentUser.username);
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser.avatarUrl);

  if (!modalState.profileEditor && !currentUser.isNewDevice) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setCurrentUser({
      username,
      avatarUrl: selectedAvatar,
      isNewDevice: false,
    });

    closeModal('profileEditor');
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Username and avatar preferences saved for this device identity.',
    });
  };

  const handleResetDeviceIdentity = () => {
    const newToken = `dev-token-${Math.random().toString(36).substring(2)}`;
    setCurrentUser({
      deviceToken: newToken,
      isNewDevice: true,
    });
    addToast({
      type: 'info',
      title: 'Device Identity Reset',
      message: 'Generated a new device installation token. Mandatory onboarding required.',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
            <User className="w-5 h-5 text-sky-400" />
            {currentUser.isNewDevice ? 'New Device Profile Setup' : 'Edit Profile Settings'}
          </h3>
          {!currentUser.isNewDevice && (
            <button
              onClick={() => closeModal('profileEditor')}
              className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {currentUser.isNewDevice && (
            <div className="p-3 bg-sky-500/10 border border-sky-500/30 rounded-xl text-xs text-sky-200 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>
                A new device identity was detected. Please set up your display username and avatar to continue into Council.
              </span>
            </div>
          )}

          {/* Username Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Display Username *
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Avatar Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Choose Profile Avatar
            </label>
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {AVATAR_OPTIONS.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedAvatar(url)}
                  className={`relative rounded-full p-0.5 transition shrink-0 ${
                    selectedAvatar === url ? 'ring-2 ring-sky-400 scale-105' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt={`Avatar ${i}`} className="w-12 h-12 rounded-full object-cover" />
                  {selectedAvatar === url && (
                    <span className="absolute bottom-0 right-0 bg-sky-500 text-white p-0.5 rounded-full">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Device Identity Info */}
          <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 block">
              Device Installation Token (BR-09)
            </span>
            <p className="text-[10px] font-mono text-slate-500 truncate">
              {currentUser.deviceToken}
            </p>
            <button
              type="button"
              onClick={handleResetDeviceIdentity}
              className="mt-1 text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
            >
              <RefreshCw className="w-3 h-3" /> Reset Device Identity (Clear Memory)
            </button>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            {!currentUser.isNewDevice && (
              <button
                type="button"
                onClick={() => closeModal('profileEditor')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-sky-600/20 transition active:scale-95"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
