'use client';
import React from 'react';
import { useAppStore } from '../../lib/store';
import { calculateRequiredThresholds } from '@council/shared';
import { X, BookmarkPlus, ThumbsUp, ThumbsDown, Info, ShieldAlert } from 'lucide-react';

export function SaveRoomVoteModal() {
  const { modalState, closeModal, activeRoomId, rooms, activeVotes, castVoteMock } = useAppStore();

  if (!modalState.saveVote || !activeRoomId) return null;

  const room = rooms.find((r) => r.id === activeRoomId);
  const vote = activeVotes[activeRoomId];

  if (!room) return null;

  const N = vote ? vote.eligibleMemberSnapshot : room.joinedMemberCount;
  const { required50PercentYes, required30PercentFloorYes } = calculateRequiredThresholds(N);

  const yesCount = vote ? vote.yesCount : 0;
  const noCount = vote ? vote.noCount : 0;

  const handleVote = (choice: 'YES' | 'NO') => {
    castVoteMock(vote?.id || 'vote-1', choice);
    closeModal('saveVote');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
            <BookmarkPlus className="w-5 h-5 text-amber-400" /> Vote: Convert to Persistent Room
          </h3>
          <button
            onClick={() => closeModal('saveVote')}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Rule Breakdown Box */}
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between font-semibold text-slate-200 border-b border-slate-700/60 pb-1.5">
              <span>Joined Member Snapshot ($N$)</span>
              <span className="text-sky-400 font-mono text-sm font-bold">{N} members</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                <span className="text-slate-400 block text-[10px]">50% Approval Threshold (BR-03)</span>
                <span className="text-amber-300 font-bold text-sm">$\ge {required50PercentYes}$ YES Votes</span>
              </div>
              <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                <span className="text-slate-400 block text-[10px]">30% Agreement Floor (BR-04)</span>
                <span className="text-amber-300 font-bold text-sm">$\ge {required30PercentFloorYes}$ YES Votes</span>
              </div>
            </div>
          </div>

          {/* Current Tally */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium text-slate-300">
              <span>Current Tally:</span>
              <span>
                {yesCount} YES / {noCount} NO
              </span>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
              <div
                className="bg-amber-400 h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (yesCount / required50PercentYes) * 100)}%`,
                }}
              />
            </div>
            <p className="text-[11px] text-slate-400 text-center">
              Requires {Math.max(0, required50PercentYes - yesCount)} more YES votes to execute room persistence.
            </p>
          </div>

          {/* Active Voter Trap Explanation Callout */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-200 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Note:</strong> The voting denominator is based on total joined members ($N={N}$), not merely active voters. Offline members are included in the denominator to prevent manipulation.
            </span>
          </div>

          {/* Voting Actions */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => handleVote('NO')}
              className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition active:scale-95"
            >
              <ThumbsDown className="w-4 h-4 text-rose-400" /> Vote NO
            </button>

            <button
              onClick={() => handleVote('YES')}
              className="py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition active:scale-95"
            >
              <ThumbsUp className="w-4 h-4 text-slate-950" /> Vote YES
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
