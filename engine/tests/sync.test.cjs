const { test } = require('node:test');
const assert = require('node:assert');

test('sync and event', async (t) => {
    const { sync, event } = await import('../src/sync.js');

    await t.test('sync waits for an event', async () => {
        let eventFired = false;
        setTimeout(() => {
            event('test_event');
            eventFired = true;
        }, 100);

        await sync('test_event');
        assert.ok(eventFired, 'event should have been fired');
    });

    await t.test('sync receives a value from event', async () => {
        const testValue = 'hello';
        setTimeout(() => {
            event('test_event_with_value', testValue);
        }, 100);

        const result = await sync('test_event_with_value');
        assert.strictEqual(result, testValue, 'sync should receive the value from the event');
    });
});
