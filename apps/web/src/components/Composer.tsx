'use client';
import React, { useState } from 'react';
import { useAppStore } from '../lib/store';
import { MessageType } from '@council/shared';
import {
  Send,
  Paperclip,
  Mic,
  Image as ImageIcon,
  Lock,
  Download,
  Smile,
  X,
} from 'lucide-react';

export function Composer() {
  const { activeRoomId, addMessageMock, addToast } = useAppStore();
  const [content, setContent] = useState('');
  const [allowDownload, setAllowDownload] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);

  if (!activeRoomId) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !attachedImage) return;

    if (attachedImage) {
      addMessageMock(activeRoomId, content, MessageType.IMAGE, {
        id: `media-${Date.now()}`,
        url: attachedImage,
        mimeType: 'image/jpeg',
        size: 1024 * 768,
        downloadAllowed: allowDownload,
      });
      setAttachedImage(null);
    } else {
      addMessageMock(activeRoomId, content);
    }

    setContent('');
  };

  const handleSimulateAttachment = () => {
    // Simulated upload for visual demonstration
    setAttachedImage(
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    );
    addToast({
      type: 'info',
      title: 'Attachment Selected',
      message: `Image attached. Download permission set to: ${
        allowDownload ? 'ALLOWED' : 'LOCKED'
      }`,
    });
  };

  return (
    <div className="border-t border-slate-800 bg-slate-900/90 backdrop-blur-md p-3 sm:p-4 shrink-0">
      {/* 1. Attached Image Preview Bar */}
      {attachedImage && (
        <div className="mb-3 p-2 bg-slate-800 rounded-xl flex items-center justify-between border border-slate-700">
          <div className="flex items-center gap-3">
            <img
              src={attachedImage}
              alt="Attachment Preview"
              className="w-12 h-12 object-cover rounded-lg"
            />
            <div>
              <p className="text-xs font-semibold text-slate-200">Attachment Ready</p>
              <button
                type="button"
                onClick={() => setAllowDownload(!allowDownload)}
                className={`text-[11px] font-medium flex items-center gap-1 mt-0.5 transition ${
                  allowDownload ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {allowDownload ? (
                  <>
                    <Download className="w-3 h-3" /> Official Download Allowed
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3" /> Official Download Locked
                  </>
                )}
                <span className="underline ml-1">(Toggle)</span>
              </button>
            </div>
          </div>
          <button
            onClick={() => setAttachedImage(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700"
            aria-label="Remove attachment"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Controls & Inputs Bar */}
      <form onSubmit={handleSend} className="flex items-center gap-2">
        {/* Media Upload Trigger */}
        <button
          type="button"
          onClick={handleSimulateAttachment}
          className="p-2.5 text-slate-400 hover:text-sky-400 hover:bg-slate-800 rounded-xl transition border border-slate-800 shrink-0"
          title="Attach Image / Video / Audio"
          aria-label="Attach media"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Text Area */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Type a temporary message..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-slate-800/90 border border-slate-700/70 rounded-xl pl-4 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
          />
          <button
            type="button"
            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
            aria-label="Emoji picker"
          >
            <Smile className="w-5 h-5" />
          </button>
        </div>

        {/* Voice Note Trigger */}
        <button
          type="button"
          onClick={() =>
            addToast({
              type: 'info',
              title: 'Voice Recording',
              message: 'Hold to record voice message (Audio sharing enabled).',
            })
          }
          className="p-2.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-xl transition border border-slate-800 shrink-0"
          title="Record Voice Note"
          aria-label="Record voice note"
        >
          <Mic className="w-5 h-5" />
        </button>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!content.trim() && !attachedImage}
          className="p-2.5 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl font-medium transition shadow-lg shadow-sky-600/20 shrink-0 active:scale-95"
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
