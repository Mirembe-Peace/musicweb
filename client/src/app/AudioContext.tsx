import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface AudioContextType {
  currentSongId: string | null;
  isPlaying: boolean;
  isLoading: boolean;
  play: (songId: string, url: string) => void;
  pause: () => void;
  stop: () => void;
  toggle: (songId: string, url: string) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element once
    audioRef.current = new Audio();
    
    const audio = audioRef.current;

    const handleCanPlay = () => setIsLoading(false);
    const handleWaiting = () => setIsLoading(true);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentSongId(null);
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const play = (songId: string, url: string) => {
    if (!audioRef.current) return;

    if (currentSongId !== songId) {
      audioRef.current.src = url;
      setCurrentSongId(songId);
      setIsLoading(true);
    }

    audioRef.current.play();
    setIsPlaying(true);
  };

  const pause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const stop = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentSongId(null);
  };

  const toggle = (songId: string, url: string) => {
    if (currentSongId === songId && isPlaying) {
      pause();
    } else {
      play(songId, url);
    }
  };

  return (
    <AudioContext.Provider value={{ currentSongId, isPlaying, isLoading, play, pause, stop, toggle }}>
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
