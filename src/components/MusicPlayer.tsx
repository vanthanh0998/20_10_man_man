import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Play, Pause } from 'lucide-react';
import { romanticSynth } from '../utils/romanticSynth.ts';

interface MusicPlayerProps {
  autoStartTrigger?: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ autoStartTrigger }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(75);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  useEffect(() => {
    if (autoStartTrigger && !isPlaying) {
      romanticSynth.start();
      setIsPlaying(true);
    }
  }, [autoStartTrigger]);

  const togglePlay = () => {
    const nextState = romanticSynth.toggle();
    setIsPlaying(nextState);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    romanticSynth.setVolume(val / 100);
  };

  return (
    <div className="fixed bottom-6 right-5 z-50 flex items-center gap-2">
      {/* Expanded controls */}
      {isExpanded && (
        <div className="flex items-center gap-3 rounded-full bg-white/95 px-4 py-2 shadow-lg backdrop-blur-md border border-rose-200 transition-all duration-300">
          <button
            onClick={togglePlay}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 text-white transition-transform hover:scale-105 active:scale-95"
            title={isPlaying ? "Tạm dừng" : "Phát nhạc"}
            aria-label={isPlaying ? "Tạm dừng nhạc" : "Phát nhạc"}
          >
            {isPlaying ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
          </button>

          <div className="flex items-center gap-2">
            {volume === 0 ? (
              <VolumeX size={16} className="text-rose-400" />
            ) : (
              <Volume2 size={16} className="text-rose-600" />
            )}
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="h-1.5 w-16 accent-rose-600 cursor-pointer"
              aria-label="Điều chỉnh âm lượng"
            />
          </div>

          <span className="text-xs text-rose-800 font-medium whitespace-nowrap">
            Giai điệu lãng mạn
          </span>
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => {
          if (!isPlaying) {
            togglePlay();
          } else {
            setIsExpanded(!isExpanded);
          }
        }}
        className={`group relative flex h-12 w-12 items-center justify-center rounded-full shadow-xl transition-all duration-300 ${
          isPlaying
            ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-rose-300/50'
            : 'bg-white text-rose-600 border border-rose-200 hover:bg-rose-50'
        }`}
        title={isPlaying ? "Bấm để mở cài đặt âm thanh" : "Bật nhạc nền lãng mạn"}
        aria-label="Bật hoặc tắt nhạc nền lãng mạn"
      >
        {isPlaying ? (
          <div className="flex items-end gap-0.5 h-4">
            <span className="w-1 bg-white rounded-full animate-bounce" style={{ height: '70%', animationDuration: '600ms' }} />
            <span className="w-1 bg-white rounded-full animate-bounce" style={{ height: '100%', animationDuration: '800ms', animationDelay: '150ms' }} />
            <span className="w-1 bg-white rounded-full animate-bounce" style={{ height: '50%', animationDuration: '500ms', animationDelay: '300ms' }} />
            <span className="w-1 bg-white rounded-full animate-bounce" style={{ height: '85%', animationDuration: '750ms', animationDelay: '200ms' }} />
          </div>
        ) : (
          <Music size={20} className="group-hover:scale-110 transition-transform" />
        )}

        {/* Ping pulse ring when playing */}
        {isPlaying && (
          <span className="absolute -inset-1 rounded-full bg-rose-400 opacity-20 animate-ping pointer-events-none" />
        )}
      </button>
    </div>
  );
};
