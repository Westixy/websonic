export * from './audio.js';
export * from './collections.js';
export * from './random.js';
export * from './sync.js';
export * from './state.js';
export * from './examples.js';
export { getContext } from './getContext.js';

import { init, loadSample } from './audio.js';
import { reset_random_seed } from './random.js';
import { event } from './sync.js';

const activeLoops = {};
let isRunning = false;
let debug = false;

export function use_debug(val) {
  debug = val;
}

export function load_samples(samples) {
  const context = getContext();
  samples.forEach(sample => loadSample(sample, context));
}

export function at(time, fn) {
  setTimeout(fn, time * 1000);
}

export function uncomment(fn) {
  // No-op
}

export function factor(a, b) {
  return a % b === 0;
}

export function density(n, fn) {
  const sleepTime = 1 / n;
  for (let i = 0; i < n; i++) {
    fn();
    sleep(sleepTime);
  }
}

export function sample_names(category) {
  const samplesDir = path.join(process.cwd(), 'websonic/public/samples');
  const files = fs.readdirSync(samplesDir);
  return files.filter(file => file.startsWith(category));
}

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
  reset_random_seed();
}

export function live_loop(name, fn) {
  activeLoops[name] = true;
  (async () => {
    while (isRunning && activeLoops[name]) {
      try {
        await fn();
        event(name);
      } catch (e) {
        if (debug && e.message !== "stopped") {
          console.error(`Error in live_loop '${name}':`, e);
        }
        stop();
        break;
      }
    }
  })();
}