'use client';
import React, { useState } from 'react';
import { useAppStore } from '../lib/store';
import { RoomType, PrivacyMode } from '@council/shared';
import {
  MessageSquare,
  Plus,
  Compass,
  Lock,
  Globe,
  Clock,
  ShieldCheck,
  Search,
  User,
  Settings,
  X,
  Sparkles,
} from 'lucide-react';

export function Sidebar() {
  const {
    currentUser,
    rooms,
    activeRoomId,
    setActiveRoomId,
    isSidebarOpenMobile,
    setSidebarOpenMobile,
    openModal,
  } = useAppStore();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'temporary' | 'persistent'>('all');

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.name.toLowerCase().includes(search.toLowerCase());
    if (filter === 'temporary') return matchesSearch && room.roomType === RoomType.TEMPORARY;
    if (filter === 'persistent') return matchesSearch && room.roomType === RoomType.PERSISTENT;
    return matchesSearch;
  });

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-full sm:w-80 md:w-96 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
        isSidebarOpenMobile ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* 1. Header / Brand & Profile Bar */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.username}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-sky-500/40"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-100 flex items-center gap-1.5">
              {currentUser.username}
              <button
                onClick={() => openModal('profileEditor')}
                className="text-slate-400 hover:text-sky-400 transition"
                aria-label="Edit Profile"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            </h3>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Remembered Device Identity
            </p>
          </div>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={() => setSidebarOpenMobile(false)}
          className="lg:hidden text-slate-400 hover:text-white p-2 rounded-lg"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Action Buttons */}
      <div className="p-3 grid grid-cols-2 gap-2 bg-slate-900/50">
        <button
          onClick={() => openModal('createRoom')}
          className="flex items-center justify-center gap-2 py-2 px-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-medium text-xs shadow-lg shadow-sky-600/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4" /> Create Room
        </button>
        <button
          onClick={() => openModal('joinRoom')}
          className="flex items-center justify-center gap-2 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium text-xs border border-slate-700 transition active:scale-95"
        >
          <Compass className="w-4 h-4 text-sky-400" /> Join via Code
        </button>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="p-3 border-b border-slate-800/60 space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search rooms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
          />
        </div>

        <div className="flex gap-1 p-1 bg-slate-800/40 rounded-xl border border-slate-800">
          {(['all', 'temporary', 'persistent'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`flex-1 py-1 text-[11px] font-medium rounded-lg capitalize transition ${
                filter === t
                  ? 'bg-slate-700 text-sky-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Room List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredRooms.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No rooms found matching "{search}"
          </div>
        ) : (
          filteredRooms.map((room) => {
            const isActive = activeRoomId === room.id;
            const isTemp = room.roomType === RoomType.TEMPORARY;
            const isPrivate = room.privacyMode === PrivacyMode.PRIVATE;

            return (
              <button
                key={room.id}
                onClick={() => setActiveRoomId(room.id)}
                className={`w-full p-3 rounded-2xl text-left transition flex items-start justify-between gap-3 group relative ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-md border border-slate-700/80'
                    : 'hover:bg-slate-800/40 text-slate-300'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-slate-100 truncate group-hover:text-sky-300 transition">
                      {room.name}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                    {/* Room Type Badge */}
                    {isTemp ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                        <Clock className="w-3 h-3" /> Temporary
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                        <ShieldCheck className="w-3 h-3" /> Saved
                      </span>
                    )}

                    {/* Privacy Badge */}
                    {isPrivate ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <Lock className="w-2.5 h-2.5" /> Private
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                        <Globe className="w-2.5 h-2.5" /> Open
                      </span>
                    )}

                    <span className="text-slate-400 ml-auto">
                      {room.joinedMemberCount} members
                    </span>
                  </div>
                </div>

                {room.unreadCount > 0 && (
                  <span className="w-5 h-5 bg-sky-500 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center shrink-0">
                    {room.unreadCount}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>

      {/* 5. Footer Info */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Realtime Engine Ready
        </span>
        <span className="text-slate-400">v1.0.0</span>
      </div>
    </aside>
  );
}
