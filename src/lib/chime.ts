/**
 * A gentle bell shimmer, synthesised with the Web Audio API — no asset files.
 * Must be triggered from a user gesture (the seal tap) so the browser allows it.
 */
export function playChime() {
  try {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();

    const master = ctx.createGain();
    master.gain.value = 0.0001;
    master.connect(ctx.destination);

    // a soft major arpeggio: C5 · E5 · G5 · C6 · E6
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    const now = ctx.currentTime;

    notes.forEach((freq, i) => {
      const t = now + i * 0.14;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;

      // a shimmering sibling an octave up, quieter, for sparkle
      const osc2 = ctx.createOscillator();
      osc2.type = "triangle";
      osc2.frequency.value = freq * 2;
      const g2 = ctx.createGain();

      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.16, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);

      g2.gain.setValueAtTime(0.0001, t);
      g2.gain.exponentialRampToValueAtTime(0.05, t + 0.02);
      g2.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);

      osc.connect(g).connect(master);
      osc2.connect(g2).connect(master);
      osc.start(t);
      osc2.start(t);
      osc.stop(t + 2.6);
      osc2.stop(t + 1.8);
    });

    // overall swell then release
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.9, now + 0.05);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 3.4);

    setTimeout(() => ctx.close().catch(() => {}), 3800);
  } catch {
    /* audio not available — the visuals carry the moment */
  }
}
