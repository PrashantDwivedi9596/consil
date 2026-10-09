'use client';
import React from 'react';
import { useAppStore } from '../../lib/store';
import { Role, PrivacyMode, RoomType } from '@council/shared';
import {
  X,
  Users,
  ShieldAlert,
  ShieldCheck,
  UserPlus,
  UserMinus,
  Clock,
  Lock,
  Globe,
  Info,
} from 'lucide-react';

export function RoomDetailsModal() {
  const { modalState, closeModal, activeRoomId, rooms, members, addToast } = useAppStore();

  if (!modalState.roomDetails || !activeRoomId) return null;

  const room = rooms.find((r) => r.id === activeRoomId);
  const roomMembers = members[activeRoomId] || [];

  if (!room) return null;

  const isCreator = room.userRole === Role.CREATOR;

  const handleToggleSubstitute = (memberId: string, currentRole: Role) => {
    if (!isCreator) return;

    const newRole = currentRole === Role.SUBSTITUTE ? Role.MEMBER : Role.SUBSTITUTE;
    addToast({
      type: 'info',
      title: 'Substitute Role Updated',
      message: `Member assigned role ${newRole}. Substitutes can admit pending members in private mode.`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
            <Info className="w-5 h-5 text-sky-400" /> Room Details & Members
          </h3>
          <button
            onClick={() => closeModal('roomDetails')}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-4">
          {/* Room Summary Card */}
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-base text-slate-100">{room.name}</h4>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="flex items-center gap-1 text-slate-300">
                {room.roomType === RoomType.TEMPORARY ? (
                  <span className="text-amber-400 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5" /> Temporary Mode
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" /> Persistent Mode
                  </span>
                )}
              </span>

              <span>•</span>

              <span className="text-slate-300">
                {room.privacyMode === PrivacyMode.PRIVATE ? (
                  <span className="text-rose-400 flex items-center gap-1 font-medium">
                    <Lock className="w-3.5 h-3.5" /> Private Admission
                  </span>
                ) : (
                  <span className="text-sky-400 flex items-center gap-1 font-medium">
                    <Globe className="w-3.5 h-3.5" /> Open Invitation
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Members List Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-sky-400" /> Joined Members ({roomMembers.length})
              </h4>
              <span className="text-[10px] text-slate-500">
                Denominator $N = {room.joinedMemberCount}$
              </span>
            </div>

            <div className="space-y-2">
              {roomMembers.map((m) => (
                <div
                  key={m.id}
                  className="p-2.5 bg-slate-800/40 rounded-xl border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={m.avatarUrl}
                      alt={m.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <h5 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                        {m.username}
                        {m.role === Role.CREATOR && (
                          <span className="px-1.5 py-0.2 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[9px] rounded font-bold">
                            CREATOR
                          </span>
                        )}
                        {m.role === Role.SUBSTITUTE && (
                          <span className="px-1.5 py-0.2 bg-sky-500/10 text-sky-400 border border-sky-500/30 text-[9px] rounded font-bold">
                            SUBSTITUTE
                          </span>
                        )}
                      </h5>
                      <span className="text-[10px] text-slate-400">
                        {m.isOnline ? 'Online now' : 'Offline'}
                      </span>
                    </div>
                  </div>

                  {/* Creator Substitute Controls (BR-07, FR-05) */}
                  {isCreator && m.role !== Role.CREATOR && (
                    <button
                      onClick={() => handleToggleSubstitute(m.id, m.role)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition ${
                        m.role === Role.SUBSTITUTE
                          ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      }`}
                    >
                      {m.role === Role.SUBSTITUTE ? (
                        <>
                          <UserMinus className="w-3 h-3" /> Revoke Substitute
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3 h-3" /> Make Substitute
                        </>
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={() => closeModal('roomDetails')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
