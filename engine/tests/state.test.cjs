const { test } = require('node:test');
const assert = require('node:assert');

test('state', async (t) => {
    const { set, get } = await import('../src/state.js');

    await t.test('set and get', () => {
        set('foo', 'bar');
        assert.strictEqual(get('foo'), 'bar');
    });
});
