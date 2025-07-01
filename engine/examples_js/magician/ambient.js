// Coded by Sam Aaron

// load_samples(sample_names('ambi'));
await sleep(2);

with_fx('reverb', { mix: 0.8 }, async () => {
  live_loop('foo', async () => {
    // try changing the sp_ vars..
    const sp_name = choose(sample_names('ambi'));
    // const sp_name = choose(sample_names('drum'));
    const sp_time = choose([1, 2]);
    // const sp_time = 0.5;
    const sp_rate = 1;
    // const sp_rate = 4;

    const s = sample(sp_name, { cutoff: rrand(70, 130), rate: sp_rate * choose([0.5, 1]), pan: rrand(-1, 1), pan_slide: sp_time });
    control(s, { pan: rrand(-1, 1) });
    await sleep(sp_time);
  });
});
