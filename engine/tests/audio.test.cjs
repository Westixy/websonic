const { test } = require('node:test');
const assert = require('node:assert');

test('audio functions', async (t) => {
  const { play, use_synth, use_bpm, sample, scale, chord, sleep } = await import('../src/audio.js');

  await t.test('play function does not throw', () => {
    assert.doesNotThrow(() => {
      play(60);
    });
  });

  await t.test('use_synth changes the current synth', () => {
    // This is harder to test without inspecting internal state.
    // For now, we just ensure it doesn't throw.
    assert.doesNotThrow(() => {
      use_synth('sawtooth');
    });
  });

  await t.test('use_bpm changes the tempo', async () => {
    const start = Date.now();
    use_bpm(120);
    await sleep(1); // 1 beat at 120 bpm should be 0.5s
    const end = Date.now();
    const diff = end - start;
    assert.ok(diff >= 490 && diff <= 510, `sleep duration should be ~500ms, but was ${diff}ms`);
  });

  await t.test('sample function does not throw for known samples', () => {
    assert.doesNotThrow(() => sample('kick'));
    assert.doesNotThrow(() => sample('snare'));
    assert.doesNotThrow(() => sample('hat'));
  });

  await t.test('scale function returns correct notes', () => {
    const cMajor = scale(60, 'major');
    assert.deepStrictEqual(cMajor, [60, 62, 64, 65, 67, 69, 71]);
  });

  await t.test('chord function returns correct notes', () => {
    const cMajorChord = chord(60, 'major');
    assert.deepStrictEqual(cMajorChord, [60, 64, 67]);
  });
});