<script>
  import { onMount } from 'svelte';
  import { play, sleep, use_synth, setMasterVolume, use_bpm, sample, scale, chord, with_fx } from './lib/audio.js';
  import { choose, rrand } from './lib/random.js';
  import { ring, tick, look, reset_tick } from './lib/collections.js';
  import CodeMirror from 'svelte-codemirror-editor';
  import { javascript } from '@codemirror/lang-javascript';
  import { oneDark } from '@codemirror/theme-one-dark';
  import Console from './lib/Console.svelte';
  import Resizer from './lib/Resizer.svelte';

  let code = `// Welcome to WebSonic!
// All loops and sleeps must be async/await.
use_bpm(120);

live_loop('drums', async () => {
  sample('kick');
  await sleep(0.5);
  sample('snare');
  await sleep(0.5);
});

await with_fx('reverb', { room: 0.8, mix: 0.6 }, async () => {
  live_loop('melody', async () => {
    use_synth('sawtooth');
    play(rrand(60, 72), { release: 0.2 });
    await sleep(0.25);
  });
});
`;

  let isRunning = false;
  let volume = 0.5;
  let consoleMessages = [];
  let consoleHeight = 200;
  const activeLoops = {};

  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;

  function logMessage(type, ...args) {
    const content = args.map(arg => {
      if (arg instanceof Error) return arg.message;
      if (typeof arg === 'object' && arg !== null) return JSON.stringify(arg);
      return arg;
    }).join(' ');
    
    consoleMessages = [...consoleMessages, {
      type,
      content,
      time: new Date().toLocaleTimeString()
    }];
  }

  onMount(() => {
    setMasterVolume(volume);
    // Override console methods to capture logs
    console.log = (...args) => {
      originalConsoleLog(...args);
      logMessage('log', ...args);
    };
    console.error = (...args) => {
      originalConsoleError(...args);
      logMessage('error', ...args);
    };
  });

  function handleVolumeChange(e) {
    volume = e.target.value;
    setMasterVolume(volume);
  }

  function handleResize(e) {
    const newHeight = window.innerHeight - e.detail.y;
    if (newHeight > 50 && newHeight < window.innerHeight - 100) {
      consoleHeight = newHeight;
    }
  }

  function stopCode() {
    isRunning = false;
    for (const loop in activeLoops) {
      activeLoops[loop] = false;
    }
  }

  async function runCode() {
    if (isRunning) return;
    
    stopCode();
    await new Promise(resolve => setTimeout(resolve, 50)); // Grace period for loops to stop

    isRunning = true;
    consoleMessages = [];
    reset_tick();

    const sandboxContext = {
      play,
      sleep: async (beats) => {
        if (!isRunning) throw new Error("stopped");
        await sleep(beats);
      },
      use_synth,
      use_bpm,
      sample,
      scale,
      chord,
      choose,
      rrand,
      ring,
      tick,
      look,
      reset_tick,
      console: {
        log: (...args) => logMessage('log', ...args)
      },
      with_fx,
      live_loop: (name, fn) => {
        activeLoops[name] = true;
        (async () => {
          while (isRunning && activeLoops[name]) {
            try {
              await fn();
              await new Promise(resolve => setTimeout(resolve, 1)); 
            } catch (e) {
              if (e.message !== "stopped") {
                logMessage('error', `Error in live_loop '${name}':`, e);
              }
              stopCode();
              break;
            }
          }
        })();
      },
    };

    try {
      const contextKeys = Object.keys(sandboxContext);
      const contextValues = Object.values(sandboxContext);
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      const userCode = new AsyncFunction(...contextKeys, code);
      
      await userCode(...contextValues);

    } catch (e) {
      logMessage('error', "Error executing code:", e);
      stopCode();
    }
  }
</script>

<main>
  <header>
    <h1>WebSonic</h1>
    <div class="controls">
      <button on:click={isRunning ? stopCode : runCode} class:running={isRunning}>
        {isRunning ? '■ Stop' : '▶ Run'}
      </button>
      <div class="volume-control">
        <label for="volume">Volume</label>
        <input 
          type="range" 
          id="volume" 
          min="0" 
          max="1" 
          step="0.01" 
          bind:value={volume}
          on:input={handleVolumeChange}
        />
      </div>
    </div>
  </header>
  <div class="editor-container">
    <CodeMirror
      bind:value={code}
      lang={javascript()}
      theme={oneDark}
      styles={{
        '&': {
          height: '100%',
        },
        '.cm-scroller': {
          overflow: 'auto',
        }
      }}
    />
  </div>
  <Resizer on:move={handleResize} />
  <div style="height: {consoleHeight}px;">
    <Console messages={consoleMessages} on:clear={() => consoleMessages = []} />
  </div>
</main>

<style>
  :root {
    --primary-color: #ff3e00;
    --background-color: #1e1e1e;
    --text-color: #f0f0f0;
    --editor-background: #2d2d2d;
    --border-color: #444;
  }

  main {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: var(--background-color);
    color: var(--text-color);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    border-bottom: 1px solid var(--border-color);
    background-color: var(--editor-background);
  }

  h1 {
    margin: 0;
    font-size: 1.5rem;
    color: var(--primary-color);
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  button {
    padding: 0.5rem 1rem;
    border: 1px solid var(--primary-color);
    border-radius: 4px;
    background-color: transparent;
    color: var(--primary-color);
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s, color 0.2s;
  }

  button:hover {
    background-color: var(--primary-color);
    color: var(--background-color);
  }

  button.running {
    background-color: var(--primary-color);
    color: var(--background-color);
  }

  .volume-control {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    width: 150px;
    height: 8px;
    background: var(--background-color);
    border-radius: 5px;
    outline: none;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    background: var(--primary-color);
    border-radius: 50%;
    cursor: pointer;
  }

  input[type="range"]::-moz-range-thumb {
    width: 18px;
    height: 18px;
    background: var(--primary-color);
    border-radius: 50%;
    cursor: pointer;
  }

  .editor-container {
    flex-grow: 1;
    overflow: auto;
  }

  :global(html, body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
    box-sizing: border-box;
  }
</style>