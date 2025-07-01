import { getContext } from './getContext.js';

let masterGain;
let currentSynth = 'sine';
let bpm = 60;
let fxChain = [];
const impulseResponseCache = {};

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

function getFrequency(note) {
  if (typeof note === 'string') {
    return noteToFreq[note.toUpperCase()] || 440;
  }
  if (typeof note === 'number') {
    return Math.pow(2, (note - 69) / 12) * 440;
  }
  return note;
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

export function use_synth(synth) {
  currentSynth = synth;
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
        default:
            console.error(`FX '${fxName}' not found.`);
            await fn();
            return;
    }

    fxChain.push(fxInputNode);

    await fn();
}

export function play(note, options = {}) {
  const context = getAudioContext();
  context.resume();

  if (Array.isArray(note)) {
    note.forEach(n => play(n, options));
    return;
  }

  const {
    amp = 1,
    attack = 0.01,
    attack_level = 1,
    decay = 0,
    sustain = 0,
    sustain_level = 1,
    release = 1,
    cutoff = 130, // MIDI note
    pan = 0,
    synth = currentSynth
  } = options;

  const now = context.currentTime;

  const oscillator = context.createOscillator();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  const panner = context.createStereoPanner();

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
}

const sampleCache = {};

async function loadSample(url, context) {
  if (sampleCache[url]) {
    return sampleCache[url];
  }
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const decodedAudio = await context.decodeAudioData(arrayBuffer);
  sampleCache[url] = decodedAudio;
  return decodedAudio;
}

export async function sample(name, options = {}) {
  const context = getAudioContext();
  context.resume();

  const now = context.currentTime;
  const { amp = 1, pan = 0, start = 0, end = 1, rate = 1 } = options;

  const buffer = await loadSample(name, context);
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.rate = rate;

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

export function sleep(beats) {
  const seconds = (60 / bpm) * beats;
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}