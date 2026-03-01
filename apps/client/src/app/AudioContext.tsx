import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

export interface TrackMeta {
  title: string;
  artist?: string;
  coverUrl?: string;
}

interface AudioContextType {
  currentSongId: string | null;
  trackMeta: TrackMeta | null;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  play: (songId: string, url: string, meta?: TrackMeta) => void;
  pause: () => void;
  stop: () => void;
  toggle: (songId: string, url: string, meta?: TrackMeta) => void;
  seek: (time: number) => void;
  setVolume: (v: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);
  const [trackMeta, setTrackMeta] = useState<TrackMeta | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element once
    const audio = new Audio();
    audio.volume = 0.8;
    audioRef.current = audio;

    const handleCanPlay = () => setIsLoading(false);
    const handleWaiting = () => setIsLoading(true);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentSongId(null);
      setTrackMeta(null);
      setCurrentTime(0);
    };
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration || 0);

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const play = useCallback((songId: string, url: string, meta?: TrackMeta) => {
    if (!audioRef.current) return;

    if (currentSongId !== songId) {
      audioRef.current.src = url;
      setCurrentSongId(songId);
      setTrackMeta(meta ?? { title: songId });
      setIsLoading(true);
      setCurrentTime(0);
      setDuration(0);
    }

    audioRef.current.play();
    setIsPlaying(true);
  }, [currentSongId]);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const stop = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentSongId(null);
    setTrackMeta(null);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  const toggle = useCallback((songId: string, url: string, meta?: TrackMeta) => {
    if (currentSongId === songId && isPlaying) {
      pause();
    } else {
      play(songId, url, meta);
    }
  }, [currentSongId, isPlaying, pause, play]);

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
    if (audioRef.current) audioRef.current.volume = clamped;
  }, []);

  return (
    <AudioContext.Provider value={{
      currentSongId, trackMeta, isPlaying, isLoading,
      currentTime, duration, volume,
      play, pause, stop, toggle, seek, setVolume,
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
