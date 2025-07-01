// Steve Reich's Piano Phase
// See: https://en.wikipedia.org/wiki/Piano_Phase

// use_synth('piano');
const notes = ring('E4', 'Fs4', 'B4', 'Cs5', 'D5', 'Fs4', 'E4', 'Cs5', 'B4', 'Fs4', 'D5', 'Cs5');

live_loop('slow', async () => {
  play({ note: notes.tick, release: 0.1 });
  await sleep(0.3);
});

live_loop('faster', async () => {
  play({ note: notes.tick, release: 0.1 });
  await sleep(0.295);
});
