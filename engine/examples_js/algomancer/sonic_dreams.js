// Coded by Sam Aaron
// Video: https://vimeo.com/110416910

use_debug(false);
// load_samples(['bd_haus', 'elec_blip', 'ambi_lunar_land']);

const ocean = async (num, amp_mul = 1) => {
  for (let i = 0; i < num; i++) {
    const s = play({
      synth: choose(['bnoise', 'cnoise', 'gnoise']),
      amp: rrand(0.5, 1.5) * amp_mul,
      attack: rrand(0, 1),
      sustain: rrand(0, 2),
      release: rrand(0, 5) + 0.5,
      cutoff_slide: rrand(0, 5),
      cutoff: rrand(60, 100),
      pan: rrand(-1, 1),
      pan_slide: 1,
    });
    control(s, { pan: rrand(-1, 1), cutoff: rrand(60, 110) });
    await sleep(rrand(0.5, 4));
  }
};

const echoes = async (num, tonics, co = 100, res = 0.9, amp = 1) => {
  for (let i = 0; i < num; i++) {
    play({
      note: choose(chord(choose(tonics), 'minor')),
      res: res,
      cutoff: rrand(co - 20, co + 20),
      amp: 0.5 * amp,
      attack: 0,
      release: rrand(0.5, 1.5),
      pan: rrand(-0.7, 0.7),
    });
    await sleep(choose([0.25, 0.5, 0.5, 0.5, 1, 1]));
  }
};

const bd = async () => {
  event('in_relentless_cycles');
  for (let i = 0; i < 16; i++) {
    sample('/samples/bd_haus.flac', { amp: 4, cutoff: 100 });
    await sleep(0.5);
  }
  event('winding_everywhichway');
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      sample('/samples/bd_haus.flac', { amp: 4, cutoff: 100 });
      await sleep(0.25);
    }
    sample('/samples/ambi_lunar_land.flac');
    await sleep(0.25);
  }
};

const drums = async (level, b_level = 1, rand_cf = false) => {
  play({ synth: 'fm', note: 'e2', release: 0.1, amp: b_level * 3, cutoff: 130 });
  const co = rand_cf ? rrand(110, 130) : 130;
  const a = rand_cf ? rrand(0.3, 0.5) : 0.6;
  const n = rand_cf ? 'bnoise' : 'noise';
  if (level > 0) {
    play({ synth: 'noise', release: 0.05, cutoff: co, res: 0.95, amp: a });
  }
  if (level > 1) {
    sample('/samples/elec_blip.flac', { amp: 2, rate: 2, pan: rrand(-0.8, 0.8) });
  }
  await sleep(1);
};

const play_synths = async (s_name, co, n = 'e2') => {
  use_synth(s_name);
  // use_transpose(0);
  // use_synth_defaults({ detune: choose([12, 24]), amp: 1, cutoff: co, pulse_width: 0.12, attack: rrand(0.2, 0.5), release: 0.5, mod_phase: 0.25, mod_invert_wave: 1 });

  play({ note: 'e1', mod_range: choose([7, 12]), pan: rrand(-1, 1) });
  await sleep(0.125);

  play({ note: 'e3', mod_range: choose([7, 12]), pan: rrand(-1, 1) });
  await sleep(choose([0.25, 0.5]));

  play({ note: n, mod_range: 12, pan: rrand(-1, 1) });
  await sleep(0.5);

  play({ note: choose(chord('e2', 'minor')), mod_range: 12, pan: rrand(-1, 1) });
  await sleep(0.25);
};

const play_all_synths = async () => {
  await with_fx('reverb', {}, async () => {
    await with_fx('echo', { phase: 0.25 }, async () => {
      const synths = ['mod_pulse', 'mod_saw', 'mod_dsaw', 'mod_dsaw', 'mod_dsaw', 'mod_dsaw'];
      const cutoffs = [108, 78, 88, 98];
      let synth = synths[0];
      for (let t = 0; t < 4; t++) {
        console.log(shuffle("0".repeat(30 - t) + ("1".repeat(t))));
        const co = cutoffs[t % cutoffs.length] + (t * 2);
        for (let i = 0; i < 7; i++) {
          const synth_notes = choose(chord(['e2', 'e3', 'e4', 'e5'][t], 'minor'));
          await play_synths(synth, co, synth_notes);
        }
        await sleep(2);
        synths.push(synths.shift());
        synth = synths[0];
      }
      await sleep(1);
      event('within');
    });
  });
};

const binary_celebration = (n = 1, st = 1) => {
  live_loop('binary_celebration', async () => {
    for (let i = 0; i < n; i++) {
      console.log(Array.from({ length: 31 }, () => choose(["0", "1"])).join(''));
      await sleep(st);
    }
  });
};

console.log('Introduction');
console.log('The Curved Ebb of Carpentry');
await sleep(2);

event('oceans');
// at([7, 12], ['crash', 'within_oceans'], (m) => {
//   event(m);
// });

// uncomment(() => {
use_random_seed(1000);
// with_bpm(45, async () => {
await with_fx('reverb', {}, async () => {
  await with_fx('echo', { delay: 0.5, decay: 4 }, async () => {
    live_loop('ocean_sounds', async () => {
      use_random_seed(2);
      await ocean(5);
      await ocean(1, 0.5);
      await ocean(1, 0.25);
    });
    await sleep(10);
    use_random_seed(1200);
    await echoes(5, ['b1', 'b2', 'e1', 'e2', 'b3', 'e3']);
    event('a_distant_object');
    await echoes(5, ['b1', 'e1', 'e2', 'e3']);
    event('breathes_time');
    live_loop('echoes_2', async () => {
      await echoes(5, ['e1', 'e2', 'e3']);
    });
    use_synth('tb303');
    await echoes(1, ['e1', 'e2', 'e3'], 60, 0.9, 0.5);
    await echoes(1, ['e1', 'e2', 'e3'], 62);
    await echoes(1, ['e1', 'e2', 'e3'], 64, 0.97);
    await echoes(1, ['e1', 'e2', 'e3'], 66);
    await echoes(1, ['e1', 'e2', 'e3'], 68);
    event('liminality_holds_fast');
    await echoes(4, ['b1', 'e1', 'e2', 'b3', 'e3'], 80);
    await echoes(1, ['b1', 'b2', 'e1', 'e2', 'b3', 'e3'], 85, 0.98);
    event('within_reach');
    await echoes(5, ['e1', 'b2'], 90);
    event('as_it_unfolds');
    live_loop('echoes_3', async () => {
      await echoes(5, ['e1'], 90);
    });
  });
});
// });
// });


live_loop('bassdrums', async () => {
  use_random_seed(0);
  await sleep(22);
  for (let i = 0; i < 3; i++) {
    await bd();
  }
  await sleep(28);
  live_loop('bd_loop', async () => {
    await bd();
  });
});

live_loop('drum_machine', async () => {
  use_random_seed(0);
  let level = -1;
  await with_fx('echo', {}, async () => {
    await sleep(2);
    await drums(-1, 0.1);
    await drums(-1, 0.2);
    await drums(-1, 0.4);
    await drums(-1, 0.7);
    console.log("Part 2");
    console.log("Inside the Machine");
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 8; j++) {
        await drums(level, 0.8);
      }
      for (let j = 0; j < 6; j++) {
        await drums(level);
      }
      await sleep(1);
      level += 1;
    }
    await sleep(4);
    event('dreams');
    for (let i = 0; i < 8; i++) {
      await drums(1, 1, true);
    }
    for (let i = 0; i < 10; i++) {
      const m = choose([shuffle('within_dreams'), 'within_dreams', 'dreams_within']);
      event(m);
      await drums(2, 1, true);
    }
    for (let i = 0; i < 6; i++) {
      const m = choose([shuffle("within") + "_dreams", shuffle('within_dreams'), "dreams_" + shuffle("within")]);
      event(m);
      await drums(2);
    }
    live_loop('drums_loop', async () => {
      for (let i = 0; i < 8; i++) {
        await drums(1);
      }
      for (let i = 0; i < 16; i++) {
        event(" ".repeat(rand_i(32)));
        // at(1, () => {
        //   event("  ".repeat(i));
        // });
        await drums(2);
      }
    });
  });
});

live_loop('synths', async () => {
  use_random_seed(0);
  await sleep(12);
  event('the_flow_of_logic');
  await play_all_synths();
});

live_loop('reality_a', async () => {
  use_random_seed(0);
  await sync('within');
  console.log("Part 3");
  console.log("Reality A");
  await sleep(12);
  // use_synth_defaults({ phase: 0.5, res: 0.5, cutoff: 80, release: 3.3, wave: 1 });

  for (let i = 0; i < 2; i++) {
    for (const cf of [80, 90, 100, 110]) {
      // use_merged_synth_defaults({ cutoff: cf });
      console.log("1".repeat(30));
      play({ synth: 'zawa', note: 'e2', phase: 0.25 });
      play({ synth: 'zawa', note: 'a1' });
      await sleep(3);
    }
    for (let t = 0; t < 4; t++) {
      binary_celebration(6, 0.5);
      play({ synth: 'zawa', note: 'e2', phase: 0.25, res: rrand(0.8, 0.9), cutoff: [100, 105, 110, 115][t] });
      await sleep(3);
    }
  }

  console.log('Part n');
  console.log('The Observer becomes the Observed');
  // Your turn...
});
