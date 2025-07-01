// Coded by Sam Aaron

use_synth('fm');

live_loop('sci_fi', async () => {
  const p = play({
    note: choose(chord('Eb3', 'minor')) - choose([0, 12, -12]),
    divisor: 0.01,
    div_slide: rrand(0, 10),
    depth: rrand(0.001, 2),
    attack: 0.01,
    release: rrand(0, 5),
    amp: 0.5,
  });
  control(p, { divisor: rrand(0.001, 50) });
  await sleep(choose([0.5, 1, 2]));
});
