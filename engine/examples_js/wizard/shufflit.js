// Coded by Sam Aaron

use_debug(false);
use_random_seed(667);
// load_sample('/samples/ambi_lunar_land.flac');
await sleep(1);

live_loop('travelling', async () => {
  use_synth('beep');
  const notes = scale('e3', 'minor_pentatonic', { num_octaves: 1 });
  use_random_seed(679);
  reset_tick_all();
  with_fx('echo', { phase: 0.125, mix: 0.4, reps: 16 }, async () => {
    await sleep(0.25);
    play({ note: choose(notes), attack: 0, release: 0.1, pan: (range(-1, 1, { step: 0.125 })).tick, amp: rrand(2, 2.5) });
  });
});

live_loop('comet', async () => {
  if (one_in(4)) {
    sample('/samples/ambi_lunar_land.flac');
    console.log('comet_landing');
  }
  await sleep(8);
});

live_loop('shuff', async () => {
  with_fx('hpf', { cutoff: 10, reps: 8 }, async () => {
    tick();
    await sleep(0.25);
    sample('/samples/bd_tek.flac', { amp: look() % 8 === 0 ? 6 : 4 });
    await sleep(0.25);
    use_synth('tb303');
    // use_synth_defaults({ cutoff_attack: 1, cutoff_release: 0, env_curve: 2 });
    if (look() % 2 === 0) {
      play({ note: (ring('e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'c2', 'c2', 'c2', 'c2', 'c2', 'c2', 'c2', 'c2')).look, release: 1.5, cutoff: (range(70, 90)).look, amp: 2 });
    }
    sample('/samples/sn_dub.flac', { rate: -1, sustain: 0, release: (ring(0.05, 0.05, 0.05, 0.5)).look });
  });
});
