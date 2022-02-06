import { SolverStrategy } from "../solver_strategy";

export class WordsDifferFromPreviousGuessStrategy extends SolverStrategy {

  // We want the words that have the least number of repeated letters
  override executeStrategy(dictionary: string[], tryCount: number, previousGuess: string): string[] {
    if (tryCount === 1) return dictionary; // Strategy not active on first guess

    const wordsDifferFromPreviousGuessCount = new Map<string, number>();

    for (const word of dictionary) {
      const regexSpecificLetters = new RegExp(`[^${previousGuess}]`, 'g');
      const count = word.replace(regexSpecificLetters, '').length;

      wordsDifferFromPreviousGuessCount.set(word, count);
    }

    const specificCount = Math.max(...wordsDifferFromPreviousGuessCount.values());

    return [...wordsDifferFromPreviousGuessCount.entries()].filter(entry => entry[1] === specificCount).map(entry => entry[0]);
  }
}
