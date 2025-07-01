// Coded by SonicPit
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
    play(0, { release: 0.01, amp: 13 });
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
    play(note1 + 24, { amp: 40, release: 0.01 });
  });
  await with_fx('distortion', { distort: 0.1, mix: 0.3 }, async () => {
    await with_fx('lpf', { cutoff: 26 }, async () => {
      await with_fx('hpf', { cutoff: 55 }, async () => {
        const bass = play(note1, { amp: 85, release: duration, note_slide: duration });
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
    play(note, { attack: rrand(0, 4), release: rrand(6, 8), cutoff: rrand(50, 85), vibrato_rate: rrand(0.01, 2), amp: 0.55 });
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
