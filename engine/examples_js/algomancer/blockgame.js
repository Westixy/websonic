// Coded by DJ_Dave

use_bpm(130);

live_loop('met1', async () => {
  await sleep(1);
});

const cmaster1 = 130;
const cmaster2 = 130;

const pattern = (p) => {
  return p.ring.tick() === "x";
};

live_loop('kick', async () => {
  await sync('met1');
  // stop
  const a = 1.5;
  if (pattern("x--x--x---x--x--")) {
    sample('/samples/bd_tek.flac', { amp: a, cutoff: cmaster1 });
  }
  await sleep(0.25);
});

with_fx('echo', { mix: 0.2 }, async () => {
  with_fx('reverb', { mix: 0.2, room: 0.5 }, async () => {
    live_loop('clap', async () => {
      await sync('met1');
      // stop
      const a = 0.75;
      await sleep(1);
      sample('/samples/drum_snare_hard.flac', { rate: 2.5, cutoff: cmaster1, amp: a });
      sample('/samples/drum_snare_hard.flac', { rate: 2.2, start: 0.02, cutoff: cmaster1, pan: 0.2, amp: a });
      sample('/samples/drum_snare_hard.flac', { rate: 2, start: 0.04, cutoff: cmaster1, pan: -0.2, amp: a });
      await sleep(1);
    });
  });
});

with_fx('reverb', { mix: 0.2 }, async () => {
  with_fx('panslicer', { mix: 0.2 }, async () => {
    live_loop('hhc1', async () => {
      await sync('met1');
      // stop
      const a = 0.75;
      const p = [-0.3, 0.3].choose();
      if (pattern("x-x-x-x-x-x-x-x-xxx-x-x-x-x-x-x-")) {
        sample('/samples/drum_cymbal_closed.flac', { amp: a, rate: 2.5, finish: 0.5, pan: p, cutoff: cmaster2 });
      }
      await sleep(0.125);
    });
  });
});

live_loop('hhc2', async () => {
  await sync('met1');
  // stop
  const a = 1.25;
  await sleep(0.5);
  sample('/samples/drum_cymbal_closed.flac', { cutoff: cmaster2, rate: 1.2, start: 0.01, finish: 0.5, amp: a });
  await sleep(0.5);
});

with_fx('reverb', { mix: 0.7 }, async () => {
  live_loop('crash', async () => {
    await sync('met1');
    // stop
    const a = 0.1;
    const c = cmaster2 - 10;
    const r = 1.5;
    const f = 0.25;
    const crash = '/samples/drum_splash_soft.flac';
    await sleep(14.5);
    sample(crash, { amp: a, cutoff: c, rate: r, finish: f });
    sample(crash, { amp: a, cutoff: c, rate: r - 0.2, finish: f });
    await sleep(1);
    sample(crash, { amp: a, cutoff: c, rate: r, finish: f });
    sample(crash, { amp: a, cutoff: c, rate: r - 0.2, finish: f });
    await sleep(0.5);
  });
});

with_fx('reverb', { mix: 0.7 }, async () => {
  live_loop('arp', async () => {
    await sync('met1');
    with_fx('echo', { phase: 1, mix: (line(0.1, 1, { steps: 128 })).mirror().tick() }, async () => {
      // stop
      const a = 0.6;
      const r = 0.25;
      const c = 130;
      const p = (line(-0.7, 0.7, { steps: 64 })).mirror().tick();
      const at = 0.01;
      use_synth('beep');
      tick();
      const notes = (scale('g4', 'major_pentatonic')).shuffle();
      play(notes.look(), { amp: a, release: r, cutoff: c, pan: p, attack: at });
      await sleep(0.75);
    });
  });
});

with_fx('panslicer', { mix: 0.4 }, async () => {
  with_fx('reverb', { mix: 0.75 }, async () => {
    live_loop('synthbass', async () => {
      await sync('met1');
      // stop
      const s = 4;
      const r = 2;
      const c = 60;
      const a = 0.75;
      const at = 0;
      use_synth('tech_saws');
      play('g3', { sustain: 6, cutoff: c, amp: a, attack: at });
      await sleep(6);
      play('d3', { sustain: 2, cutoff: c, amp: a, attack: at });
      await sleep(2);
      play('e3', { sustain: 8, cutoff: c, amp: a, attack: at });
      await sleep(8);
    });
  });
});
