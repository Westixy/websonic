import { AudioContext } from 'isomorphic-web-audio-api';

let audioContext;

export function getContext() {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}
