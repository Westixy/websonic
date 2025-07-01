const { test } = require('node:test');
const assert = require('node:assert');

test('random', async (t) => {
    const { choose, rrand } = await import('../src/random.js');

    await t.test('choose', () => {
        const list = [1, 2, 3, 4, 5];
        const choice = choose(list);
        assert.ok(list.includes(choice), 'chosen item should be in the list');
    });

    await t.test('rrand', () => {
        const min = 10;
        const max = 20;
        const value = rrand(min, max);
        assert.ok(value >= min && value <= max, 'random value should be within the specified range');
    });
});