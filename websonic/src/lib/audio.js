let audioContext;
let masterGain;
let currentSynth = 'sine';
let bpm = 60;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioContext.createGain();
    masterGain.connect(audioContext.destination);
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

export function setMasterVolume(level) {
  if (masterGain) {
    masterGain.gain.setValueAtTime(level, audioContext.currentTime);
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

export function play(note, options = {}) {
  if (Array.isArray(note)) {
    note.forEach(n => play(n, options));
    return;
  }

  const {
    amp = 1,
    attack = 0.01,
    sustain = 0,
    release = 1,
    cutoff = 130, // MIDI note
    synth = currentSynth
  } = options;

  const context = getAudioContext();
  const now = context.currentTime;

  const oscillator = context.createOscillator();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();

  // Oscillator
  oscillator.type = synth;
  oscillator.frequency.setValueAtTime(getFrequency(note), now);

  // Filter
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(getFrequency(cutoff), now);

  // ADSR Envelope
  const attackEnd = now + attack;
  const sustainEnd = attackEnd + sustain;
  const releaseEnd = sustainEnd + release;

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(amp, attackEnd);
  if (sustain > 0) {
    gain.gain.setValueAtTime(amp, sustainEnd);
  }
  gain.gain.linearRampToValueAtTime(0, releaseEnd);

  // Connections
  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);

  // Start and Stop
  oscillator.start(now);
  oscillator.stop(releaseEnd);
}

export function sample(name, options = {}) {
  const context = getAudioContext();
  const now = context.currentTime;
  const { amp = 1, release = 0.5 } = options;

  switch (name) {
    case 'kick': {
      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.connect(gain);
      gain.connect(masterGain);

      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.1);

      gain.gain.setValueAtTime(1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + release);

      osc.start(now);
      osc.stop(now + release);
      break;
    }
    case 'snare': {
        const noiseBuffer = context.createBuffer(1, context.sampleRate * 0.2, context.sampleRate);
        const noiseOutput = noiseBuffer.getChannelData(0);
        for (let i = 0; i < noiseOutput.length; i++) {
            noiseOutput[i] = Math.random() * 2 - 1;
        }

        const noise = context.createBufferSource();
        noise.buffer = noiseBuffer;

        const noiseFilter = context.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.value = 1500;
        noiseFilter.Q.value = 1;

        const noiseGain = context.createGain();
        noiseGain.gain.setValueAtTime(amp, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);

        const osc = context.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = 100;

        const oscGain = context.createGain();
        oscGain.gain.setValueAtTime(amp * 0.5, now);
        oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        osc.connect(oscGain);
        oscGain.connect(masterGain);

        noise.start(now);
        noise.stop(now + 0.2);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
    }
    case 'hat': {
        const bufferSize = context.sampleRate * 0.1;
        const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const noise = context.createBufferSource();
        noise.buffer = buffer;

        const filter = context.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 10000;

        const gain = context.createGain();
        gain.gain.setValueAtTime(amp, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        noise.start(now);
        noise.stop(now + 0.05);
        break;
    }
    default:
      console.error(`Sample '${name}' not found.`);
  }
}

export function sleep(beats) {
  const seconds = (60 / bpm) * beats;
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}