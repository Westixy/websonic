with_fx('bitcrusher', {}, async () => {
  live_loop('crushed', async () => {
    use_synth('mod_fm');
    play({ note: 50 + choose([5, 0]), mod_phase: 0.25, release: 1, mod_range: choose([24, 27, 12]) });
    await sleep(0.5);
    use_synth('mod_dsaw');
    play({ note: 50, mod_phase: 0.25, release: 1.5, mod_range: choose([24, 27]), attack: 0.5 });
    await sleep(1.5);
  });
});
