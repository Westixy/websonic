const { test } = require('node:test');
const assert = require('node:assert');

test('random', async (t) => {
    const { choose, rrand, rrand_i, rand, rand_i, use_random_seed, reset_random_seed } = await import('../src/random.js');

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

    await t.test('rrand_i', () => {
        const min = 10;
        const max = 20;
        const value = rrand_i(min, max);
        assert.ok(Number.isInteger(value) && value >= min && value <= max, 'random value should be an integer within the specified range');
    });

    await t.test('rand', () => {
        const value = rand();
        assert.ok(value >= 0 && value < 1, 'random value should be between 0 and 1');
    });

    await t.test('rand_i', () => {
        const value = rand_i(10);
        assert.ok(Number.isInteger(value) && value >= 0 && value <= 10, 'random value should be an integer between 0 and 10');
    });

    await t.test('use_random_seed', () => {
        use_random_seed(123);
        const val1 = rrand(0, 100);
        use_random_seed(123);
        const val2 = rrand(0, 100);
        assert.strictEqual(val1, val2, 'should produce the same random number with the same seed');
        reset_random_seed();
    });
});