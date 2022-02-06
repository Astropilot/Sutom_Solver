import { SolverStrategy } from "./solver_strategy";
import { LessRepeatedLettersStrategy } from "./strategies/lessRepeatedLettersStrategy";
import { WordsDifferFromPreviousGuessStrategy } from "./strategies/wordsDifferFromPreviousGuessStrategy";

export class StrategyManager {
  strategies: SolverStrategy[] = [];

  constructor() {
    // Mind that order can matter!
    this.strategies.push(new LessRepeatedLettersStrategy());
    this.strategies.push(new WordsDifferFromPreviousGuessStrategy());
  }

  executeAllStrategies(dictionary: string[], tryCount: number, previousGuess: string): Set<string> {
    if (this.strategies.length === 0) {
      return new Set(dictionary);
    }

    const possibleWords = new Set<string>();

    for (const strategy of this.strategies) {
      strategy.executeStrategy(dictionary, tryCount, previousGuess).forEach(possibleWords.add, possibleWords);
    }
    return possibleWords;
  }
}
