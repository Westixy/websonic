const { test } = require('node:test');
const assert = require('node:assert');

test('collections', async (t) => {
    const { ring, tick, look, reset_tick } = await import('../src/collections.js');

    await t.test('ring', () => {
        reset_tick();
        const myRing = ring([1, 2, 3]);
        assert.strictEqual(myRing.get(0), 1);
        assert.strictEqual(myRing.get(1), 2);
        assert.strictEqual(myRing.get(2), 3);
        assert.strictEqual(myRing.get(3), 1); // wraps around
        assert.strictEqual(myRing.get(-1), 3); // wraps around backwards
    });

    await t.test('tick, look, reset_tick', () => {
        reset_tick();
        assert.strictEqual(look(), 0);
        tick();
        assert.strictEqual(look(), 1);
        tick();
        assert.strictEqual(look(), 2);
        reset_tick();
        assert.strictEqual(look(), 0);
    });

    await t.test('ring.tick', () => {
        reset_tick();
        const myRing = ring([10, 20, 30]);
        assert.strictEqual(myRing.tick, 10);
        assert.strictEqual(myRing.tick, 20);
        assert.strictEqual(myRing.tick, 30);
        assert.strictEqual(myRing.tick, 10);
        reset_tick();
        assert.strictEqual(myRing.tick, 10);
    });
});