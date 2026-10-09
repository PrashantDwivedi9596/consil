'use client';
import React from 'react';
import { useAppStore } from '../../lib/store';
import { calculateRequiredThresholds } from '@council/shared';
import { X, Lock, Download, ThumbsUp, ThumbsDown } from 'lucide-react';

export function MediaVoteModal() {
  const { modalState, closeModal, activeRoomId, rooms, addToast } = useAppStore();

  if (!modalState.mediaVote || !activeRoomId) return null;

  const room = rooms.find((r) => r.id === activeRoomId);
  const N = room ? room.joinedMemberCount : 10;
  const { required50PercentYes, required30PercentFloorYes } = calculateRequiredThresholds(N);

  const handleVoteMedia = (choice: 'YES' | 'NO') => {
    addToast({
      type: 'info',
      title: 'Media Unlock Vote Cast',
      message: `Voted ${choice} to unlock official media download permission (${required50PercentYes} YES votes needed).`,
    });
    closeModal('mediaVote');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-400" /> Unlock Media Download (BR-08)
          </h3>
          <button
            onClick={() => closeModal('mediaVote')}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4 text-xs">
          <p className="text-slate-300 leading-relaxed">
            The uploader explicitly locked official download for this media attachment. Under room rules, members may vote to unlock download authorization.
          </p>

          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between font-semibold text-slate-200">
              <span>Required Approval Threshold</span>
              <span className="text-sky-400 font-bold">{required50PercentYes} YES Votes</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Requires $\ge 50\%$ approval ($\ge {required50PercentYes}$) and $\ge 30\%$ floor ($\ge {required30PercentFloorYes}$) of joined members ($N={N}$).
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => handleVoteMedia('NO')}
              className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition"
            >
              <ThumbsDown className="w-4 h-4 text-rose-400" /> Reject Unlock
            </button>

            <button
              onClick={() => handleVoteMedia('YES')}
              className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition"
            >
              <ThumbsUp className="w-4 h-4" /> Approve Unlock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
