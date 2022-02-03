const isDebug = false;

interface LetterInfo {
  letter: string;
  type: 'absent' | 'present' | 'correct';
  index: number;
}

interface LetterFilter {
  count: number;
  countType: 'min' | 'exact';
  matchPositions: Set<number>;
  forbiddenPositions: Set<number>;
}


function constructRowInfo(rowElement: Element): LetterInfo[] {
  const letterCellElements = rowElement.querySelectorAll('td');
  const rowInfo: LetterInfo[] = [];

  // We construct our row with easy to access information for each letter
  for (let j = 0; j < letterCellElements.length; j++) {
    const cellElement = letterCellElements.item(j);
    const letter = cellElement.textContent ?? '';
    let cellType: 'absent' | 'present' | 'correct';

    if (cellElement.classList.contains('non-trouve')) {
      cellType = 'absent';
    } else if (cellElement.classList.contains('mal-place')) {
      cellType = 'present';
    } else if (cellElement.classList.contains('bien-place')) {
      cellType = 'correct';
    } else {
      if (isDebug) {
        console.error(`Letter "${letter}" on cell index ${j} do not have any type!`, rowElement);
      }

      cellType = 'absent';
    }

    rowInfo.push({letter, type: cellType, index: j});
  }

  return rowInfo;
}

function constructFiltersQuery(rowInfo: LetterInfo[], lettersFilters: Map<string, LetterFilter>): void {
  for (const letterInfo of rowInfo) {
    const letterCount = rowInfo.filter(row => letterInfo.letter === row.letter && row.type !== 'absent').length;

    if (lettersFilters.has(letterInfo.letter)) {
      lettersFilters.get(letterInfo.letter)!.count = letterCount;
    } else {
      lettersFilters.set(letterInfo.letter, {
        count: letterCount,
        countType: 'min',
        matchPositions: new Set(),
        forbiddenPositions: new Set(),
      });
    }

    switch (letterInfo.type) {
      case 'absent': {
        lettersFilters.get(letterInfo.letter)!.countType = 'exact';
        break;
      }
      case 'present': {
        lettersFilters.get(letterInfo.letter)!.forbiddenPositions.add(letterInfo.index);
        break;
      }
      case 'correct': {
        lettersFilters.get(letterInfo.letter)!.matchPositions.add(letterInfo.index);
        break;
      }
    }
  }
}

function filterDictionary(dictionary: string[], lettersFilters: Map<string, LetterFilter>, wordSize: number): string[] {
  return dictionary.filter(word => {
    if (word.length !== wordSize) {
      return false;
    }

    for (const [letter, info] of lettersFilters) {
      const occurenceCount = [...word].filter(l => l === letter).length;

      if (info.countType === 'min' && occurenceCount < info.count) {
        return false;
      }

      if (info.countType === 'exact' && occurenceCount !== info.count) {
        return false;
      }

      for (const letterPosition of info.forbiddenPositions) {
        if (word[letterPosition] === letter) {
          return false;
        }
      }

      for (const letterPosition of info.matchPositions) {
        if (word[letterPosition] !== letter) {
          return false;
        }
      }
    }

    return true;
  });
}

function guessWord(dictionary: string[], tryCount: number, previousGuess: string) {
  const wordsWithSpecificLettersCount = new Map<string, number>();
  let specificCount: number;

  if (tryCount === 1) { // Strategy on first try
    // We want the words that have the least number of repeated letters
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

      wordsWithSpecificLettersCount.set(word, counter);
    }

    specificCount = Math.min(...wordsWithSpecificLettersCount.values());
  } else { // Strategy on all other tries
    // We want the words that differ as much as possible from the previous
    // guessed word for all letters
    for (const word of dictionary) {
      const regexSpecificLetters = new RegExp(`[^${previousGuess}]`, 'g');
      const count = word.replace(regexSpecificLetters, '').length;

      wordsWithSpecificLettersCount.set(word, count);
    }

    specificCount = Math.max(...wordsWithSpecificLettersCount.values());
  }

  dictionary = [...wordsWithSpecificLettersCount.entries()].filter(entry => entry[1] === specificCount).map(entry => entry[0]);

  if (isDebug) {
    console.log('Potential words list after strategies', dictionary);
  }

  // The random factor :/
  const finalWord = dictionary[Math.floor(Math.random() * dictionary.length)]!;

  return finalWord;
}

function sendWordToVirtualKeyboard(word: string): void {
  for (const letter of word) {
    document.querySelector<HTMLElement>(`.input-lettre[data-lettre="${letter}"]`)?.click();
  }

  document.querySelector<HTMLElement>('.input-lettre[data-lettre="_entree"]')?.click();
}

async function startGame(dictionary: string[]) {
  const lettersFilters = new Map<string, LetterFilter>();
  let gameNotFinished = false;
  let currentLineIndex = 0;
  let previousGuess = '';

  gameNotFinished = document.querySelector<HTMLElement>('.fin-de-partie-panel') === null;

  while (gameNotFinished) {
    const gridRows = document.querySelectorAll('#grille > table > tr');
    const wordSize = gridRows[0]!.querySelectorAll('td').length;

    if (currentLineIndex > 0) {
      const rowInfo = constructRowInfo(gridRows[currentLineIndex - 1]!);

      constructFiltersQuery(rowInfo, lettersFilters);
    } else {
      // On first round we only have the first letter
      const rowInfo: LetterInfo[] = [{
        letter: gridRows[currentLineIndex]!.querySelector('td')!.textContent!,
        type: 'correct',
        index: 0,
      }];

      constructFiltersQuery(rowInfo, lettersFilters);
    }

    if (isDebug) {
      console.log('Letters filters', lettersFilters);
    }

    dictionary = filterDictionary(dictionary, lettersFilters, wordSize);

    if (isDebug) {
      console.log('Potential words list', dictionary);
    }

    const wordGuess = guessWord(dictionary, currentLineIndex+1, previousGuess);

    if (isDebug) {
      console.log('Final word to write', wordGuess);
    }

    previousGuess = wordGuess;
    sendWordToVirtualKeyboard(wordGuess);

    await new Promise(resolve => setTimeout(resolve, 3000));

    gameNotFinished = document.querySelector<HTMLElement>('.fin-de-partie-panel') === null;
    currentLineIndex++;

    if (isDebug) {
      console.log('-----------------------------------------');
    }
  }
}

(async () => {
  await new Promise(resolve => setTimeout(resolve, 2000));

  let isGameFinished = false;
  let isGamePending = false;

  isGameFinished = document.querySelector<HTMLElement>('.fin-de-partie-panel') !== null;
  isGamePending = document.querySelector('td.resultat') !== null;

  if (isGameFinished || isGamePending) {
    return;
  }

  const dictionary: string[] = await (await fetch(chrome.runtime.getURL('sutom/dictionary_fr.json'))).json();

  //const divContenu = document.querySelector('#contenu');
  const divInputArea = document.querySelector('#input-area');
  const divResolve = document.createElement('div');
  const buttonResolve = document.createElement('div');

  divResolve.append(buttonResolve);
  //divContenu?.insertBefore(divResolve, divInputArea);
  divInputArea?.parentNode?.insertBefore(divResolve, divInputArea.nextSibling);

  buttonResolve.classList.add('input-lettre', 'lettre-bien-place');
  buttonResolve.append(document.createTextNode('Résoudre !'));

  buttonResolve.addEventListener('click', async function handler() {
    this.removeEventListener('click', handler);
    buttonResolve.classList.remove('lettre-bien-place');
    buttonResolve.classList.add('lettre-mal-place');
    await startGame(dictionary);
    divResolve.remove();
    if (isDebug) {
      console.log('Game finished!');
    }
  });
})();
