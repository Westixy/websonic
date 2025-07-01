const events = {};

export function sync(eventName) {
  return new Promise(resolve => {
    if (!events[eventName]) {
      events[eventName] = [];
    }
    events[eventName].push(resolve);
  });
}

export function event(eventName, value) {
  if (events[eventName]) {
    events[eventName].forEach(resolve => resolve(value));
    events[eventName] = [];
  }
}
