const tickCounters = {};

export function ring(...args) {
  const arr = Array.isArray(args[0]) ? args[0] : args;
  return new Proxy(arr, {
    get(target, prop) {
      if (prop === 'tick') {
        const counterName = 'default';
        if (tickCounters[counterName] === undefined) {
          tickCounters[counterName] = 0;
        } else {
          tickCounters[counterName]++;
        }
        return target[tickCounters[counterName] % target.length];
      }
      const index = parseInt(prop, 10);
      if (!isNaN(index)) {
        return target[index % target.length];
      }
      return target[prop];
    }
  });
}

export function tick(name = 'default') {
  if (tickCounters[name] === undefined) {
    tickCounters[name] = 0;
  } else {
    tickCounters[name]++;
  }
  return tickCounters[name];
}

export function look(name = 'default') {
  return tickCounters[name] || 0;
}

export function reset_tick(name = 'default') {
    tickCounters[name] = 0;
}
