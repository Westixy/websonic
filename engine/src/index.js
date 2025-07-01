export * from './audio.js';
export * from './collections.js';
export * from './random.js';
export { getContext } from './getContext.js';

import { init } from './audio.js';

const activeLoops = {};
let isRunning = false;

export function start() {
  stop(); // Stop any previous loops
  init();
  isRunning = true;
}

export function stop() {
  isRunning = false;
  for (const loop in activeLoops) {
    activeLoops[loop] = false;
  }
}

export function live_loop(name, fn) {
  activeLoops[name] = true;
  (async () => {
    while (isRunning && activeLoops[name]) {
      try {
        await fn();
      } catch (e) {
        if (e.message !== "stopped") {
          console.error(`Error in live_loop '${name}':`, e);
        }
        stop();
        break;
      }
    }
  })();
}