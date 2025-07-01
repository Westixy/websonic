// Coded by Sam Aaron

// load_samples(['drum_heavy_kick', 'elec_plip', 'elec_blip']);
use_bpm(100);
use_random_seed(100);

with_fx('reverb', { mix: 0.6, room: 0.8 }, async () => {
  with_fx('echo', { room: 0.8, decay: 8, phase: 1, mix: 0.4 }, async () => {
    live_loop('blip', async () => {
      const n = choose(['e2', 'e2', 'a3']);

      use_synth('dsaw');
      // with_transpose(-12, () => {
      live_loop('blip_transpose', async () => {
        for (let i = 0; i < 2; i++) {
          play({ note: n, attack: 0.6, release: 0.8, detune: rrand(0, 0.1), cutoff: rrand(80, 120) });
          await sleep(3);
        }
      });
      // });

      await sleep(4);

      use_synth('tri');
      play({ note: chord(n, 'm7'), amp: 5, release: 0.8 });

      await sleep(2);
    });
  });
});

with_fx('echo', { room: 0.8, decay: 8, phase: 0.25, mix: 0.4 }, async () => {
  live_loop('rhythm', async () => {
    sample('/samples/drum_heavy_kick.flac', { amp: 0.5 });
    sample('/samples/elec_plip.flac', { rate: choose([0.5, 2, 1, 4]) * choose([1, 2, 3, 10]), amp: 0.6 });
    await sleep(2);
  });
});
