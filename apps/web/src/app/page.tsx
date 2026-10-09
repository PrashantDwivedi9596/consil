'use client';
import React from 'react';
import { useAppStore } from '../lib/store';
import { Sidebar } from '../components/Sidebar';
import { ChatHeader } from '../components/ChatHeader';
import { MessageList } from '../components/MessageList';
import { Composer } from '../components/Composer';
import { ToastContainer } from '../components/Toast';
import { CreateRoomModal } from '../components/modals/CreateRoomModal';
import { JoinRoomModal } from '../components/modals/JoinRoomModal';
import { ProfileModal } from '../components/modals/ProfileModal';
import { RoomDetailsModal } from '../components/modals/RoomDetailsModal';
import { SaveRoomVoteModal } from '../components/modals/SaveRoomVoteModal';
import { MediaVoteModal } from '../components/modals/MediaVoteModal';
import { PendingAdmissionsModal } from '../components/modals/PendingAdmissionsModal';
import { AdmissionStatus } from '@council/shared';
import { WifiOff, Clock, ShieldAlert, Lock, Compass } from 'lucide-react';

export default function MainPage() {
  const {
    activeRoomId,
    rooms,
    isConnected,
    setIsConnected,
    openModal,
  } = useAppStore();

  const activeRoom = rooms.find((r) => r.id === activeRoomId);

  return (
    <div className="flex h-screen w-screen bg-slate-900 text-slate-100 overflow-hidden font-sans">
      {/* 1. Sidebar Component (Mobile Drawer + Desktop Fixed) */}
      <Sidebar />

      {/* 2. Main Chat Area Container */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-950/40 relative">
        {/* Connection Offline Indicator Bar */}
        {!isConnected && (
          <div className="bg-rose-600/90 text-white text-xs font-semibold px-4 py-2 flex items-center justify-between shadow-md z-30 animate-pulse">
            <span className="flex items-center gap-2">
              <WifiOff className="w-4 h-4" /> Realtime gateway disconnected. Reconnecting...
            </span>
            <button
              onClick={() => setIsConnected(true)}
              className="px-2.5 py-0.5 bg-white/20 hover:bg-white/30 rounded text-[11px] transition"
            >
              Simulate Reconnect
            </button>
          </div>
        )}

        {/* Selected Room View */}
        {activeRoom ? (
          <>
            {/* Header */}
            <ChatHeader />

            {/* Check User Admission Status (Pending state overlay for private rooms) */}
            {activeRoom.userAdmissionStatus === AdmissionStatus.PENDING ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-slate-950">
                <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center text-rose-400 shadow-xl">
                  <Lock className="w-8 h-8 animate-bounce" />
                </div>
                <div className="max-w-md space-y-2">
                  <h3 className="font-bold text-lg text-slate-100">Admission Pending Approval</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    This is a private room. Possessing the invitation code does not grant immediate access. Your admission request has been sent to the room creator and assigned substitutes.
                  </p>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-amber-400 font-mono">
                  Status: PENDING_ADMISSION (BR-07)
                </div>
              </div>
            ) : (
              <>
                {/* Message List */}
                <MessageList />

                {/* Message Composer */}
                <Composer />
              </>
            )}
          </>
        ) : (
          /* Empty Active Room State */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-4">
            <div className="w-16 h-16 bg-slate-800/80 border border-slate-700/60 rounded-2xl flex items-center justify-center text-sky-400">
              <Compass className="w-8 h-8" />
            </div>
            <div className="max-w-sm space-y-1">
              <h3 className="font-bold text-base text-slate-200">Welcome to Council</h3>
              <p className="text-xs text-slate-400">
                Select a room from the sidebar or create a new temporary/saved room to start chatting.
              </p>
            </div>
            <button
              onClick={() => openModal('createRoom')}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-sky-600/20 transition active:scale-95"
            >
              Create Your First Room
            </button>
          </div>
        )}
      </main>

      {/* 3. Global Modal Dialog System */}
      <CreateRoomModal />
      <JoinRoomModal />
      <ProfileModal />
      <RoomDetailsModal />
      <SaveRoomVoteModal />
      <MediaVoteModal />
      <PendingAdmissionsModal />

      {/* 4. Global Toast Notification System */}
      <ToastContainer />
    </div>
  );
}
