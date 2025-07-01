// Coded by Sam Aaron

live_loop('haunted', async () => {
  sample('/samples/perc_bell.flac', { rate: rrand(-1.5, 1.5) });
  await sleep(rrand(0.1, 2));
});
