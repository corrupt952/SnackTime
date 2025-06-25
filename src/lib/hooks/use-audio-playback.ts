import { useRef, useCallback, useEffect } from "react";
import { AlarmSound } from "@/domain/settings/models/settings";

export function useAudioPlayback(alarmSound: AlarmSound, volume: number) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Reset audio buffer when alarm sound changes
  useEffect(() => {
    audioBufferRef.current = null;
  }, [alarmSound]);

  const playSound = useCallback(async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.connect(audioContextRef.current.destination);
      }

      if (!audioBufferRef.current) {
        const response = await fetch(chrome.runtime.getURL(`sounds/${alarmSound}.wav`));
        const arrayBuffer = await response.arrayBuffer();
        audioBufferRef.current = await audioContextRef.current.decodeAudioData(arrayBuffer);
      }

      await audioContextRef.current.resume();
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBufferRef.current;
      
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.value = volume;
        source.connect(gainNodeRef.current);
      }
      
      source.start();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  }, [alarmSound, volume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close();
      }
    };
  }, []);

  return { playSound };
}