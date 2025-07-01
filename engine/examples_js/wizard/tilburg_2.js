// Coded by Sam Aaron

use_debug(false);
// load_samples(['guit_em9', 'bd_haus']);

live_loop('low', async () => {
  tick();
  play({ synth: 'zawa', wave: 1, phase: 0.25, release: 5, note: (ring('e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'c1', 'c1', 'c1', 'c1')).look, cutoff: (line(60, 120, { steps: 6 })).look });
  await sleep(4);
});

with_fx('reverb', { room: 1 }, async () => {
  live_loop('lands', async () => {
    use_synth('dsaw');
    use_random_seed(310003);
    const ns = (scale('e2', 'minor_pentatonic', { num_octaves: 4 })).slice(0, 4);
    for (let i = 0; i < 16; i++) {
      play({ note: choose(ns), detune: 12, release: 0.1, amp: 2, amp: rand() + 0.5, cutoff: rrand(70, 120) });
      await sleep(0.125);
    }
  });
});

live_loop('fietsen', async () => {
  await sleep(0.25);
  sample('/samples/guit_em9.flac', { rate: -1 });
  await sleep(7.75);
});

live_loop('tijd', async () => {
  sample('/samples/bd_haus.flac', { amp: 2.5, cutoff: 100 });
  await sleep(0.5);
});

live_loop('ind', async () => {
  sample('/samples/loop_industrial.flac', { beat_stretch: 1 });
  await sleep(1);
});
