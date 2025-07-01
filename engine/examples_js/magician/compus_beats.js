// Coded by Sam Aaron

use_sample_bpm('loop_compus', { num_beats: 4 });

live_loop('loopr', async () => {
  if (!one_in(10)) {
    sample('/samples/loop_compus.flac', { rate: choose([0.5, 1, 1, 1, 1, 2]) });
  }
  await sleep(4);
});

live_loop('bass', async () => {
  if (one_in(4)) {
    sample('/samples/bass_voxy_c.flac', { amp: rrand(0.1, 0.2), rate: choose([0.5, 0.5, 1, 1, 2, 4]) });
  }
  use_synth('mod_pulse');
  // use_synth_defaults({ mod_invert_wave: 1 });
  play({ note: 'C1', mod_range: 12, amp: rrand(0.5, 1), mod_phase: choose([0.25, 0.5, 1]), release: 1, cutoff: rrand(50, 90) });
  play({ note: 'C2', mod_range: choose([24, 36, 34]), amp: 0.35, mod_phase: 0.25, release: 2, cutoff: 60, pulse_width: rand() });
  await sleep(1);
});
