// engine/tests/mocks/isomorphic-web-audio-api.cjs
const sinon = require('sinon');

// This is the mock AudioContext that will be used by the tests.
const mockAudioContext = sinon.stub().callsFake(function() {
  return {
    createGain: () => ({
      connect: () => {},
      disconnect: () => {},
      gain: {
        setValueAtTime: () => {},
        linearRampToValueAtTime: () => {},
        exponentialRampToValueAtTime: () => {}
      }
    }),
    createOscillator: () => ({
      connect: () => {},
      start: () => {},
      stop: () => {},
      frequency: {
        setValueAtTime: () => {},
        exponentialRampToValueAtTime: () => {}
      }
    }),
    createBiquadFilter: () => ({
        connect: () => {},
        type: 'lowpass',
        frequency: { value: 350, setValueAtTime: () => {} },
        Q: { value: 1 },
    }),
    createStereoPanner: () => ({
        connect: () => {},
        pan: {
            value: 0,
            setValueAtTime: () => {},
        },
    }),
    createBufferSource: () => ({
        connect: () => {},
        start: () => {},
        stop: () => {},
        buffer: null,
        rate: {
            value: 1,
        }
    }),
    createBuffer: () => ({
        getChannelData: () => []
    }),
    destination: {},
    currentTime: 0,
    sampleRate: 44100,
    resume: () => Promise.resolve(),
    decodeAudioData: () => Promise.resolve({
        duration: 1.753, // Mock duration for loop_amen
    }),
  };
});

global.fetch = sinon.stub().returns(Promise.resolve({
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
}));

module.exports.AudioContext = mockAudioContext;

