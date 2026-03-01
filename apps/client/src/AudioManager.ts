// src/AudioManager.ts
import { audioLibrary } from "./AudioLibrary";

class AudioManager {
  private audioElements: Record<string, HTMLAudioElement> = {};

  constructor() {
    this.loadAll();
  }

  private loadAll(): void {
    for (const key in audioLibrary) {
      const asset = audioLibrary[key];
      const audio = new Audio(asset.url);
      // Optional: preload files
      // audio.preload = 'auto';
      this.audioElements[key] = audio;
    }
  }

  play(id: string): void {
    const audio = this.audioElements[id];
    if (audio) {
      audio.currentTime = 0; // Reset to start for instant playback
      audio.play();
    }
  }

  stop(id: string): void {
    const audio = this.audioElements[id];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  setVolume(id: string, volume: number): void {
    const audio = this.audioElements[id];
    if (audio) {
      audio.volume = volume; // value between 0 and 1
    }
  }
}

export const audioManager = new AudioManager();
