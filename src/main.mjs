import { Processor } from './processor.mjs';
import fs from 'fs';

try {
  const inputPath = 'data/log.txt';
  const logData = fs.readFileSync(inputPath, 'utf8');
  const processor = new Processor(logData);
  processor.process();
  fs.writeFileSync(
    'output/output.txt',
    JSON.stringify(processor.tiradas, null, 2),
    'utf8'
  );
  printResults(processor.tiradas);
} catch (error) {
  if (error.message.includes('data/log.txt')) {
    console.error('Error: input.txt file is missing at input folder');
  } else {
    console.error(error);
  }
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
