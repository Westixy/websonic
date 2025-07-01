// Coded by Sam Aaron

use_bpm(50);
const notes = (scale('c1', 'minor_pentatonic', { num_octaves: 1 })).shuffle();

live_loop('lorezzed', async () => {
  with_fx('compressor', { pan: -0.3, amp: 2 }, async () => {
    reset_tick();
    const t = 0.04;
    await sleep(-t);
    with_fx('lpf', { cutoff: rrand(100, 130) }, async () => {
      with_fx('krush', { amp: 1.8 }, async () => {
        const s = play({ synth: 'dsaw', note: 'c3', sustain: 4, note_slide: t, release: 0 });
        for (let i = 0; i < 7; i++) {
          await sleep(0.25);
          control(s, { note: notes.tick });
        }
      });
    });
    await sleep(t);
  });
});

with_fx('reverb', { room: 1 }, async () => {
  live_loop('synth_attack', async () => {
    tick();
    with_fx('compressor', { amp: 1.5, pan: 0.3 }, async () => {
      with_fx('lpf', { cutoff: (line(70, 131, { steps: 32 })).look }, async () => {
        const count = (ring(1, 1, 1, 1, 1, 1, 1, 4)).look;
        for (let i = 0; i < count; i++) {
          with_fx('krush', { reps: 4, amp: 3 }, async () => {
            play({ synth: 'fm', note: 'c3', amp: 1, release: rrand(0.05, 0.3), pan: rrand(-0.5, 0.5) });
            await sleep(choose([0.25, 0.125]));
          });
        }
      });
    });
  });
});

with_fx('compressor', {}, async () => {
  live_loop('industry', async () => {
    sample('/samples/loop_industrial.flac', { beat_stretch: 1, lpf: 110, rate: 1, amp: 3 });
    await sleep(1);
  });
});

with_fx('compressor', {}, async () => {
  live_loop('drive', async () => {
    play({ synth: 'fm', note: 'c1', release: (ring(0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 1, 1, 1, 1, 1, 1, 1, 1)).tick, amp: 4, divisor: 1, depth: 1 });
    sample('/samples/bd_haus.flac', { amp: 5, lpf: 130, start: 0.14 });
    await sleep(0.5);
  });
});

live_loop('swirls', async () => {
  tick();
  sample('/samples/ambi_lunar_land.flac', { rate: (ring(-0.5, 0.5)).look, amp: rrand(1, 2.5) });
  with_fx('compressor', {}, async () => {
    with_fx('lpf', { cutoff: (range(100, 130, { steps: 8 })).look }, async () => {
      with_fx('krush', { amp: 1.5 }, async () => {
        play({ synth: 'rodeo', note: (chord('c4', 'minor7')), release: 8, amp: 5 });
        play({ synth: 'square', note: 'c4', release: 4 });
      });
    });
  });
  await sleep(16);
});
