
export function choose(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export function rrand(min, max) {
  return Math.random() * (max - min) + min;
}
