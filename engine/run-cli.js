// This script provides a command-line interface for testing the WebSonic engine flow.
// It overrides the audio output functions to log their calls to the console,
// allowing us to verify the engine's behavior in a CLI environment.

import { use_bpm, use_synth, sleep, live_loop, stop } from './src/index.js';

// Mock the audio output functions to log to the console
const play = (note, options) => {
  console.log(`[PLAY] note: ${note}, options: ${JSON.stringify(options)}`);
};

const sample = (name, options) => {
  console.log(`[SAMPLE] name: ${name}, options: ${JSON.stringify(options)}`);
};

console.log('--- Starting WebSonic Engine CLI Test ---');

// --- Define the musical code to test ---
async function runTest() {
  use_bpm(120);

  live_loop('drums', async () => {
    sample('kick');
    await sleep(0.5);
    sample('snare');
    await sleep(0.5);
  });

  live_loop('melody', async () => {
    use_synth('sawtooth');
    play(60, { release: 0.2 });
    await sleep(0.25);
    play(64, { release: 0.2 });
    await sleep(0.25);
    play(67, { release: 0.2 });
    await sleep(0.5);
  });
}

// --- Execute the test and stop after a few seconds ---
runTest();

setTimeout(() => {
  console.log('--- Stopping WebSonic Engine CLI Test ---');
  stop();
  process.exit(0);
}, 4000); // Run for 4 seconds