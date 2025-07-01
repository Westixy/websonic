// Coded by Sam Aaron

use_sample_bpm('loop_amen');

with_fx('rlpf', { cutoff: 10, cutoff_slide: 4 }, async (c) => {
  live_loop('dnb', async () => {
    sample('/samples/bass_dnb_f.flac', { amp: 5 });
    sample('/samples/loop_amen.flac', { amp: 5 });
    await sleep(1);
    control(c, { cutoff: rrand(40, 120), cutoff_slide: rrand(1, 4) });
  });
});
