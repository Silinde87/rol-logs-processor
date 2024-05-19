export class Processor {
  tiradas = {};
  lines = [];

  patternSingleTirada = /1d20 \+ \d+ = (\d+) \+ \d+ = \d+/; // 1d20 + x = y + x = z --> y
  patternDoubleTirada = /1d20 = (\d+) = \1/; // 1d20 = x = x --> x
  patternMultipleTiradas = /1d20 (\d+) \d+/g; // 1d20 x x --> x.
  patternDate = /\[\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2} (AM|PM)\]/;

  constructor(log) {
    this.lines = log
      .trim()
      .split('\n')
      .filter((el) => el !== '');
  }

  process() {
    let i = 0;
    while (i < this.lines.length) {
      if (this.isPlayerLine(this.lines[i])) {
        const player = this.lines[i].split('] ')[1].trim();
        let isMultipleCounted = false;
        i++;
        while (i < this.lines.length && this.lines[i].trim()) {
          if (this.isPlayerLine(this.lines[i])) break;

          const matchSingle = this.lines[i].match(this.patternSingleTirada);
          const matchDouble = this.lines[i].match(this.patternDoubleTirada);
          const matchMultiple = [
            ...this.lines[i].matchAll(this.patternMultipleTiradas),
          ];

          if (matchSingle && !isMultipleCounted) {
            this.handleMatch(player, matchSingle);
          } else if (matchDouble) {
            this.handleMatch(player, matchDouble);
          } else if (matchMultiple.length) {
            isMultipleCounted = true;
            matchMultiple.forEach((match) => {
              this.handleMatch(player, match);
            });
          }
          i++;
        }
      }
    }
  }

  isPlayerLine = (text) => text.match(this.patternDate);

  handleMatch = (player, match) => {
    const result = parseInt(match[1], 10);
    if (!this.tiradas[player]) this.tiradas[player] = {};
    if (!this.tiradas[player][result]) this.tiradas[player][result] = 0;
    this.tiradas[player][result]++;
  };
}
