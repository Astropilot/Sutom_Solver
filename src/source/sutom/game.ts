import { environment } from "./environment";
import { addSolveButtonToGame, constructRowInfo, getGameDomGridRows, getGameWordSize, isGameFinished, isGamePending, sendWordToVirtualKeyboard } from "./game_dom";
import { constructFiltersQuery, filterDictionary, LetterFilters, LetterInfo } from "./solver/solver";
import { StrategyManager } from "./solver/strategy_manager";

function randomElementFromSet(set: Set<any>): any {
  const items = Array.from(set);

  return items[Math.floor(Math.random() * items.length)];
}

async function startGame(dictionary: string[]) {
  const lettersFilters = new Map<string, LetterFilters>();
  let currentLineIndex = 0;
  let previousGuess = '';
  const wordSize = getGameWordSize(getGameDomGridRows());
  const strategyManager = new StrategyManager();

  while (!isGameFinished()) {
    const domGridRows = getGameDomGridRows();
    let rowInfo: LetterInfo[];

    if (currentLineIndex === 0) {
      // On first round we only have the first letter
      rowInfo = [{
        letter: domGridRows[currentLineIndex]!.querySelector('td')!.textContent!,
        type: 'correct',
        index: 0,
      }];
    } else {
      rowInfo = constructRowInfo(domGridRows[currentLineIndex - 1]!);
    }

    constructFiltersQuery(rowInfo, lettersFilters);

    if (environment.debugOutput) {
      console.log('Letters filters', lettersFilters);
    }

    dictionary = filterDictionary(dictionary, lettersFilters, wordSize);

    const possibleWords = strategyManager.executeAllStrategies(dictionary, currentLineIndex+1, previousGuess);

    if (environment.debugOutput) {
      console.log('Potential words list', possibleWords);
    }

    const wordGuess = randomElementFromSet(possibleWords);

    if (environment.debugOutput) {
      console.log('Final word to write', wordGuess);
    }

    previousGuess = wordGuess;
    sendWordToVirtualKeyboard(wordGuess);

    await new Promise(resolve => setTimeout(resolve, 3000));

    currentLineIndex++;

    if (environment.debugOutput) {
      console.log('-----------------------------------------');
    }
  }
}

(async () => {
  await new Promise(resolve => setTimeout(resolve, 2000));

  if (isGameFinished() || isGamePending()) {
    return;
  }

  const dictionary: string[] = await (await fetch(chrome.runtime.getURL('sutom/dictionary_fr.json'))).json();

  addSolveButtonToGame(async function handler() {
    this.removeEventListener('click', handler);
    this.classList.remove('lettre-bien-place');
    this.classList.add('lettre-mal-place');
    await startGame(dictionary);
    this.remove();
    if (environment.debugOutput) {
      console.log('Game finished!');
    }
  });
})();
