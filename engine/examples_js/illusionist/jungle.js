// Coded by Sam Aaron
use_bpm(50);

with_fx('lpf', { cutoff: 90 }, async () => {
  with_fx('reverb', { mix: 0.5 }, async () => {
    with_fx('compressor', { pre_amp: 40 }, async () => {
      with_fx('distortion', { distort: 0.4 }, async () => {
        live_loop('jungle', async () => {
          use_random_seed(667);
          for (let i = 0; i < 4; i++) {
            sample('/samples/loop_amen.flac', { beat_stretch: 1, rate: choose([1, 1, 1, -1]) / 2.0, finish: 0.5, amp: 0.5 });
            sample('/samples/loop_amen.flac', { beat_stretch: 1 });
            await sleep(1);
          }
        });
      });
    });
  });
});
