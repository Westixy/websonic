// Coded by Sam Aaron

use_debug(false);
// load_sample('/samples/bd_fat.flac');

for (let i = 0; i < 8; i++) {
  sample('/samples/bd_fat.flac', { amp: (line(0, 5, { steps: 8 })).tick });
  await sleep(0.5);
}

live_loop('drums', async () => {
  sample('/samples/bd_fat.flac', { amp: 5 });
  await sleep(0.5);
});

live_loop('acid', async () => {
  event('foo');
  for (let i = 0; i < 4; i++) {
    use_random_seed(667);
    for (let j = 0; j < 16; j++) {
      use_synth('tb303');
      play({ note: choose(chord('e3', 'minor')), attack: 0, release: 0.1, cutoff: rrand_i(50, 90) + j * 10 });
      await sleep(0.125);
    }
  }

  event('bar');
  for (let i = 0; i < 32; i++) {
    use_synth('tb303');
    play({ note: choose(chord('a3', 'minor')), attack: 0, release: 0.05, cutoff: rrand_i(70, 98) + i, res: rrand(0.9, 0.95) });
    await sleep(0.125);
  }

  event('baz');
  with_fx('reverb', { mix: 0.3 }, async (r) => {
    for (let m = 0; m < 32; m++) {
      if (m % 8 === 0 && m !== 0) {
        control(r, { mix: 0.3 + (0.5 * (m / 32.0)) });
      }
      use_synth('prophet');
      play({ note: choose(chord('e3', 'minor')), attack: 0, release: 0.08, cutoff: rrand_i(110, 130) });
      await sleep(0.125);
    }
  });

  event('quux');
  live_loop('quux_loop', async () => {
    use_random_seed(668);
    with_fx('echo', { phase: 0.125 }, async () => {
      for (let i = 0; i < 16; i++) {
        use_synth('tb303');
        play({ note: choose(chord('e3', 'minor')), attack: 0, release: 0.1, cutoff: rrand(50, 100) });
        await sleep(0.25);
      }
    });
  });

  await sleep(4);
});
