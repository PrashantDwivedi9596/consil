'use client';
import React from 'react';
import { useAppStore } from '../lib/store';
import { MessageType } from '@council/shared';
import {
  Lock,
  Download,
  Vote,
  CheckCheck,
  Check,
  FileText,
  BookmarkPlus,
} from 'lucide-react';

export function MessageList() {
  const {
    activeRoomId,
    messages,
    currentUser,
    activeVotes,
    openModal,
  } = useAppStore();

  if (!activeRoomId) return null;

  const roomMessages = messages[activeRoomId] || [];
  const currentVote = activeVotes[activeRoomId];

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/60">
      {/* 1. Active Vote Banner (if a vote is in progress for this room) */}
      {currentVote && (
        <div className="mx-auto max-w-lg bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <BookmarkPlus className="w-5 h-5 shrink-0" />
              Active Vote: Convert to Persistent Room
            </div>
            <span className="text-[11px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/40">
              OPEN
            </span>
          </div>

          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
            {currentVote.yesCount} YES votes of {Math.ceil(currentVote.eligibleMemberSnapshot * 0.5)} required 50% approval (N={currentVote.eligibleMemberSnapshot} joined members snapshot).
          </p>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
              <div
                className="bg-amber-400 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(
                    100,
                    (currentVote.yesCount / Math.ceil(currentVote.eligibleMemberSnapshot * 0.5)) * 100,
                  )}%`,
                }}
              />
            </div>

            <button
              onClick={() => openModal('saveVote')}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded-xl transition shrink-0 active:scale-95"
            >
              Vote Now
            </button>
          </div>
        </div>
      )}

      {/* 2. Message History */}
      {roomMessages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm">
          <p>No messages yet. Send a message to start chatting!</p>
        </div>
      ) : (
        roomMessages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] sm:max-w-[70%] ${
                isMe ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {!isMe && (
                <img
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700 shrink-0 mt-1"
                />
              )}

              <div className="space-y-1">
                {!isMe && (
                  <span className="text-[11px] font-medium text-slate-400 px-1">
                    {msg.senderName}
                  </span>
                )}

                <div
                  className={`p-3 rounded-2xl shadow-md ${
                    isMe
                      ? 'bg-sky-600 text-white rounded-tr-none'
                      : 'bg-slate-800 text-slate-100 border border-slate-700/60 rounded-tl-none'
                  }`}
                >
                  {/* Text Content */}
                  {msg.content && (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {msg.content}
                    </p>
                  )}

                  {/* Media Content */}
                  {msg.media && (
                    <div className="mt-2 space-y-2">
                      <div className="relative rounded-xl overflow-hidden border border-slate-700/80 bg-slate-900 group">
                        <img
                          src={msg.media.url}
                          alt="Shared attachment"
                          className="w-full max-h-60 object-cover"
                        />

                        {/* Download Lock Status */}
                        <div className="p-2.5 bg-slate-900/90 backdrop-blur-md flex items-center justify-between border-t border-slate-800 text-xs">
                          {msg.media.downloadAllowed ? (
                            <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                              <Download className="w-3.5 h-3.5" /> Official Download Permitted
                            </span>
                          ) : (
                            <span className="text-amber-400 font-medium flex items-center gap-1.5">
                              <Lock className="w-3.5 h-3.5" /> Download Locked by Uploader
                            </span>
                          )}

                          {!msg.media.downloadAllowed && (
                            <button
                              onClick={() => openModal('mediaVote', msg.media?.id)}
                              className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition"
                            >
                              <Vote className="w-3 h-3" /> Vote to Unlock
                            </button>
                          )}

                          {msg.media.downloadAllowed && (
                            <a
                              href={msg.media.url}
                              download
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 transition"
                            >
                              <Download className="w-3 h-3" /> Download
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Timestamp & Status */}
                  <div
                    className={`mt-1 flex items-center gap-1 text-[10px] ${
                      isMe ? 'text-sky-200 justify-end' : 'text-slate-400'
                    }`}
                  >
                    <span>{msg.createdAt}</span>
                    {isMe && (
                      <span>
                        {msg.status === 'read' ? (
                          <CheckCheck className="w-3 h-3 text-emerald-300" />
                        ) : (
                          <Check className="w-3 h-3 text-sky-200" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
