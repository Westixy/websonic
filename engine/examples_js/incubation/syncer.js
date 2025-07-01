live_loop('ticker', async () => {
  event('tick');
  await sleep(1);
});

live_loop('kicker', async () => {
  await sync('tick');
  sample('/samples/drum_heavy_kick.flac');
});

live_loop('synther', async () => {
  use_synth('mod_saw');
  await sync('tick');
  play({ note: choose(chord('e1', 'minor')), mod_phase: choose([1, 0.5, 0.25, 0.125]), cutoff: rrand(80, 110) });
});
