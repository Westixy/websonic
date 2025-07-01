// Coded by Sam Aaron

use_debug(false);

live_loop('skit', async () => {
  with_fx('slicer', { phase: 1, invert_wave: 1, wave: 0 }, async () => {
    with_fx('slicer', { wave: 0, phase: 0.25 }, async () => {
      sample('/samples/loop_mika.flac', { rate: 1, amp: 2 });
    });
    await sleep(8);
  });
});

live_loop('foo', async () => {
  if (tick() % 4 === 0) {
    tick('note');
  }
  use_synth('square');
  for (let i = 0; i < 2; i++) {
    play({ note: (ring('c2', 'c2', 'e1', 'f3')).look('note'), release: 0, attack: 0.25, amp: 1, cutoff: rrand_i(70, 130) });
    await sleep(0.5);
  }
});

live_loop('kik', async () => {
  for (let i = 0; i < 1; i++) {
    sample('/samples/bd_haus.flac', { amp: 2 });
    await sleep(0.5);
  }
});

live_loop('piano', async () => {
  await sleep(4);
  with_fx('slicer', { phase: 0.25, wave: 1 }, async () => {
    await sleep(4);
    sample('/samples/ambi_piano.flac', { amp: 2 });
  });
});
