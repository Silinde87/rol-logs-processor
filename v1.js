const fs = require('fs');

const patternSingleTirada = /1d20 \+ \d+ = (\d+) \+ \d+ = \d+/; // 1d20 + x = y + x = z --> y
const patternDoubleTirada = /1d20 = (\d+) = \1/; // 1d20 = x = x --> x
const patternMultipleTiradas = /1d20 (\d+) \d+/g; // 1d20 x x --> x.

const inputPath = './test.txt';

try {
  const logData = fs.readFileSync(inputPath, 'utf8');
  const results = processLog(logData);
  //fs.writeFileSync('output-test.txt', JSON.stringify(results, null, 2), 'utf8');
  printResults(results);
} catch (err) {
  console.error(err);
}

function processLog(log) {
  const tiradas = {};
  const lines = log
    .trim()
    .split('\n')
    .filter((el) => el !== '');
  const isPlayerLine = (text) => text.includes('[');

  const handleMatch = (player, match) => {
    const result = parseInt(match[1], 10);
    if (!tiradas[player]) tiradas[player] = {};
    if (!tiradas[player][result]) tiradas[player][result] = 0;
    tiradas[player][result]++;
  };

  let i = 0;
  while (i < lines.length) {
    if (isPlayerLine(lines[i])) {
      const player = lines[i].split('] ')[1].trim();
      let isMultipleCounted = false;
      i++;
      while (i < lines.length && lines[i].trim()) {
        const matchSingle = lines[i].match(patternSingleTirada);
        const matchDouble = lines[i].match(patternDoubleTirada);
        const matchMultiple = [...lines[i].matchAll(patternMultipleTiradas)];
        if (isPlayerLine(lines[i])) break;

        if (matchSingle && !isMultipleCounted) {
          handleMatch(player, matchSingle);
        } else if (matchDouble) {
          handleMatch(player, matchDouble);
        } else if (matchMultiple.length) {
          isMultipleCounted = true;
          matchMultiple.forEach((match) => {
            handleMatch(player, match);
          });
        }
        i++;
      }
    }
  }
  return tiradas;
}

function printResults(results) {
  for (const player in results) {
    console.log(`${player} ha hecho las siguientes tiradas:`);
    const tiradas = results[player];
    const sortedResults = Object.keys(tiradas).sort((a, b) => a - b);
    sortedResults.forEach((result) => {
      console.log(`${result}: ${tiradas[result]} tiradas`);
    });
    console.log('----------------------------------------');
  }
}
