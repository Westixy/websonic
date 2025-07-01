// Coded by Adrian Cheater

// (in a single tweet)
// https://twitter.com/wpgFactoid/status/666692596605976576

[1, 3, 6, 4].forEach(async (d) => {
  for (let i = -3; i <= 3; i++) {
    play(chord_degree(d, 'c', 'major', 3, { invert: i }));
    await sleep(0.25);
  }
});
