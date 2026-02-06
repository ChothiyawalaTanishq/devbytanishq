import { useCallback, useRef } from 'react';

type SoundType = 'beep' | 'glitch' | 'powerUp' | 'pulse' | 'complete';

export const useSynthSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playSound = useCallback((type: SoundType, volume = 0.3) => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      const masterGain = ctx.createGain();
      masterGain.connect(ctx.destination);
      masterGain.gain.value = volume;

      switch (type) {
        case 'beep': {
          // Short sci-fi beep
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(masterGain);
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
          osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
          
          gain.gain.setValueAtTime(0.5, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
          
          osc.start(now);
          osc.stop(now + 0.15);
          break;
        }

        case 'glitch': {
          // Glitchy digital noise
          const bufferSize = ctx.sampleRate * 0.08;
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          
          for (let i = 0; i < bufferSize; i++) {
            // Create bit-crushed noise effect
            const noise = Math.random() * 2 - 1;
            data[i] = Math.round(noise * 4) / 4;
          }
          
          const noise = ctx.createBufferSource();
          const filter = ctx.createBiquadFilter();
          const gain = ctx.createGain();
          
          noise.buffer = buffer;
          filter.type = 'bandpass';
          filter.frequency.value = 2000;
          filter.Q.value = 5;
          
          noise.connect(filter);
          filter.connect(gain);
          gain.connect(masterGain);
          
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
          
          noise.start(now);
          noise.stop(now + 0.08);
          break;
        }

        case 'powerUp': {
          // Rising power-up tone
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(masterGain);
          
          osc1.type = 'sawtooth';
          osc2.type = 'square';
          
          osc1.frequency.setValueAtTime(100, now);
          osc1.frequency.exponentialRampToValueAtTime(400, now + 0.3);
          
          osc2.frequency.setValueAtTime(50, now);
          osc2.frequency.exponentialRampToValueAtTime(200, now + 0.3);
          
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.linearRampToValueAtTime(0.25, now + 0.15);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
          
          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.4);
          osc2.stop(now + 0.4);
          break;
        }

        case 'pulse': {
          // Neural pulse sound
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.connect(gain);
          gain.connect(masterGain);
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
          osc.frequency.exponentialRampToValueAtTime(440, now + 0.1);
          
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.2, now + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
          
          osc.start(now);
          osc.stop(now + 0.2);
          break;
        }

        case 'complete': {
          // Completion chime (ascending notes)
          const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
          
          notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(masterGain);
            
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            const startTime = now + i * 0.08;
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
            
            osc.start(startTime);
            osc.stop(startTime + 0.3);
          });
          break;
        }
      }
    } catch (e) {
      // Audio context not supported or blocked
      console.log('Audio not available');
    }
  }, [getAudioContext]);

  return { playSound };
};
