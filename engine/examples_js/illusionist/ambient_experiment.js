// Coded by Darin Wilson
//
// The piece consists of three long loops, each of which
// plays one of two randomly selected pitches. Each note
// has different attack, release and sleep values, so that
// they move in and out of phase with each other. This can
// play for quite awhile without repeating itself :)

use_synth('hollow');
with_fx('reverb', { mix: 0.7 }, async () => {

  live_loop('note1', async () => {
    play({ note: choose(['D4','E4']), attack: 6, release: 6 });
    await sleep(8);
  });

  live_loop('note2', async () => {
    play({ note: choose(['Fs4','G4']), attack: 4, release: 5 });
    await sleep(10);
  });

  live_loop('note3', async () => {
    play({ note: choose(['A4', 'Cs5']), attack: 5, release: 5 });
    await sleep(11);
  });

});
