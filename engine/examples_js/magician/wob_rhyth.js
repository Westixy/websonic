// Coded by Sam Aaron

use_debug(false);

with_fx('reverb', {}, async () => {
  live_loop('choral', async () => {
    const r = choose([0.5, 1.0 / 3, 3.0 / 5]);
    event('choir', { rate: r });
    for (let i = 0; i < 8; i++) {
      sample('/samples/ambi_choir.flac', { rate: r, pan: rrand(-1, 1) });
      await sleep(0.5);
    }
  });
});

live_loop('wub_wub', async () => {
  with_fx('wobble', { phase: 2, reps: 16 }, async (w) => {
    with_fx('echo', { mix: 0.6 }, async () => {
      sample('/samples/drum_heavy_kick.flac');
      sample('/samples/bass_hit_c.flac', { rate: 0.8, amp: 0.4 });
      await sleep(1);
      // try changing the wobble's phase duration:
      // control(w, { phase: choose([0.5, 1, 2]) });
    });
  });
});
