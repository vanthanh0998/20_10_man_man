/**
 * Romantic Ambient Piano & Celesta Sound Generator
 * Generates an emotional, peaceful, gentle romantic melody using Web Audio API.
 * Never fails or depends on external audio servers or broken MP3 URLs.
 */

class RomanticMelodyPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timerId: number | null = null;
  private volumeNode: GainNode | null = null;
  private noteIndex: number = 0;

  // Romantic chord progression in D Major: Dmaj9 -> Bm9 -> Gmaj7 -> Aadd9
  // Frequencies in Hz
  private chords = [
    // Dmaj9
    [146.83, 220.00, 277.18, 329.63, 440.00, 554.37, 659.25],
    // Bm9
    [123.47, 185.00, 246.94, 293.66, 370.00, 440.00, 587.33],
    // Gmaj7
    [98.00, 146.83, 196.00, 246.94, 293.66, 370.00, 493.88],
    // Aadd9 / Asus4
    [110.00, 164.81, 220.00, 277.18, 329.63, 440.00, 554.37],
    // F#m7
    [92.50, 146.83, 185.00, 220.00, 277.18, 370.00, 440.00],
    // Em9
    [82.41, 123.47, 164.81, 246.94, 329.63, 392.00, 493.88],
    // Gmaj9
    [98.00, 146.83, 196.00, 293.66, 370.00, 440.00, 587.33],
    // A7
    [110.00, 164.81, 220.00, 277.18, 329.63, 440.00, 554.37]
  ];

  private currentChordIdx = 0;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.volumeNode = this.ctx.createGain();
      this.volumeNode.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.volumeNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    if (this.volumeNode && this.ctx) {
      const clamped = Math.max(0, Math.min(1, val));
      this.volumeNode.gain.setTargetAtTime(clamped * 0.4, this.ctx.currentTime, 0.1);
    }
  }

  private playTone(freq: number, duration: number, isBass = false) {
    if (!this.ctx || !this.volumeNode) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Use warm sine with subtle triangle blend
    osc.type = isBass ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    // Warm low-pass acoustic filtering
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(isBass ? 400 : 1200, this.ctx.currentTime);
    filter.Q.setValueAtTime(1, this.ctx.currentTime);

    const now = this.ctx.currentTime;
    const peakGain = isBass ? 0.35 : 0.22;

    // Gentle soft attack and slow natural bell/piano decay
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(peakGain, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.volumeNode);

    osc.start(now);
    osc.stop(now + duration + 0.1);
  }

  private step() {
    if (!this.isPlaying || !this.ctx) return;

    const chord = this.chords[this.currentChordIdx];

    // Every 8 notes, change chord and play root bass
    if (this.noteIndex % 8 === 0) {
      this.playTone(chord[0], 4.2, true);
      this.playTone(chord[1], 3.8, false);
    }

    // Melodic arpeggio patterns
    const notePattern = [2, 3, 4, 5, 4, 3, 5, 6];
    const targetToneIdx = notePattern[this.noteIndex % 8] % chord.length;
    const tone = chord[targetToneIdx];

    // Play gentle piano/music box bell note
    this.playTone(tone, 2.4, false);

    // Occasional higher shimmer/sparkle harmony
    if (this.noteIndex % 4 === 2) {
      const sparkleTone = chord[(targetToneIdx + 2) % chord.length] * 1.5;
      setTimeout(() => {
        if (this.isPlaying) {
          this.playTone(sparkleTone, 1.8, false);
        }
      }, 250);
    }

    this.noteIndex++;
    if (this.noteIndex % 8 === 0) {
      this.currentChordIdx = (this.currentChordIdx + 1) % this.chords.length;
    }

    // Tempo: ~550ms per gentle note (largo / andante)
    this.timerId = window.setTimeout(() => this.step(), 520);
  }

  public start() {
    if (this.isPlaying) return;
    this.initContext();
    this.isPlaying = true;
    this.step();
  }

  public pause() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const romanticSynth = new RomanticMelodyPlayer();
