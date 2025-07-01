use_synth('tb303');

live_loop('foo', async () => {
  await sleep(0.5);
});

sync('foo');

with_fx('reverb', {}, async () => {
  with_fx('slicer', { phase: 0.5, wave: 0, invert_wave: 1 }, async () => {
    play({ note: 50 - 24, cutoff: 120, cutoff_attack: 0.3, res: 0.93, release: 60 });
  });
});
