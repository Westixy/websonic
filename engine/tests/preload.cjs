const sinon = require('sinon');
const pkg = require('isomorphic-web-audio-api');

sinon.stub(pkg, 'AudioContext').callsFake(function() {
  return {
    createGain: () => ({
      connect: () => {},
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
      frequency: {
        setValueAtTime: () => {}
      },
      Q: {
        value: 0
      }
    }),
    createBufferSource: () => ({
        connect: () => {},
        start: () => {},
        stop: () => {},
    }),
    createBuffer: () => ({
        getChannelData: () => []
    }),
    destination: {},
    currentTime: 0,
    resume: () => {},
    decodeAudioData: () => Promise.resolve({}),
  };
});
