const tickCounters = {};

export function ring(...args) {
  const arr = Array.isArray(args[0]) ? args[0] : args;
  
  const ringObject = {
    _arr: arr,
    get tick() {
      const counterName = 'default';
      if (tickCounters[counterName] === undefined) {
        tickCounters[counterName] = 0;
      }
      const val = this._arr[tickCounters[counterName] % this._arr.length];
      tickCounters[counterName]++;
      return val;
    },
    get look() {
      const counterName = 'default';
      if (tickCounters[counterName] === undefined) {
        tickCounters[counterName] = 0;
      }
      return this._arr[tickCounters[counterName] % this._arr.length];
    },
    get: function(index) {
        const i = index % this._arr.length;
        return i < 0 ? this._arr[this._arr.length + i] : this._arr[i];
    },
    chain: function(...args) {
        const newArr = this._arr.concat(...args);
        return ring(...newArr);
    }
  };

  return ringObject;
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

export function reset_tick_all() {
    for (const key in tickCounters) {
        tickCounters[key] = 0;
    }
}

export function line(start, end, options = {}) {
  const steps = options.steps || 1;
  const arr = [];
  for (let i = 0; i < steps; i++) {
    arr.push(start + (end - start) * (i / (steps - 1)));
  }
  return ring(...arr);
}

export function range(start, end, step = 1) {
  const arr = [];
  for (let i = start; i < end; i += step) {
    arr.push(i);
  }
  return ring(...arr);
}

export function knit(...args) {
  const arr = [];
  for (let i = 0; i < args.length; i += 2) {
    for (let j = 0; j < args[i + 1]; j++) {
      arr.push(args[i]);
    }
  }
  return ring(...arr);
}
