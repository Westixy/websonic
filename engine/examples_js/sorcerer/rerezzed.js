// Coded by Sam Aaron

use_debug(false);
const notes = (scale('e1', 'minor_pentatonic', { num_octaves: 2 })).shuffle();

live_loop('rerezzed', async () => {
  reset_tick();
  const t = 0.04;
  await sleep(-t);
  with_fx('bitcrusher', {}, async () => {
    const s = play({ synth: 'dsaw', note: 'e3', sustain: 8, note_slide: t, release: 0 });
    for (let i = 0; i < 64; i++) {
      await sleep(0.125);
      control(s, { note: notes.tick });
    }
  });
  await sleep(t);
});

live_loop('industry', async () => {
  sample('/samples/loop_industrial.flac', { beat_stretch: 1 });
  await sleep(1);
});

live_loop('drive', async () => {
  sample('/samples/bd_haus.flac', { amp: 3 });
  await sleep(0.5);
});
