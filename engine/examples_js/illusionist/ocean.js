// Coded by Sam Aaron

with_fx('reverb', { mix: 0.5 }, async () => {
  live_loop('oceans', async () => {
    const s = play({
      synth: choose(['bnoise', 'cnoise', 'gnoise']),
      amp: rrand(0.5, 1.5),
      attack: rrand(0, 4),
      sustain: rrand(0, 2),
      release: rrand(1, 5),
      cutoff_slide: rrand(0, 5),
      cutoff: rrand(60, 100),
      pan: rrand(-1, 1),
      pan_slide: rrand(1, 5),
      amp: rrand(0.5, 1),
    });
    control(s, { pan: rrand(-1, 1), cutoff: rrand(60, 110) });
    await sleep(rrand(2, 4));
  });
});
