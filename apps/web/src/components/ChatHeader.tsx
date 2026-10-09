'use client';
import React from 'react';
import { useAppStore } from '../lib/store';
import { RoomType, PrivacyMode, Role } from '@council/shared';
import {
  Menu,
  Clock,
  ShieldCheck,
  Lock,
  Globe,
  Users,
  Share2,
  Info,
  BookmarkPlus,
  UserCheck,
} from 'lucide-react';

export function ChatHeader() {
  const {
    rooms,
    activeRoomId,
    setSidebarOpenMobile,
    openModal,
    addToast,
    pendingAdmissions,
  } = useAppStore();

  const room = rooms.find((r) => r.id === activeRoomId);

  if (!room) return null;

  const isTemp = room.roomType === RoomType.TEMPORARY;
  const isPrivate = room.privacyMode === PrivacyMode.PRIVATE;
  const pendingCount = pendingAdmissions[room.id]?.length || 0;
  const isCreatorOrSub = room.userRole === Role.CREATOR || room.userRole === Role.SUBSTITUTE;

  const handleCopyInvite = () => {
    const inviteUrl = `${window.location.origin}/join?code=COUNCIL-${room.id.toUpperCase()}`;
    navigator.clipboard.writeText(inviteUrl);
    addToast({
      type: 'success',
      title: 'Invite Link Copied',
      message: 'Secure room invitation link copied to clipboard.',
    });
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpenMobile(true)}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-base text-slate-100 truncate">{room.name}</h2>

            {/* Room Type Pill */}
            {isTemp ? (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                <Clock className="w-3 h-3" /> Temporary
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                <ShieldCheck className="w-3 h-3" /> Saved
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400 flex items-center gap-2 truncate">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3 text-sky-400" />
              {room.activeMemberCount} online of {room.joinedMemberCount} members
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              {isPrivate ? (
                <>
                  <Lock className="w-3 h-3 text-rose-400" /> Private Admission
                </>
              ) : (
                <>
                  <Globe className="w-3 h-3 text-sky-400" /> Open Invitation
                </>
              )}
            </span>
          </p>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Save Room Trigger (if temporary) */}
        {isTemp && (
          <button
            onClick={() => openModal('saveVote')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold transition active:scale-95 shadow-sm"
          >
            <BookmarkPlus className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Request Save Room</span>
          </button>
        )}

        {/* Pending Admission Requests Badge (Creator/Substitute only) */}
        {isPrivate && isCreatorOrSub && pendingCount > 0 && (
          <button
            onClick={() => openModal('pendingAdmissions')}
            className="relative flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold transition active:scale-95"
          >
            <UserCheck className="w-4 h-4 text-rose-400" />
            <span className="hidden md:inline">Requests</span>
            <span className="w-4 h-4 bg-rose-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center">
              {pendingCount}
            </span>
          </button>
        )}

        {/* Copy Invite Link */}
        <button
          onClick={handleCopyInvite}
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl border border-slate-800 transition"
          title="Copy Room Invitation Link"
          aria-label="Copy invitation link"
        >
          <Share2 className="w-4 h-4" />
        </button>

        {/* Room Details Sidebar Toggle */}
        <button
          onClick={() => openModal('roomDetails')}
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl border border-slate-800 transition"
          title="Room Information & Members"
          aria-label="View room information"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
