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

function letterCountInString(string_: string, letter: string): number {
  const reg = new RegExp(letter, 'g');

  return (string_.match(reg) ?? []).length;
}

function letterCountInRow(rowInfo: LetterInfo[], letter: string): number {
  let count = 0;

  for (const letterInfo of rowInfo) {
    if (letterInfo.letter === letter && letterInfo.type !== 'absent') {
      count++;
    }
  }

  return count;
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
    const letterCount = letterCountInRow(rowInfo, letterInfo.letter);

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

function filterDictionary(dictionary: string[], lettersFilters: Map<string, LetterFilter>, wordSize: number): string {
  let potentialWords: string[] = [];

  potentialWords = dictionary.filter(word => {
    if (word.length !== wordSize) {
      return false;
    }

    for (const [letter, info] of lettersFilters) {
      const occurenceCount = letterCountInString(word, letter);

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

  if (isDebug) {
    console.log('Potential words list', potentialWords);
  }

  // We count the number of vowels for each potential words
  const wordsWithVowelCount = new Map<string, number>();
  for (const word of potentialWords) {
    const count = word.replace(/[^EAIS]/g, '').length;

    wordsWithVowelCount.set(word, count);
  }

  const maxVowelCount = Math.max(...wordsWithVowelCount.values());

  potentialWords = [...wordsWithVowelCount.entries()].filter(entry => entry[1] === maxVowelCount).map(entry => entry[0]);

  // We return a word with the highest count of vowels
  const finalWord = potentialWords[Math.floor(Math.random() * potentialWords.length)]!;

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

  gameNotFinished = document.querySelector<HTMLElement>('#victoire-panel')?.style.display === '';
  gameNotFinished = gameNotFinished && document.querySelector<HTMLElement>('#defaite-panel')?.style.display === '';

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

    const finalWord = filterDictionary(dictionary, lettersFilters, wordSize);

    if (isDebug) {
      console.log('Final word to write', finalWord);
    }

    sendWordToVirtualKeyboard(finalWord);

    await new Promise(resolve => setTimeout(resolve, 3000));

    gameNotFinished = document.querySelector<HTMLElement>('#victoire-panel')?.style.display === '';
    gameNotFinished = gameNotFinished && document.querySelector<HTMLElement>('#defaite-panel')?.style.display === '';
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

  isGameFinished = document.querySelector<HTMLElement>('#victoire-panel')?.style.display !== '';
  isGameFinished = isGameFinished || document.querySelector<HTMLElement>('#defaite-panel')?.style.display !== '';
  isGamePending = document.querySelector('td.resultat') !== null;

  if (isGameFinished || isGamePending) {
    return;
  }

  const dictionary: string[] = await (await fetch(chrome.runtime.getURL('sutom/dictionary_fr.json'))).json();

  const divContenu = document.querySelector('#contenu');
  const divReglesPanel = document.querySelector('#regles-panel');
  const divResolve = document.createElement('div');
  const buttonResolve = document.createElement('div');

  divResolve.append(buttonResolve);
  divContenu?.insertBefore(divResolve, divReglesPanel);

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
