import type { AudioTrackKey } from '../data/vehicles';
import lamboUrusMp3 from './mizanstock-lamborghini-urus-racing-sound-effect-163336.mp3';
import amgS63Mp3 from './freesound_community-s63-amg-v8-engine-revs-41131.mp3';
import bmwXmMp3 from './mizanstock-bmw-xm-car-sound-2023-165995.mp3';
import bmwI8Mp3 from './modestepmk-bmw-i8-noise-252644.mp3';

const AUDIO_SOURCES: Record<AudioTrackKey, string> = {
  lamborghini: lamboUrusMp3,
  amg_s63: amgS63Mp3,
  bmw_xm: bmwXmMp3,
  bmw_i8: bmwI8Mp3,
};

let activeAudioEl: HTMLAudioElement | null = null;
let activeAudioStopTimer: number | null = null;
let activeFadeTimer: number | null = null;

export function stopActiveEngineAudio(): void {
  if (activeAudioStopTimer !== null) {
    window.clearTimeout(activeAudioStopTimer);
    activeAudioStopTimer = null;
  }
  if (activeFadeTimer !== null) {
    window.clearInterval(activeFadeTimer);
    activeFadeTimer = null;
  }
  if (activeAudioEl) {
    try {
      activeAudioEl.pause();
      activeAudioEl.currentTime = 0;
      activeAudioEl.src = '';
    } catch {
      // Ignore cleanup errors
    }
    activeAudioEl = null;
  }
}

export interface RealAudioPlaybackResult {
  durationMs: number;
  usedRealAudio: boolean;
}

export function playRealCarExhaustAudio(
  trackKey: AudioTrackKey,
  muted: boolean,
  volume = 0.78,
  onEnded?: () => void
): RealAudioPlaybackResult {
  stopActiveEngineAudio();
  const maxPlayMs = 4500;

  if (muted) {
    if (onEnded) {
      activeAudioStopTimer = window.setTimeout(onEnded, 2200);
    }
    return { durationMs: 2200, usedRealAudio: false };
  }

  const srcUrl = AUDIO_SOURCES[trackKey];
  if (srcUrl && typeof Audio !== 'undefined') {
    try {
      const audio = new Audio(srcUrl);
      audio.volume = Math.max(0.05, Math.min(1, volume));
      audio.currentTime = 0;
      activeAudioEl = audio;

      const finish = () => {
        if (activeAudioEl === audio) {
          stopActiveEngineAudio();
          onEnded?.();
        }
      };

      audio.addEventListener('ended', finish, { once: true });

      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch(() => {
          finish();
        });
      }

      // Smoothly fade out after maxPlayMs
      activeAudioStopTimer = window.setTimeout(() => {
        if (activeAudioEl === audio) {
          activeFadeTimer = window.setInterval(() => {
            if (!activeAudioEl || activeAudioEl !== audio || audio.volume <= 0.06) {
              finish();
              return;
            }
            audio.volume = Math.max(0, audio.volume - 0.1);
          }, 55);
        }
      }, maxPlayMs);

      return { durationMs: maxPlayMs, usedRealAudio: true };
    } catch {
      // Ignore unsupported audio contexts cleanly
    }
  }

  if (onEnded) {
    activeAudioStopTimer = window.setTimeout(onEnded, 2200);
  }
  return { durationMs: 2200, usedRealAudio: false };
}
