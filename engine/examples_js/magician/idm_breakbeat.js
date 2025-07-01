// Coded by Sam Aaron

live_loop('idm_bb', async () => {
  const n = choose([1, 2, 4, 8, 16]);
  sample('/samples/drum_heavy_kick.flac', { amp: 2 });
  if (one_in(8)) {
    sample('/samples/ambi_drone.flac', { rate: choose([0.25, 0.5, 0.125, 1]), amp: 0.25 });
  }
  if (one_in(8)) {
    sample('/samples/ambi_lunar_land.flac', { rate: choose([0.5, 0.125, 1, -1, -0.5]), amp: 0.25 });
  }
  sample('/samples/loop_amen.flac', { attack: 0, release: 0.05, start: 1 - (1.0 / n), rate: choose([1, 1, 1, 1, 1, 1, -1]) });
  await sleep(sample_duration('/samples/loop_amen.flac') / n);
});
