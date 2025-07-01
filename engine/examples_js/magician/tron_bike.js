// Coded by Sam Aaron

use_random_seed(10);
const note_choices = ring('b1', 'b2', 'e1', 'e2', 'b3', 'e3');

live_loop('tron', async () => {
  use_synth('dsaw');
  with_fx('slicer', { phase: choose([0.25, 0.125]) }, async () => {
    with_fx('reverb', { room: 0.5, mix: 0.3 }, async () => {
      const n1 = choose(chord(note_choices.tick, 'minor'));
      const n2 = choose(chord(note_choices.tick, 'minor'));

      const p = play({
        note: n1,
        amp: 2,
        release: 8,
        note_slide: 4,
        cutoff: 30,
        cutoff_slide: 4,
        detune: rrand(0, 0.2),
      });
      control(p, { note: n2, cutoff: rrand(80, 120) });
    });
  });

  await sleep(8);
});
