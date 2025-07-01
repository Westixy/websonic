const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const EXAMPLES_DIR = path.join(__dirname, '../examples_js');

const sandbox = {
  play: () => {},
  sleep: () => {},
  sample: () => {},
  use_synth: () => {},
  use_bpm: () => {},
  with_fx: (fx, opts, fn) => fn(),
  live_loop: (name, fn) => fn(),
  sync: () => {},
  event: () => {},
  set: () => {},
  get: () => ({ tick: 0, look: 0 }),
  scale: () => [],
  chord: () => [],
  choose: (arr) => arr[0] || 0,
  rrand: () => 0,
  rrand_i: () => 0,
  rand: () => 0,
  rand_i: () => 0,
  one_in: () => false,
  shuffle: (arr) => arr,
  ring: (...args) => ({
    _arr: args,
    tick: () => 0,
    look: () => 0,
    chain: () => ({}),
  }),
  line: (start, end, opts) => {
    const steps = opts.steps || 1;
    const arr = [];
    for (let i = 0; i < steps; i++) {
      arr.push(start + (end - start) * (i / (steps - 1)));
    }
    return {
      _arr: arr,
      tick: () => arr[0],
      look: () => arr[0],
      mirror: () => ({
        _arr: arr.concat(arr.slice().reverse()),
        tick: () => arr[0],
        look: () => arr[0],
      }),
    };
  },
  range: () => ({ tick: 0, look: 0 }),
  chord_degree: () => [],
  use_random_seed: () => {},
  reset_tick: () => {},
  tick: () => 0,
  look: () => 0,
  sample_duration: () => 0,
  use_debug: () => {},
  control: () => {},
  use_sample_bpm: () => {},
  note: (n) => n,
  console: {
    log: () => {},
  },
  pattern: (p) => {
    let i = 0;
    return {
      ring: {
        tick: () => p[i++ % p.length],
      },
    };
  },
  Array: {
    from: (arr) => Array.from(arr),
  },
};

const proxy = new Proxy(sandbox, {
  get: (target, prop) => {
    if (prop in target) {
      return target[prop];
    }
    // For the purpose of this test, we don't want to throw an error if a function is missing.
    // We just want to make sure the example doesn't crash.
    return () => {};
  },
});

function testExample(filePath) {
  let code = fs.readFileSync(filePath, 'utf-8');
  code = `(async () => { ${code} })();`;
  try {
    vm.runInNewContext(code, proxy);
  } catch (e) {
    // We'll assert that no errors are thrown.
    assert.fail(`Example file failed to execute: ${filePath}\n${e}`);
  }
}

test('run all examples', async (t) => {
  const categories = fs.readdirSync(EXAMPLES_DIR);
  for (const category of categories) {
    const categoryPath = path.join(EXAMPLES_DIR, category);
    const files = fs.readdirSync(categoryPath);
    for (const file of files) {
      if (file.endsWith('.js')) {
        await t.test(`example: ${category}/${file}`, () => {
          testExample(path.join(categoryPath, file));
        });
      }
    }
  }
});
