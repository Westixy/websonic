<script>
  import { onMount } from 'svelte';
  import { 
    play, sleep, use_synth, setMasterVolume, use_bpm, sample, scale, chord, chord_degree, with_fx, 
    choose, rrand, ring, tick, look, reset_tick, rand, rand_i, use_random_seed, sync, set, get,
    start, stop, live_loop, init, control
  } from 'websonic-engine';
  import CodeMirror from 'svelte-codemirror-editor';
  import { javascript } from '@codemirror/lang-javascript';
  import { oneDark } from '@codemirror/theme-one-dark';
  import Console from './components/Console.svelte';
  import Resizer from './components/Resizer.svelte';
  import Examples from './components/Examples.svelte';
  import { examples } from 'websonic-engine';

  let code = `// Welcome to WebSonic!
// This example showcases many of the new features.
use_random_seed(10);
use_bpm(120);

set('melody', ring(60, 62, 64, 65, 67, 69, 71).chain(72, 71, 69, 67, 65, 64, 62));

live_loop('drums', async () => {
  sample('/samples/kick.flac', { rate: 1, pan: -0.5 });
  await sleep(0.5);
  sample('/samples/kick.flac', { rate: 1.5, pan: 0.5 });
  await sleep(0.5);
});

live_loop('bass', async () => {
  use_synth('tb303');
  play(get('melody').look, { 
    release: 0.2,
    pan: rrand(-1, 1),
    cutoff: rrand(60, 110),
    attack: 0.01,
    decay: 0.1,
    sustain: 0.1,
    attack_level: 1,
    sustain_level: 0.4,
  });
  await sleep(0.25);
});

with_fx('reverb', { room: 0.8, mix: 0.6 }, async () => {
  live_loop('melody', async () => {
    await sync('drums');
    use_synth('sawtooth');
    play(get('melody').look, { release: 0.2, pan: rrand(-1, 1) });
    await sleep(0.25);
  });
});
`;

  let isUiRunning = false;
  let volume = 0.5;
  let bpmValue = 120;
  let synthValue = 'sawtooth';
  let consoleMessages = [];
  let consoleHeight = 200;
  let showExamples = false;

  const synths = ['sine', 'square', 'sawtooth', 'triangle', 'tb303', 'dsaw', 'fm', 'pulse', 'prophet', 'beep', 'hollow', 'blade', 'pnoise', 'mod_fm', 'mod_dsaw', 'mod_pulse', 'mod_saw', 'zawa', 'rodeo'];

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
    init();
    setMasterVolume(volume);
    use_bpm(bpmValue);
    use_synth(synthValue);
    // Override console methods to capture logs
    console.log = (...args) => {
      originalConsoleLog(...args);
      logMessage('log', ...args);
    };
    console.error = (...args) => {
      originalConsoleError(...args);
      logMessage('error', ...args);
    };

    const loadExampleFromHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/example/')) {
        const exampleName = hash.substring('#/example/'.length);
        for (const category in examples) {
          const example = examples[category].find(ex => ex.name === exampleName);
          if (example) {
            code = example.content;
            break;
          }
        }
      }
    }

    setTimeout(loadExampleFromHash, 0);
    window.addEventListener('hashchange', loadExampleFromHash);

    return () => {
      window.removeEventListener('hashchange', loadExampleFromHash);
    };
  });

  function handleVolumeChange(e) {
    volume = e.target.value;
    setMasterVolume(volume);
  }

  function handleBpmChange(e) {
    bpmValue = e.target.value;
    use_bpm(bpmValue);
  }

  function handleSynthChange(e) {
    synthValue = e.target.value;
    use_synth(synthValue);
  }

  function handleResize(e) {
    const newHeight = window.innerHeight - e.detail.y;
    if (newHeight > 50 && newHeight < window.innerHeight - 100) {
      consoleHeight = newHeight;
    }
  }

  function handleExampleSelect(e) {
    code = e.detail.content;
    window.location.hash = `#/example/${e.detail.name}`;
    showExamples = false;
  }

  async function runCode() {
    if (isUiRunning) {
      stop();
      isUiRunning = false;
      return;
    }
    
    start();
    setMasterVolume(volume);
    use_bpm(bpmValue);
    use_synth(synthValue);
    isUiRunning = true;
    consoleMessages = [];
    reset_tick();

    const sandboxContext = {
      play: (note, options) => {
        logMessage('info', `[PLAY] note: ${note}, options: ${JSON.stringify(options)}`);
        play(note, options);
      },
      sleep,
      use_synth: (synth) => {
        logMessage('info', `[SYNTH] using: ${synth}`);
        use_synth(synth);
      },
      use_bpm,
      sample: (name, options) => {
        logMessage('info', `[SAMPLE] name: ${name}, options: ${JSON.stringify(options)}`);
        sample(window.location.origin + name, options);
      },
      scale,
      chord,
      chord_degree,
      choose,
      rrand,
      rand,
      rand_i,
      use_random_seed,
      sync,
      set,
      get,
      ring,
      tick,
      look,
      reset_tick,
      console: {
        log: (...args) => logMessage('log', ...args)
      },
      with_fx,
      live_loop,
      control,
    };

    try {
      const contextKeys = Object.keys(sandboxContext);
      const contextValues = Object.values(sandboxContext);
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      const userCode = new AsyncFunction(...contextKeys, code);
      
      await userCode(...contextValues);

    } catch (e) {
      logMessage('error', "Error executing code:", e);
      stop();
      isUiRunning = false;
    }
  }
</script>

<main>
  <header>
    <div class="logo-container">
      <img src="/logo.png" alt="WebSonic Logo" />
      <h1>WebSonic</h1>
    </div>
    <div class="controls">
      <button on:click={() => showExamples = !showExamples}>
        {showExamples ? 'Hide Examples' : 'Show Examples'}
      </button>
      <button on:click={runCode} class:running={isUiRunning}>
        {isUiRunning ? '■ Stop' : '▶ Run'}
      </button>
      <div class="control-group">
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
      <a href="https://github.com/Westixy/websonic" target="_blank" rel="noopener noreferrer">
        <img src="/github-logo.svg" alt="GitHub" class="github-logo" />
      </a>
    </div>
  </header>
  <div class="main-container">
    {#if showExamples}
      <div class="examples-panel">
        <Examples on:select={handleExampleSelect} />
      </div>
    {/if}
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

  .logo-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .logo-container img {
    height: 2rem;
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

  .control-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
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

  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    width: 100px;
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

  .github-logo {
    height: 1.5rem;
    filter: invert(1);
  }

  .main-container {
    display: flex;
    flex-grow: 1;
    overflow: hidden;
  }

  .examples-panel {
    width: 300px;
    border-right: 1px solid var(--border-color);
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


