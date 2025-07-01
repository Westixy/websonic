// Coded by Sam Aaron

use_debug(false);
use_random_seed(667);
// load_sample('/samples/ambi_lunar_land.flac');
await sleep(1);

live_loop('foo', async () => {
  with_fx('reverb', { kill_delay: 0.2, room: 0.3 }, async () => {
    for (let i = 0; i < 4; i++) {
      use_random_seed(4000);
      for (let j = 0; j < 8; j++) {
        await sleep(0.25);
        play({ note: choose(chord('e3', 'm7')), release: 0.1, pan: rrand(-1, 1), res: 0.9, amp: 1 });
      }
    }
  });
});

live_loop('bar', async () => {
  if (rand() < 0.25) {
    sample('/samples/ambi_lunar_land.flac');
    console.log('comet_landing');
  }
  await sleep(8);
});

live_loop('baz', async () => {
  tick();
  await sleep(0.25);
  event('beat', { count: look() });
  sample('/samples/bd_haus.flac', { amp: look() % 8 === 0 ? 3 : 2 });
  await sleep(0.25);
  use_synth('fm');
  if (look() % 4 === 0) {
    play({ note: 'e2', release: 1, amp: 1 });
  }
  play({ synth: 'noise', release: 0.051, amp: 0.5 });
});
