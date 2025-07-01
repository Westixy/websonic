// engine/tests/loader.js
import { pathToFileURL } from 'url'

const MOCK_MODULE = 'isomorphic-web-audio-api';
const MOCK_PATH = './engine/tests/mocks/isomorphic-web-audio-api.cjs';

export function resolve(specifier, context, defaultResolve) {
  if (specifier === MOCK_MODULE) {
    return {
      url: pathToFileURL(MOCK_PATH).href,
      shortCircuit: true,
    };
  }
  return defaultResolve(specifier, context, defaultResolve);
}
