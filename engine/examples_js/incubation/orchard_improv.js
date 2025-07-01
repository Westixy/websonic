// Welcome to Sonic Pi v2.0

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
