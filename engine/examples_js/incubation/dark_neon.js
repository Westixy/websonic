// Coded by Sam Aaron

live_loop('foo', async () => {
  sample('/samples/bd_haus.flac', { amp: 5, cutoff: 50, release: 0.1 });
  await sleep(0.5);
});

live_loop('mel', async () => {
  with_fx('wobble', { phase: 1, invert_wave: 1, wave: 0, cutoff_max: 80, cutoff_min: 60 }, async () => {
    play({ synth: 'blade', note: 'cs1', release: 4, cutoff: 110, amp: 1, pitch_shift: 0 });
  });
  with_fx('reverb', { room: 1 }, async () => {
    with_fx('bitcrusher', { mix: 0.4 }, async () => {
      sample('/samples/bass_trance_c.flac', { rate: 0.5, pitch: 0, window_size: 0.125, time_dis: 0.125, amp: 8, release: 0.2 });
    });
  });
  await sleep(4);
});
