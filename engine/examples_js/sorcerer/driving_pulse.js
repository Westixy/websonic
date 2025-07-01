// Coded by Sam Aaron

// load_sample('/samples/drum_heavy_kick.flac');

live_loop('drums', async () => {
  sample('/samples/drum_heavy_kick.flac', { rate: 0.75 });
  await sleep(0.5);
  sample('/samples/drum_heavy_kick.flac');
  await sleep(0.5);
});

live_loop('synths', async () => {
  use_synth('mod_pulse');
  // use_synth_defaults({ amp: 1, mod_range: 15, cutoff: 80, pulse_width: 0.2, attack: 0.03, release: 0.6, mod_phase: 0.25, mod_invert_wave: 1 });
  play({ note: 30 });
  await sleep(0.25);
  play({ note: 38 });
  await sleep(0.25);
});
