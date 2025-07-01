import { getContext } from './getContext.js';

let masterGain;
let currentSynth = 'sine';
let bpm = 60;
let fxChain = [];
const impulseResponseCache = {};
const activeNodes = {};

async function loadImpulseResponse(url) {
  if (impulseResponseCache[url]) {
    return impulseResponseCache[url];
  }
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const decodedAudio = await getContext().decodeAudioData(arrayBuffer);
  impulseResponseCache[url] = decodedAudio;
  return decodedAudio;
}

function getAudioContext() {
    const audioContext = getContext();
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    return audioContext;
}

export function init() {
    const audioContext = getAudioContext();
    if (masterGain) {
        masterGain.disconnect();
    }
    masterGain = audioContext.createGain();
    masterGain.connect(audioContext.destination);
    fxChain = [masterGain];
}

export function setMasterVolume(level) {
  if (masterGain) {
    masterGain.gain.setValueAtTime(level, getContext().currentTime);
  }
}

export function use_bpm(newBpm) {
  bpm = newBpm;
}

const noteToFreq = {
  'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
};

const scales = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  // Add more scales here
};

const chords = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  // Add more chords here
};

let transpose = 0;

export function use_transpose(val) {
  transpose = val;
}

function getFrequency(note) {
  if (typeof note === 'string') {
    return noteToFreq[note.toUpperCase()] || 440;
  }
  if (typeof note === 'number') {
    return Math.pow(2, (note + transpose - 69) / 12) * 440;
  }
  return note;
}

export function note(name, options = {}) {
  const noteMap = {
    'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11
  };
  const accidentalMap = {
    '#': 1,
    'b': -1,
  };
  const octave = options.octave || 4;
  const accidental = accidentalMap[name[1]] || 0;
  const noteName = name[0].toUpperCase();
  const noteVal = noteMap[noteName];
  return 12 * (octave + 1) + noteVal + accidental;
}

export function scale(rootNote, scaleName, numOctaves = 1) {
  const scaleIntervals = scales[scaleName] || scales.major;
  const notes = [];
  for (let octave = 0; octave < numOctaves; octave++) {
    for (const interval of scaleIntervals) {
      notes.push(rootNote + (octave * 12) + interval);
    }
  }
  return notes;
}

export function chord(rootNote, chordName) {
  const chordIntervals = chords[chordName] || chords.major;
  return chordIntervals.map(interval => rootNote + interval);
}

export function chord_degree(degree, key, scaleName, num_octaves = 1, options = {}) {
  const notes = scale(note(key), scaleName, num_octaves);
  const root = notes[degree - 1];
  const chord_notes = chord(root, options.chord || 'major');
  if (options.invert) {
    const inverted = [];
    for (let i = 0; i < chord_notes.length; i++) {
      inverted.push(chord_notes[(i + options.invert) % chord_notes.length]);
    }
    return inverted;
  }
  return chord_notes;
}

let synthDefaults = {};

export function use_synth(synth) {
  currentSynth = synth;
}

export function use_synth_defaults(options) {
  synthDefaults = options;
}

function getCurrentFxNode() {
    return fxChain[fxChain.length - 1];
}

export async function with_fx(fxName, options, fn) {
    const context = getAudioContext();
    let fxInputNode;

    const currentEntryPoint = getCurrentFxNode();

    switch (fxName) {
        case 'reverb': {
            // @ts-ignore
            const { room = 0.7, mix = 0.5 } = options; // Keep room for compatibility, though unused in new logic
            const impulseUrl = 'https://oramics.github.io/sampled/IR/Voxengo/samples/bottle_hall.wav';
            const impulseBuffer = await loadImpulseResponse(impulseUrl);
            
            const convolver = context.createConvolver();
            convolver.buffer = impulseBuffer;

            const wetGain = context.createGain();
            wetGain.gain.value = mix;

            const dryGain = context.createGain();
            dryGain.gain.value = 1 - mix;

            const input = context.createGain();
            input.connect(dryGain);
            input.connect(convolver);
            convolver.connect(wetGain);

            fxInputNode = input;

            dryGain.connect(currentEntryPoint);
            wetGain.connect(currentEntryPoint);
            
            break;
        }
        case 'delay': {
            const { time = 0.5, feedback = 0.5 } = options;
            const delayNode = context.createDelay();
            delayNode.delayTime.value = time;

            const feedbackNode = context.createGain();
            feedbackNode.gain.value = feedback;

            delayNode.connect(feedbackNode);
            feedbackNode.connect(delayNode);
            
            fxInputNode = delayNode;
            delayNode.connect(currentEntryPoint);
            break;
        }
        case 'lpf':
        case 'rlpf': {
            const { cutoff = 100, res = 0.5 } = options;
            const filterNode = context.createBiquadFilter();
            filterNode.type = 'lowpass';
            filterNode.frequency.value = cutoff;
            filterNode.Q.value = res;
            
            fxInputNode = filterNode;
            filterNode.connect(currentEntryPoint);
            break;
        }
        case 'hpf': {
            const { cutoff = 100, res = 0.5 } = options;
            const filterNode = context.createBiquadFilter();
            filterNode.type = 'highpass';
            filterNode.frequency.value = cutoff;
            filterNode.Q.value = res;
            
            fxInputNode = filterNode;
            filterNode.connect(currentEntryPoint);
            break;
        }
        case 'echo': {
            const { time = 0.25, mix = 0.5 } = options;
            const delayNode = context.createDelay();
            delayNode.delayTime.value = time;

            const feedbackNode = context.createGain();
            feedbackNode.gain.value = mix;

            delayNode.connect(feedbackNode);
            feedbackNode.connect(delayNode);
            
            fxInputNode = delayNode;
            delayNode.connect(currentEntryPoint);
            break;
        }
        case 'panslicer': {
            const { phase = 0.25, wave = 0, mix = 1 } = options;
            const panner = context.createStereoPanner();
            const lfo = context.createOscillator();
            const gain = context.createGain();

            lfo.type = ['sine', 'sawtooth', 'triangle', 'square'][wave];
            lfo.frequency.value = 1 / phase;
            gain.gain.value = mix;

            lfo.connect(gain);
            gain.connect(panner.pan);
            lfo.start();

            fxInputNode = panner;
            panner.connect(currentEntryPoint);
            break;
        }
        case 'compressor': {
            const { threshold = -24, knee = 30, ratio = 12, attack = 0.003, release = 0.25 } = options;
            const compressorNode = context.createDynamicsCompressor();
            compressorNode.threshold.value = threshold;
            compressorNode.knee.value = knee;
            compressorNode.ratio.value = ratio;
            compressorNode.attack.value = attack;
            compressorNode.release.value = release;

            fxInputNode = compressorNode;
            compressorNode.connect(currentEntryPoint);
            break;
        }
        case 'distortion': {
            const { distort = 0.5 } = options;
            const distortionNode = context.createWaveShaper();
            const amount = distort * 100;
            const k = typeof amount === 'number' ? amount : 50;
            const n_samples = 44100;
            const curve = new Float32Array(n_samples);
            const deg = Math.PI / 180;
            let i = 0;
            let x;
            for ( ; i < n_samples; ++i ) {
                x = i * 2 / n_samples - 1;
                curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
            }
            distortionNode.curve = curve;
            distortionNode.oversample = '4x';

            fxInputNode = distortionNode;
            distortionNode.connect(currentEntryPoint);
            break;
        }
        default:
            console.error(`FX '${fxName}' not found.`);
            await fn();
            return;
    }

    fxChain.push(fxInputNode);

    await fn();
}

export function control(id, options) {
  const node = activeNodes[id];
  if (!node) {
    return;
  }

  const now = getAudioContext().currentTime;

  if (options.note) {
    node.oscillator.frequency.setValueAtTime(getFrequency(options.note), now);
  }
  if (options.cutoff) {
    node.filter.frequency.setValueAtTime(getFrequency(options.cutoff), now);
  }
  if (options.pan) {
    node.panner.pan.setValueAtTime(options.pan, now);
  }
}

export function play(note, options = {}) {
  const context = getAudioContext();
  context.resume();

  if (Array.isArray(note)) {
    return note.map(n => play(n, options));
  }

  if (typeof note !== 'number' && typeof note !== 'string') {
    console.error('Invalid note:', note);
    return;
  }

  const opts = { ...synthDefaults, ...options };

  const {
    // @ts-ignore
    amp = 1,
    // @ts-ignore
    attack = 0.01,
    // @ts-ignore
    attack_level = 1,
    // @ts-ignore
    decay = 0,
    // @ts-ignore
    sustain = 0,
    // @ts-ignore
    sustain_level = 1,
    // @ts-ignore
    release = 1,
    // @ts-ignore
    cutoff = 130, // MIDI note
    // @ts-ignore
    pan = 0,
    // @ts-ignore
    synth = currentSynth
  } = opts;

  const now = context.currentTime;

  const oscillator = context.createOscillator();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  const panner = context.createStereoPanner();

  const id = Math.random().toString(36).substring(7);
  activeNodes[id] = { oscillator, filter, gain, panner };

  // Oscillator
  oscillator.type = synth;
  oscillator.frequency.setValueAtTime(getFrequency(note), now);

  // Filter
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(getFrequency(cutoff), now);

  // Panner
  panner.pan.setValueAtTime(pan, now);

  // ADSR Envelope
  const attackEnd = now + attack;
  const decayEnd = attackEnd + decay;
  const sustainEnd = decayEnd + sustain;
  const releaseEnd = sustainEnd + release;

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(attack_level, attackEnd);
  gain.gain.linearRampToValueAtTime(sustain_level, decayEnd);
  if (sustain > 0) {
    gain.gain.setValueAtTime(sustain_level, sustainEnd);
  }
  gain.gain.linearRampToValueAtTime(0, releaseEnd);

  // Connections
  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(panner);
  panner.connect(getCurrentFxNode());

  // Start and Stop
  oscillator.start(now);
  oscillator.stop(releaseEnd);

  return id;
}

const sampleCache = {};

export async function loadSample(url, context) {
  if (sampleCache[url]) {
    return sampleCache[url];
  }
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const decodedAudio = await context.decodeAudioData(arrayBuffer);
  sampleCache[url] = decodedAudio;
  return decodedAudio;
}

export async function sample_duration(name) {
  const context = getAudioContext();
  const buffer = await loadSample(name, context);
  return buffer.duration;
}

export async function sample(name, options = {}) {
  const context = getAudioContext();
  context.resume();

  const now = context.currentTime;
  const { amp = 1, pan = 0, start = 0, end = 1, rate = 1, beat_stretch = false } = options;

  const buffer = await loadSample(name, context);
  const source = context.createBufferSource();
  source.buffer = buffer;

  if (beat_stretch) {
    source.playbackRate.value = (sampleBpm / bpm) * rate;
  } else {
    source.playbackRate.value = rate;
  }

  const panner = context.createStereoPanner();
  panner.pan.setValueAtTime(pan, now);

  const gain = context.createGain();
  gain.gain.setValueAtTime(amp, now);

  source.connect(gain);
  gain.connect(panner);
  panner.connect(getCurrentFxNode());

  const duration = buffer.duration;
  const offset = start * duration;
  const playDuration = (end - start) * duration;

  source.start(now, offset, playDuration);
}

let sampleBpm = 60;

export function use_sample_bpm(val) {
  sampleBpm = val;
}

export function sleep(beats) {
  const seconds = (60 / bpm) * beats;
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}