import { Processor } from './processor.mjs';
import fs from 'fs';

try {
  const inputPath = 'data/input.txt';
  const logData = fs.readFileSync(inputPath, 'utf8');
  const processor = new Processor(logData);
  processor.process();
  fs.writeFileSync(
    'output/output.txt',
    JSON.stringify(processor.tiradas, null, 2),
    'utf8'
  );
  printResults(processor.tiradas);
} catch (err) {
  console.error(err);
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
