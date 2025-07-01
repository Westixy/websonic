export const examples = {
  'algomancer': [
    { name: 'blockgame', content: `// Coded by DJ_Dave

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
` },
    { name: 'cloud_beat', content: `// Coded by SonicPit
//
// Taken from "Beats basteln wie die Großen"
// c't 13/2017

// Note: requires a powerful machine to run smoothly.

use_bpm(100);

// HISS
live_loop('hiss_loop', async () => {
  sample('/samples/vinyl_hiss.flac', { amp: 2 });
  await sleep(sample_duration('/samples/vinyl_hiss.flac'));
});

// HIHAT
const hihat = async () => {
  use_synth('pnoise');
  await with_fx('hpf', { cutoff: 120 }, async () => {
    play({ release: 0.01, amp: 13 });
  });
};

live_loop('hihat_loop', async () => {
  const divisors = ring(2, 4, 2, 2, 2, 2, 2, 6);
  const count = divisors.tick;
  for (let i = 0; i < count; i++) {
    hihat();
    await sleep(1.0 / divisors.look);
  }
});

// SNARE
live_loop('snare_loop', async () => {
  await sleep(ring(2.5, 3).tick);
  await with_fx('lpf', { cutoff: 100 }, async () => {
    sample('/samples/sn_dub.flac', { sustain: 0, release: 0.05, amp: 3 });
  });
  await sleep(ring(1.5, 1).look);
});

// BASSDRUM
const bassdrum = async (note1, duration, note2 = note1) => {
  use_synth('sine');
  await with_fx('hpf', { cutoff: 100 }, async () => {
    play({ note: note1 + 24, amp: 40, release: 0.01 });
  });
  await with_fx('distortion', { distort: 0.1, mix: 0.3 }, async () => {
    await with_fx('lpf', { cutoff: 26 }, async () => {
      await with_fx('hpf', { cutoff: 55 }, async () => {
        const bass = play({ note: note1, amp: 85, release: duration, note_slide: duration });
        control(bass, { note: note2 });
      });
    });
  });
  await sleep(duration);
};

live_loop('bassdrum_schleife', async () => {
  bassdrum(36, 1.5);
  if (ring(0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0).tick === 1) {
    bassdrum(36, 0.5, 40);
    bassdrum(38, 1, 10);
  } else {
    bassdrum(36, 1.5);
  }
  bassdrum(36, 1.0, ring(10, 10, 10, 40).look);
});

// CHORD CONTROL
const chord_1 = chord('c4', 'maj9', { num_octaves: 2 });
const chord_2 = chord('es4', 'maj9', { num_octaves: 2 });
const chord_3 = chord('b3', 'maj9', { num_octaves: 2 });
const chord_4 = chord('d4', 'maj9', { num_octaves: 2 });

const chord_low_1 = chord('c2', 'maj9');
const chord_low_2 = chord('es2', 'maj9');
const chord_low_3 = chord('b1', 'maj9');
const chord_low_4 = chord('d2', 'maj9');

let chord_high = chord_1;
let chord_low = chord_low_1;

live_loop('chord_selector', async () => {
  await sleep(-0.5);
  chord_high = (ring(chord_1, chord_1, chord_2, chord_2, chord_3, chord_3, chord_3, chord_3, chord_4, chord_4, chord_4, chord_4)).tick;
  chord_low = (ring(chord_low_1, chord_low_1, chord_low_2, chord_low_2, chord_low_3, chord_low_3, chord_low_3, chord_low_3, chord_low_4, chord_low_4, chord_low_4, chord_low_4)).look;
  await sleep(8);
});

// SPHERES
const chord_player = (the_chord) => {
  use_synth('blade');
  the_chord.forEach((note) => {
    play({ note, attack: rrand(0, 4), release: rrand(6, 8), cutoff: rrand(50, 85), vibrato_rate: rrand(0.01, 2), amp: 0.55 });
  });
};

with_fx('reverb', { room: 0.99, mix: 0.7 }, async () => {
  live_loop('chord_loop', async () => {
    chord_player(chord_high.slice(0, 6));
    chord_player(chord_low.slice(0, 3));
    await sleep(8);
  });
});

// Coded by Pit Noack
// supported by
// Alexander Degraf
// Astrid Hagenguth
// Enrico Mercaldi
// http://www.maschinennah.de/
// mail@pitnoack.de
` },
    { name: 'sonic_dreams', content: `// Coded by Sam Aaron
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
` }
  ],
  'apprentice': [
    { name: 'haunted', content: `// Coded by Sam Aaron

live_loop('haunted', async () => {
  sample('/samples/perc_bell.flac', { rate: rrand(-1.5, 1.5) });
  await sleep(rrand(0.1, 2));
});
` }
  ],
  'illusionist': [
    { name: 'ambient_experiment', content: `// Coded by Darin Wilson
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
` },
    { name: 'chord_inversions', content: `// Coded by Adrian Cheater

// (in a single tweet)
// https://twitter.com/wpgFactoid/status/666692596605976576

[1, 3, 6, 4].forEach(async (d) => {
  for (let i = -3; i <= 3; i++) {
    play(chord_degree(d, 'c', 'major', 3, { invert: i }));
    await sleep(0.25);
  }
});
` },
    { name: 'filtered_dnb', content: `// Coded by Sam Aaron

use_sample_bpm('loop_amen');

with_fx('rlpf', { cutoff: 10, cutoff_slide: 4 }, async (c) => {
  live_loop('dnb', async () => {
    sample('/samples/bass_dnb_f.flac', { amp: 5 });
    sample('/samples/loop_amen.flac', { amp: 5 });
    await sleep(1);
    control(c, { cutoff: rrand(40, 120), cutoff_slide: rrand(1, 4) });
  });
});
` },
    { name: 'fm_noise', content: `// Coded by Sam Aaron

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
` },
    { name: 'jungle', content: `// Coded by Sam Aaron
use_bpm(50);

with_fx('lpf', { cutoff: 90 }, async () => {
  with_fx('reverb', { mix: 0.5 }, async () => {
    with_fx('compressor', { pre_amp: 40 }, async () => {
      with_fx('distortion', { distort: 0.4 }, async () => {
        live_loop('jungle', async () => {
          use_random_seed(667);
          for (let i = 0; i < 4; i++) {
            sample('/samples/loop_amen.flac', { beat_stretch: 1, rate: choose([1, 1, 1, -1]) / 2.0, finish: 0.5, amp: 0.5 });
            sample('/samples/loop_amen.flac', { beat_stretch: 1 });
            await sleep(1);
          }
        });
      });
    });
  });
});
` },
    { name: 'ocean', content: `// Coded by Sam Aaron

with_fx('reverb', { mix: 0.5 }, async () => {
  live_loop('oceans', async () => {
    const s = play({
      synth: choose(['bnoise', 'cnoise', 'gnoise']),
      amp: rrand(0.5, 1.5),
      attack: rrand(0, 4),
      sustain: rrand(0, 2),
      release: rrand(1, 5),
      cutoff_slide: rrand(0, 5),
      cutoff: rrand(60, 100),
      pan: rrand(-1, 1),
      pan_slide: rrand(1, 5),
      amp: rrand(0.5, 1),
    });
    control(s, { pan: rrand(-1, 1), cutoff: rrand(60, 110) });
    await sleep(rrand(2, 4));
  });
});
` },
    { name: 'reich_phase', content: `// Steve Reich's Piano Phase
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
` }
  ],
  'incubation': [
    { name: 'crushed', content: `with_fx('bitcrusher', {}, async () => {
  live_loop('crushed', async () => {
    use_synth('mod_fm');
    play({ note: 50 + choose([5, 0]), mod_phase: 0.25, release: 1, mod_range: choose([24, 27, 12]) });
    await sleep(0.5);
    use_synth('mod_dsaw');
    play({ note: 50, mod_phase: 0.25, release: 1.5, mod_range: choose([24, 27]), attack: 0.5 });
    await sleep(1.5);
  });
});
` },
    { name: 'dark_neon', content: `// Coded by Sam Aaron

live_loop('foo', async () => {
  sample('/samples/bd_haus.flac', { amp: 5, cutoff: 50, release: 0.1 });
  await sleep(0.5);
});

live_loop('mel', async () => {
  with_fx('wobble', { phase: 1, invert_wave: 1, wave: 0, cutoff_max: 80, cutoff_min: 60 }, async () => {
    play({ synth: 'blade', note: 'cs1', release: 4, cutoff: 110, amp: 1, pitch_shift: 0 });
  });
  with_fx('reverb', { room: 1 }, async () => {
    with_fx('bitcrusher', { mix: 0.4 }, async () => {
      sample('/samples/bass_trance_c.flac', { rate: 0.5, pitch: 0, window_size: 0.125, time_dis: 0.125, amp: 8, release: 0.2 });
    });
  });
  await sleep(4);
});
` },
    { name: 'mod_303_phade', content: `use_synth('tb303');

live_loop('foo', async () => {
  await sleep(0.5);
});

sync('foo');

with_fx('reverb', {}, async () => {
  with_fx('slicer', { phase: 0.5, wave: 0, invert_wave: 1 }, async () => {
    play({ note: 50 - 24, cutoff: 120, cutoff_attack: 0.3, res: 0.93, release: 60 });
  });
});
` },
    { name: 'orchard_improv', content: `// Welcome to Sonic Pi v2.0

const pent = ['B1', 'Cs2', 'Ds2',
        'Fs2', 'Gs2', 'As2',
        'B2',
        'Cs3', 'Ds3', 'Fs3', 'Gs3', 'As3',
        'B3',
        'Cs4', 'Ds4', 'Fs4', 'Gs4', 'As4',
        'B4',
        'Cs5', 'Ds5', 'Fs5', 'Gs5', 'As5',
        'B5',
        'Cs6', 'Ds6', 'Fs6', 'Gs6', 'As6'];

use_synth('tri');
with_fx('reverb', { rate: 0.2 }, async () => {
  let i = 15;
  const t = 0.28;
  const stack = [];
  for (let j = 0; j < 100; j++) {
    const mode = rrand_i(0, 2);
    const lene = rrand_i(0, 4) * 2;
    if (mode === 2) {
      let direction = rrand_i(0, 1) * 2 - 1;
      const tp = (t * 4) / lene;
      const local_stack = [];
      if (lene + i >= pent.length) {
        direction = -1;
      }
      if (i - lene <= 0) {
        direction = 1;
      }
      for (let k = 0; k < lene; k++) {
        const notes = [i];
        if (rrand_i(0, 3) === 1 && (i + 4 < pent.length)) {
          notes.push(i + 4);
        }
        if (rrand_i(0, 3) === 1 && (i - 4 >= 0)) {
          notes.push(i - 4);
        }
        if (rrand_i(0, 6) === 3 && (i + 2 < pent.length)) {
          notes.push(i + 2);
        }
        if (rrand_i(0, 6) === 3 && (i - 2 >= 0)) {
          notes.push(i - 2);
        }
        notes.forEach((note) => {
          play({ note: pent[note] });
        });
        await sleep(tp);
        i = Math.abs(i + direction);
        local_stack.push([notes, tp]);
      }
      stack.push(local_stack);
    } else {
      console.log("repeat mode");
      const transp = rrand_i(0, 4) - 2;
      if (stack.length > 0) {
        stack[stack.length - 1].forEach(async ([notes, tp]) => {
          notes.forEach((note) => {
            if ((note + transp >= 0) && (note + transp < pent.length)) {
              play({ note: pent[note + transp] });
            }
          });
          await sleep(tp);
        });
      }
    }
  }
});
` },
    { name: 'syncer', content: `live_loop('ticker', async () => {
  event('tick');
  await sleep(1);
});

live_loop('kicker', async () => {
  await sync('tick');
  sample('/samples/drum_heavy_kick.flac');
});

live_loop('synther', async () => {
  use_synth('mod_saw');
  await sync('tick');
  play({ note: choose(chord('e1', 'minor')), mod_phase: choose([1, 0.5, 0.25, 0.125]), cutoff: rrand(80, 110) });
});
` }
  ],
  'magician': [
    { name: 'acid', content: `// Coded by Sam Aaron

use_debug(false);
// load_sample('/samples/bd_fat.flac');

for (let i = 0; i < 8; i++) {
  sample('/samples/bd_fat.flac', { amp: (line(0, 5, { steps: 8 })).tick });
  await sleep(0.5);
}

live_loop('drums', async () => {
  sample('/samples/bd_fat.flac', { amp: 5 });
  await sleep(0.5);
});

live_loop('acid', async () => {
  event('foo');
  for (let i = 0; i < 4; i++) {
    use_random_seed(667);
    for (let j = 0; j < 16; j++) {
      use_synth('tb303');
      play({ note: choose(chord('e3', 'minor')), attack: 0, release: 0.1, cutoff: rrand_i(50, 90) + j * 10 });
      await sleep(0.125);
    }
  }

  event('bar');
  for (let i = 0; i < 32; i++) {
    use_synth('tb303');
    play({ note: choose(chord('a3', 'minor')), attack: 0, release: 0.05, cutoff: rrand_i(70, 98) + i, res: rrand(0.9, 0.95) });
    await sleep(0.125);
  }

  event('baz');
  with_fx('reverb', { mix: 0.3 }, async (r) => {
    for (let m = 0; m < 32; m++) {
      if (m % 8 === 0 && m !== 0) {
        control(r, { mix: 0.3 + (0.5 * (m / 32.0)) });
      }
      use_synth('prophet');
      play({ note: choose(chord('e3', 'minor')), attack: 0, release: 0.08, cutoff: rrand_i(110, 130) });
      await sleep(0.125);
    }
  });

  event('quux');
  live_loop('quux_loop', async () => {
    use_random_seed(668);
    with_fx('echo', { phase: 0.125 }, async () => {
      for (let i = 0; i < 16; i++) {
        use_synth('tb303');
        play({ note: choose(chord('e3', 'minor')), attack: 0, release: 0.1, cutoff: rrand(50, 100) });
        await sleep(0.25);
      }
    });
  });

  await sleep(4);
});
` },
    { name: 'ambient', content: `// Coded by Sam Aaron

// load_samples(sample_names('ambi'));
await sleep(2);

with_fx('reverb', { mix: 0.8 }, async () => {
  live_loop('foo', async () => {
    // try changing the sp_ vars..
    const sp_name = choose(sample_names('ambi'));
    // const sp_name = choose(sample_names('drum'));
    const sp_time = choose([1, 2]);
    // const sp_time = 0.5;
    const sp_rate = 1;
    // const sp_rate = 4;

    const s = sample(sp_name, { cutoff: rrand(70, 130), rate: sp_rate * choose([0.5, 1]), pan: rrand(-1, 1), pan_slide: sp_time });
    control(s, { pan: rrand(-1, 1) });
    await sleep(sp_time);
  });
});
` },
    { name: 'compus_beats', content: `// Coded by Sam Aaron

use_sample_bpm('loop_compus', { num_beats: 4 });

live_loop('loopr', async () => {
  if (!one_in(10)) {
    sample('/samples/loop_compus.flac', { rate: choose([0.5, 1, 1, 1, 1, 2]) });
  }
  await sleep(4);
});

live_loop('bass', async () => {
  if (one_in(4)) {
    sample('/samples/bass_voxy_c.flac', { amp: rrand(0.1, 0.2), rate: choose([0.5, 0.5, 1, 1, 2, 4]) });
  }
  use_synth('mod_pulse');
  // use_synth_defaults({ mod_invert_wave: 1 });
  play({ note: 'C1', mod_range: 12, amp: rrand(0.5, 1), mod_phase: choose([0.25, 0.5, 1]), release: 1, cutoff: rrand(50, 90) });
  play({ note: 'C2', mod_range: choose([24, 36, 34]), amp: 0.35, mod_phase: 0.25, release: 2, cutoff: 60, pulse_width: rand() });
  await sleep(1);
});
` },
    { name: 'echo_drama', content: `// Coded by Sam Aaron

use_synth('tb303');
use_bpm(45);
use_random_seed(3);
use_debug(false);

with_fx('reverb', {}, async () => {
  with_fx('echo', { delay: 0.5, decay: 4 }, async () => {
    live_loop('echoes', async () => {
      play({
        note: choose(chord(choose(['b1', 'b2', 'e1', 'e2', 'b3', 'e3']), 'minor')),
        cutoff: rrand(40, 100),
        amp: 0.5,
        attack: 0,
        release: rrand(1, 2),
        cutoff_max: 110,
      });
      await sleep(choose([0.25, 0.5, 0.5, 0.5, 1, 1]));
    });
  });
});
` },
    { name: 'idm_breakbeat', content: `// Coded by Sam Aaron

live_loop('idm_bb', async () => {
  const n = choose([1, 2, 4, 8, 16]);
  sample('/samples/drum_heavy_kick.flac', { amp: 2 });
  if (one_in(8)) {
    sample('/samples/ambi_drone.flac', { rate: choose([0.25, 0.5, 0.125, 1]), amp: 0.25 });
  }
  if (one_in(8)) {
    sample('/samples/ambi_lunar_land.flac', { rate: choose([0.5, 0.125, 1, -1, -0.5]), amp: 0.25 });
  }
  sample('/samples/loop_amen.flac', { attack: 0, release: 0.05, start: 1 - (1.0 / n), rate: choose([1, 1, 1, 1, 1, 1, -1]) });
  await sleep(sample_duration('/samples/loop_amen.flac') / n);
});
` },
    { name: 'tron_bike', content: `// Coded by Sam Aaron

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
` },
    { name: 'wob_rhyth', content: `// Coded by Sam Aaron

use_debug(false);

with_fx('reverb', {}, async () => {
  live_loop('choral', async () => {
    const r = choose([0.5, 1.0 / 3, 3.0 / 5]);
    event('choir', { rate: r });
    for (let i = 0; i < 8; i++) {
      sample('/samples/ambi_choir.flac', { rate: r, pan: rrand(-1, 1) });
      await sleep(0.5);
    }
  });
});

live_loop('wub_wub', async () => {
  with_fx('wobble', { phase: 2, reps: 16 }, async (w) => {
    with_fx('echo', { mix: 0.6 }, async () => {
      sample('/samples/drum_heavy_kick.flac');
      sample('/samples/bass_hit_c.flac', { rate: 0.8, amp: 0.4 });
      await sleep(1);
      // try changing the wobble's phase duration:
      // control(w, { phase: choose([0.5, 1, 2]) });
    });
  });
});
` }
  ],
  'sorcerer': [
    { name: 'bach', content: `// Bach Minuet in G
//
// Coded by Robin Newman

use_bpm(60);
// use_synth_defaults({ release: 0.5, amp: 0.7, cutoff: 90 });
use_synth('beep');

const play_pattern_timed = async (notes, times) => {
  for (let i = 0; i < notes.length; i++) {
    play({ note: notes[i] });
    await sleep(times[i % times.length]);
  }
};

// Each section of the minuet is repeated
for (let i = 0; i < 2; i++) {

  // First start a thread for the first 8 bars of the bass left hand part
  live_loop('left_hand_1', async () => {
    play({ note: [55, 59] }); //b1
    await sleep(1);
    await play_pattern_timed([57], [0.5]);
    await play_pattern_timed([59], [1.5]); //b2
    await play_pattern_timed([60], [1.5]); //b3
    await play_pattern_timed([59], [1.5]); //b4
    await play_pattern_timed([57], [1.5]); //b5
    await play_pattern_timed([55], [1.5]); //b6
    await play_pattern_timed([62, 59, 55], [0.5]); //b7
    await play_pattern_timed([62], [0.5]); //b8
    await play_pattern_timed([50, 60, 59, 57], [0.25]);
  });

  // Play concurrently the first 8 bars of the right hand part
  await play_pattern_timed([74], [0.5]); //b1
  await play_pattern_timed([67, 69, 71, 72], [0.25]);
  await play_pattern_timed([74, 67, 67], [0.5]); //b2
  await play_pattern_timed([76], [0.5]); //b3
  await play_pattern_timed([72, 74, 76, 78], [0.25]);
  await play_pattern_timed([79, 67, 67], [0.5]); //b4
  await play_pattern_timed([72], [0.5]); //b5
  await play_pattern_timed([74, 72, 71, 69], [0.25]);
  await play_pattern_timed([71], [0.5]); //b6
  await play_pattern_timed([72, 71, 69, 67], [0.25]);
  await play_pattern_timed([66], [0.5]); //b7
  await play_pattern_timed([67, 69, 71, 67], [0.25]);
  await play_pattern_timed([71, 69], [0.5, 1]); //b8

  // Start a new thread for bars 9-16 of the left hand part
  live_loop('left_hand_2', async () => {
    play({ note: [55, 59] }); //b9=b1
    await sleep(1);
    play({ note: 57 });
    await sleep(0.5);
    await play_pattern_timed([55, 59, 55], [0.5]); //b10
    await play_pattern_timed([60], [1.5]); //b11=b3
    await play_pattern_timed([59, 60, 59, 57, 5], [0.5, 0.25, 0.25, 0.25, 0.25]); //b12=b4]
    await play_pattern_timed([57, 54], [1, 0.5]); //b13
    await play_pattern_timed([55, 59], [1, 0.5]); //b14
    await play_pattern_timed([60, 62, 50], [0.5]); //b15
    await play_pattern_timed([55, 43], [1, 0.5]); //b16
  });

  // Play concurrently bars 9-16 of the right hand part the first six
  // bars repeat bars 1-6
  await play_pattern_timed([74], [0.5]); //b9 = b1
  await play_pattern_timed([67, 69, 71, 72], [0.25]);
  await play_pattern_timed([74, 67, 67], [0.5]); //b10=b2
  await play_pattern_timed([76], [0.5]); //b11=b3
  await play_pattern_timed([72, 74, 76, 78], [0.25]);
  await play_pattern_timed([79, 67, 67], [0.5]); //b12=b4
  await play_pattern_timed([72], [0.5]); //b13=b5
  await play_pattern_timed([74, 72, 71, 69], [0.25]);
  await play_pattern_timed([71], [0.5]); //b14=b6
  await play_pattern_timed([72, 71, 69, 67], [0.25]);
  await play_pattern_timed([69], [0.5]); //b15
  await play_pattern_timed([71, 69, 67, 66], [0.25]);
  await play_pattern_timed([67], [1.5]); //b16
}


// ==========second section starts here======
// The second section is also repeated
for (let i = 0; i < 2; i++) {

  // Start a thread for bars 17-24 of the left hand part
  live_loop('left_hand_3', async () => {
    await play_pattern_timed([55], [1.5]); //b17
    await play_pattern_timed([54], [1.5]); //b18
    await play_pattern_timed([52, 54, 52], [0.5]); //b19
    await play_pattern_timed([57, 45], [1, 0.5]); //b20
    await play_pattern_timed([57], [1.5]); //b21
    await play_pattern_timed([59, 62, 61], [0.5]); //b22
    await play_pattern_timed([62, 54, 57], [0.5]); //b23
    await play_pattern_timed([62, 50, 60], [0.5]); //b24
  });

  // Play bars 17 to 24 of the right hand concurrently with the left
  // hand thread
  await play_pattern_timed([83], [0.5]); //b17
  await play_pattern_timed([79, 81, 83, 79], [0.25]);
  await play_pattern_timed([81], [0.5]); //b18
  await play_pattern_timed([74, 76, 78, 74], [0.25]);
  await play_pattern_timed([79], [0.5]); //b19
  await play_pattern_timed([76, 78, 79, 74], [0.25]);
  await play_pattern_timed([73, 71, 73, 69], [0.5, 0.25, 0.25, 0.5]); //b20
  await play_pattern_timed([69, 71, 73, 74, 76, 78], [0.25]); //b21
  await play_pattern_timed([79, 78, 76], [0.5]); //b22
  await play_pattern_timed([78, 69, 73], [0.5]); //b23
  play({ note: 74 }); //b24
  await sleep(1.5);

  // Start a new thread for bars 25-32 of the left hand part
  live_loop('left_hand_4', async () => {
    await play_pattern_timed([59, 62, 59], [0.5]); //b25
    await play_pattern_timed([60, 64, 60], [0.5]); //b26
    await play_pattern_timed([59, 57, 55], [0.5]); //b27
    play({ note: 62 }); //b28
    await sleep(1.5); //includes a rest
    await play_pattern_timed([50, 54], [1, 0.5]); //b29
    await play_pattern_timed([52, 55, 54], [0.5]); //b30
    await play_pattern_timed([55, 47, 50], [0.5]); //b31
    await play_pattern_timed([55, 50, 43], [0.5]); //b32
  });

  // Play bars 25-32 of the right hand part concurrently with the left
  // hand thread
  await play_pattern_timed([74, 67, 66, 67], [0.5, 0.25, 0.25, 0.5]); //b25
  await play_pattern_timed([76, 67, 66, 67], [0.5, 0.25, 0.25, 0.5]); //b26
  await play_pattern_timed([74, 72, 71], [0.5]); //b27
  await play_pattern_timed([69, 67, 66, 67, 69], [0.25, 0.25, 0.25, 0.25, 0.5]); //b28
  await play_pattern_timed([62, 64, 66, 67, 69, 71], [0.25]); //b29
  await play_pattern_timed([72, 71, 69], [0.5]); //b30
  await play_pattern_timed([71, 74, 67, 66], [0.25, 0.25, 0.5, 0.5]); //b31
  play({ note: [67, 59] }); //b32
  await sleep(1.5);
}
` },
    { name: 'driving_pulse', content: `// Coded by Sam Aaron

// load_sample('/samples/drum_heavy_kick.flac');

live_loop('drums', async () => {
  sample('/samples/drum_heavy_kick.flac', { rate: 0.75 });
  await sleep(0.5);
  sample('/samples/drum_heavy_kick.flac');
  await sleep(0.5);
});

live_loop('synths', async () => {
  use_synth('mod_pulse');
  // use_synth_defaults({ amp: 1, mod_range: 15, cutoff: 80, pulse_width: 0.2, attack: 0.03, release: 0.6, mod_phase: 0.25, mod_invert_wave: 1 });
  play({ note: 30 });
  await sleep(0.25);
  play({ note: 38 });
  await sleep(0.25);
});
` },
    { name: 'lorezzed', content: `// Coded by Sam Aaron

use_bpm(50);
const lorezzed_notes = (scale('c1', 'minor_pentatonic', { num_octaves: 1 })).shuffle();

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
          control(s, { note: lorezzed_notes.tick });
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
` },
    { name: 'monday_blues', content: `// Coded by Sam Aaron

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
` },
    { name: 'rerezzed', content: `// Coded by Sam Aaron

use_debug(false);
const rerezzed_notes = (scale('e1', 'minor_pentatonic', { num_octaves: 2 })).shuffle();

live_loop('rerezzed', async () => {
  reset_tick();
  const t = 0.04;
  await sleep(-t);
  with_fx('bitcrusher', {}, async () => {
    const s = play({ synth: 'dsaw', note: 'e3', sustain: 8, note_slide: t, release: 0 });
    for (let i = 0; i < 64; i++) {
      await sleep(0.125);
      control(s, { note: rerezzed_notes.tick });
    }
  });
  await sleep(t);
});

live_loop('industry', async () => {
  sample('/samples/loop_industrial.flac', { beat_stretch: 1 });
  await sleep(1);
});

live_loop('drive', async () => {
  sample('/samples/bd_haus.flac', { amp: 3 });
  await sleep(0.5);
});
` },
    { name: 'square_skit', content: `// Coded by Sam Aaron

use_debug(false);

live_loop('skit', async () => {
  with_fx('slicer', { phase: 1, invert_wave: 1, wave: 0 }, async () => {
    with_fx('slicer', { wave: 0, phase: 0.25 }, async () => {
      sample('/samples/loop_mika.flac', { rate: 1, amp: 2 });
    });
    await sleep(8);
  });
});

live_loop('foo', async () => {
  if (tick() % 4 === 0) {
    tick('note');
  }
  use_synth('square');
  for (let i = 0; i < 2; i++) {
    play({ note: (ring('c2', 'c2', 'e1', 'f3')).look('note'), release: 0, attack: 0.25, amp: 1, cutoff: rrand_i(70, 130) });
    await sleep(0.5);
  }
});

live_loop('kik', async () => {
  for (let i = 0; i < 1; i++) {
    sample('/samples/bd_haus.flac', { amp: 2 });
    await sleep(0.5);
  }
});

live_loop('piano', async () => {
  await sleep(4);
  with_fx('slicer', { phase: 0.25, wave: 1 }, async () => {
    await sleep(4);
    sample('/samples/ambi_piano.flac', { amp: 2 });
  });
});
` }
  ],
  'wizard': [
    { name: 'blimp_zones', content: `// Coded by Sam Aaron

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
` },
    { name: 'blip_rhythm', content: `// Coded by Sam Aaron

// load_samples(['drum_heavy_kick', 'elec_plip', 'elec_blip']);
use_bpm(100);
use_random_seed(100);

with_fx('reverb', { mix: 0.6, room: 0.8 }, async () => {
  with_fx('echo', { room: 0.8, decay: 8, phase: 1, mix: 0.4 }, async () => {
    live_loop('blip', async () => {
      const n = choose(['e2', 'e2', 'a3']);

      use_synth('dsaw');
      // with_transpose(-12, () => {
      live_loop('blip_transpose', async () => {
        for (let i = 0; i < 2; i++) {
          play({ note: n, attack: 0.6, release: 0.8, detune: rrand(0, 0.1), cutoff: rrand(80, 120) });
          await sleep(3);
        }
      });
      // });

      await sleep(4);

      use_synth('tri');
      play({ note: chord(n, 'm7'), amp: 5, release: 0.8 });

      await sleep(2);
    });
  });
});

with_fx('echo', { room: 0.8, decay: 8, phase: 0.25, mix: 0.4 }, async () => {
  live_loop('rhythm', async () => {
    sample('/samples/drum_heavy_kick.flac', { amp: 0.5 });
    sample('/samples/elec_plip.flac', { rate: choose([0.5, 2, 1, 4]) * choose([1, 2, 3, 10]), amp: 0.6 });
    await sleep(2);
  });
});
` },
    { name: 'shufflit', content: `// Coded by Sam Aaron

use_debug(false);
use_random_seed(667);
// load_sample('/samples/ambi_lunar_land.flac');
await sleep(1);

live_loop('travelling', async () => {
  use_synth('beep');
  const notes = scale('e3', 'minor_pentatonic', { num_octaves: 1 });
  use_random_seed(679);
  reset_tick_all();
  with_fx('echo', { phase: 0.125, mix: 0.4, reps: 16 }, async () => {
    await sleep(0.25);
    play({ note: choose(notes), attack: 0, release: 0.1, pan: (range(-1, 1, { step: 0.125 })).tick, amp: rrand(2, 2.5) });
  });
});

live_loop('comet', async () => {
  if (one_in(4)) {
    sample('/samples/ambi_lunar_land.flac');
    console.log('comet_landing');
  }
  await sleep(8);
});

live_loop('shuff', async () => {
  with_fx('hpf', { cutoff: 10, reps: 8 }, async () => {
    tick();
    await sleep(0.25);
    sample('/samples/bd_tek.flac', { amp: look() % 8 === 0 ? 6 : 4 });
    await sleep(0.25);
    use_synth('tb303');
    // use_synth_defaults({ cutoff_attack: 1, cutoff_release: 0, env_curve: 2 });
    if (look() % 2 === 0) {
      play({ note: (ring('e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'c2', 'c2', 'c2', 'c2', 'c2', 'c2', 'c2', 'c2')).look, release: 1.5, cutoff: (range(70, 90)).look, amp: 2 });
    }
    sample('/samples/sn_dub.flac', { rate: -1, sustain: 0, release: (ring(0.05, 0.05, 0.05, 0.5)).look });
  });
});
` },
    { name: 'tilburg_2', content: `// Coded by Sam Aaron

use_debug(false);
// load_samples(['guit_em9', 'bd_haus']);

live_loop('low', async () => {
  tick();
  play({ synth: 'zawa', wave: 1, phase: 0.25, release: 5, note: (ring('e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'c1', 'c1', 'c1', 'c1')).look, cutoff: (line(60, 120, { steps: 6 })).look });
  await sleep(4);
});

with_fx('reverb', { room: 1 }, async () => {
  live_loop('lands', async () => {
    use_synth('dsaw');
    use_random_seed(310003);
    const ns = (scale('e2', 'minor_pentatonic', { num_octaves: 4 })).slice(0, 4);
    for (let i = 0; i < 16; i++) {
      play({ note: choose(ns), detune: 12, release: 0.1, amp: 2, amp: rand() + 0.5, cutoff: rrand(70, 120) });
      await sleep(0.125);
    }
  });
});

live_loop('fietsen', async () => {
  await sleep(0.25);
  sample('/samples/guit_em9.flac', { rate: -1 });
  await sleep(7.75);
});

live_loop('tijd', async () => {
  sample('/samples/bd_haus.flac', { amp: 2.5, cutoff: 100 });
  await sleep(0.5);
});

live_loop('ind', async () => {
  sample('/samples/loop_industrial.flac', { beat_stretch: 1 });
  await sleep(1);
});
` },
    { name: 'time_machine', content: `// Coded by Sam Aaron

use_debug(false);

live_loop('time', async () => {
  play({ synth: 'tb303', release: 8, note: 'e1', cutoff: (range(90, 60, -10)).tick });
  await sleep(8);
});

live_loop('machine', async () => {
  sample('/samples/loop_garzul.flac', { rate: (ring(1, 1, 1, -1)).tick });
  await sleep(8);
});

live_loop('vortex', async () => {
  use_synth(choose(['pulse', 'beep']));
  await sleep(0.125 / 2);
  play({ note: (scale('e1', 'minor_pentatonic')).tick, attack: 0.125, release: 0, amp: 2, cutoff: (ring(70, 90, 100, 130)).look });
  await sleep(0.125 / 2);
});

live_loop('moon_bass', async () => {
  sample('/samples/bd_haus.flac', { amp: 1.5 });
  await sleep(0.5);
});
` }
  ],
};
