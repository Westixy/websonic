// Coded by Sam Aaron

use_debug(false);
// load_samples(['drum_heavy_kick', 'drum_snare_soft']);

live_loop('drums', async () => {
  console.log("slow drums");
  for (let i = 0; i < 6; i++) {
    sample('/samples/drum_heavy_kick.flac', { rate: 0.8 });
    await sleep(0.5);
  }

  console.log("fast drums");
  for (let i = 0; i < 8; i++) {
    sample('/samples/drum_heavy_kick.flac', { rate: 0.8 });
    await sleep(0.125);
  }
});

live_loop('synths', async () => {
  await sleep(6);
  console.log("how does it feel?");
  use_synth('mod_saw');
  // use_synth_defaults({ amp: 0.5, attack: 0, sustain: 1, release: 0.25, mod_range: 12, mod_phase: 0.5, mod_invert_wave: 1 });
  const notes = ring('F', 'C', 'D', 'D', 'G', 'C', 'D', 'D');
  for (const n of notes._arr) {
    tick();
    play({ note: note(n, { octave: 1 }), cutoff: (line(90, 130, { steps: 16 })).look });
    play({ note: note(n, { octave: 2 }), cutoff: (line(90, 130, { steps: 32 })).look });
    await sleep(1);
  }
});

live_loop('snare', async () => {
  await sleep(12.5);
  sample('/samples/drum_snare_soft.flac');
  await sleep(1);
});
