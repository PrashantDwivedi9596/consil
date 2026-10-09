'use client';
import React from 'react';
import { useAppStore } from '../../lib/store';
import { X, UserCheck, Check, UserX, Lock } from 'lucide-react';

export function PendingAdmissionsModal() {
  const { modalState, closeModal, activeRoomId, pendingAdmissions, addToast } = useAppStore();

  if (!modalState.pendingAdmissions || !activeRoomId) return null;

  const pendingList = pendingAdmissions[activeRoomId] || [];

  const handleAction = (username: string, action: 'approve' | 'reject') => {
    addToast({
      type: action === 'approve' ? 'success' : 'info',
      title: `Request ${action === 'approve' ? 'Approved' : 'Rejected'}`,
      message: `${username} was ${action === 'approve' ? 'admitted into the private room' : 'denied entry'}.`,
    });
    if (pendingList.length <= 1) {
      closeModal('pendingAdmissions');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-rose-400" /> Pending Private Room Entrants (BR-07)
          </h3>
          <button
            onClick={() => closeModal('pendingAdmissions')}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {pendingList.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">No pending admission requests.</p>
          ) : (
            pendingList.map((req) => (
              <div
                key={req.id}
                className="p-3 bg-slate-800/60 rounded-xl border border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={req.avatarUrl}
                    alt={req.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-xs text-slate-100">{req.username}</h4>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-rose-400" /> Pending Approval
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleAction(req.username, 'reject')}
                    className="p-2 bg-slate-800 hover:bg-rose-500/20 text-rose-400 border border-slate-700 rounded-xl transition"
                    title="Reject Entrant"
                  >
                    <UserX className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleAction(req.username, 'approve')}
                    className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md transition"
                    title="Approve Entrant"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
