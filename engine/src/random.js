
let seed = 0;

function random() {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

export function use_random_seed(s) {
    seed = s;
}

export function reset_random_seed() {
    seed = 0;
}

export function choose(list) {
  return list[Math.floor(random() * list.length)];
}

export function rrand(min, max) {
  return random() * (max - min) + min;
}


export function rrand_i(min, max) {
  return Math.floor(rrand(min, max + 1));
}

export function rand(max = 1) {
    return random() * max;
}

export function rand_i(max = 1) {
    return Math.floor(rand(max + 1));
}

export function dice(sides = 6) {
  return rrand_i(1, sides);
}

export function one_in(n) {
  return rrand_i(1, n) === 1;
}

export function shuffle(list) {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
