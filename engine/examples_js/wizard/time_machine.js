// Coded by Sam Aaron

use_debug(false);

live_loop('time', async () => {
  play({ synth: 'tb303', release: 8, note: 'e1', cutoff: (range(90, 60, -10)).tick });
  await sleep(8);
});

live_loop('machine', async () => {
  sample('/samples/loop_garzul.flac', { rate: (ring(1, 1, 1, -1)).tick });
  await sleep(8);
});

live_loop('vortex', async () => {
  use_synth(choose(['pulse', 'beep']));
  await sleep(0.125 / 2);
  play({ note: (scale('e1', 'minor_pentatonic')).tick, attack: 0.125, release: 0, amp: 2, cutoff: (ring(70, 90, 100, 130)).look });
  await sleep(0.125 / 2);
});

live_loop('moon_bass', async () => {
  sample('/samples/bd_haus.flac', { amp: 1.5 });
  await sleep(0.5);
});
