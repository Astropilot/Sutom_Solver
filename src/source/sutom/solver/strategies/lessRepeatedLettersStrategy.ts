import { SolverStrategy } from "../solver_strategy";

export class LessRepeatedLettersStrategy extends SolverStrategy {

  // We want the words that have the least number of repeated letters
  override executeStrategy(dictionary: string[], tryCount: number, _previousGuess: string): string[] {
    if (tryCount !== 1) return dictionary; // Strategy only on first guess

    const wordsWithRepeatedLettersCount = new Map<string, number>();

    for (const word of dictionary) {
      const lettersInWord: string[] = [];
      let counter = 0;

      for (let letter of word) {
        if (lettersInWord.includes(letter)) {
          counter++;
        } else {
          lettersInWord.push(letter);
        }
      }

      wordsWithRepeatedLettersCount.set(word, counter);
    }

    const specificCount = Math.min(...wordsWithRepeatedLettersCount.values());

    console.log(`specificCount: ${specificCount}`);

    return [...wordsWithRepeatedLettersCount.entries()].filter(entry => entry[1] === specificCount).map(entry => entry[0]);
  }
}
