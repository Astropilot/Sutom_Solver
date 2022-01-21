const IS_DEBUG = false;

interface LetterInfo {
  letter: string;
  type: 'absent' | 'present' | 'correct';
  index: number;
}

interface LetterFilter {
  count: number;
  countType: 'min' | 'exact';
  matchPositions: number[];
  forbiddenPositions: number[];
}

function letterCountInString(str: string, letter: string): number {
  const reg = new RegExp(letter, 'g');

  return (str.match(reg) || []).length;
}

function letterCountInRow(rowInfo: LetterInfo[], letter: string): number {
  let count = 0;

  for (const letter_info of rowInfo) {
    if (letter_info.letter === letter && letter_info.type !== 'absent') {
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
    const letter = cellElement.textContent || '';
    let cellType: 'absent' | 'present' | 'correct';

    if (cellElement.classList.contains('non-trouve')) {
      cellType = 'absent';
    } else if (cellElement.classList.contains('mal-place')) {
      cellType = 'present';
    } else if (cellElement.classList.contains('bien-place')) {
      cellType = 'correct';
    } else {
      if (IS_DEBUG) console.error(`Letter "${letter}" on cell index ${j} do not have any type!`, rowElement);
      cellType = 'absent';
    }

    rowInfo.push({ letter: letter, type: cellType, index: j });
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
        matchPositions: [],
        forbiddenPositions: []
      });
    }

    if (letterInfo.type === 'absent') {
      lettersFilters.get(letterInfo.letter)!.countType = 'exact';
    } else if (letterInfo.type === 'present') {
      lettersFilters.get(letterInfo.letter)!.forbiddenPositions.push(letterInfo.index);
    } else if (letterInfo.type === 'correct') {
      lettersFilters.get(letterInfo.letter)!.matchPositions.push(letterInfo.index);
    }
  }
}

function filterDictionary(dictionnary: string[], lettersFilters: Map<string, LetterFilter>, wordSize: number): string {
  let potentialWords: string[] = [];

  potentialWords = dictionnary.filter(word => {
    if (word.length !== wordSize) return false;

    for (const [letter, info] of lettersFilters) {
      var occurence_count = letterCountInString(word, letter);

      if (info.countType === 'min' && occurence_count < info.count) return false;
      else if (info.countType === 'exact' && occurence_count !== info.count) return false;

      for (const letterPosition of info.forbiddenPositions) {
        if (word[letterPosition] === letter) return false;
      }

      for (const letterPosition of info.matchPositions) {
        if (word[letterPosition] !== letter) return false;
      }
    }
    return true;
  });

  if (IS_DEBUG) console.log('Potential words list', potentialWords);

  // We count the number of vowels for each potential words
  const wordsWithVowelCount = new Map<string, number>();
  for (const word of potentialWords) {
    const count = word.replaceAll('[^AEIOU]', '').length;

    wordsWithVowelCount.set(word, count);
  }

  const maxVowelCount = Math.max(...wordsWithVowelCount.values());

  potentialWords = [...wordsWithVowelCount.entries()].filter(entry => entry[1] === maxVowelCount).map(entry => entry[0]);

  // We return a word with the highest count of vowels
  const finalWord = potentialWords[Math.floor(Math.random()*potentialWords.length)]!;

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
  let gameNotFinished: boolean = false;
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
        index: 0
      }];

      constructFiltersQuery(rowInfo, lettersFilters);
    }

    if (IS_DEBUG) console.log('Letters filters', lettersFilters);

    const finalWord = filterDictionary(dictionary, lettersFilters, wordSize);

    if (IS_DEBUG) console.log('Final word to write', finalWord);

    sendWordToVirtualKeyboard(finalWord);

    await new Promise(resolve => setTimeout(resolve, 3000));

    gameNotFinished = document.querySelector<HTMLElement>('#victoire-panel')?.style.display === '';
    gameNotFinished = gameNotFinished && document.querySelector<HTMLElement>('#defaite-panel')?.style.display === '';
    currentLineIndex++;

    if (IS_DEBUG) console.log('-----------------------------------------');
  }
}

(async () => {

  await new Promise(resolve => setTimeout(resolve, 2000));

  let isGameFinished: boolean = false;
  let isGamePending: boolean = false;

  isGameFinished = document.querySelector<HTMLElement>('#victoire-panel')?.style.display !== '';
  isGameFinished = isGameFinished || document.querySelector<HTMLElement>('#defaite-panel')?.style.display !== '';
  isGamePending = document.querySelector('td.resultat') !== null;

  if (isGameFinished || isGamePending) return;

  const dictionary = await (await fetch(chrome.runtime.getURL('sutom/dictionary_fr.json'))).json();

  const divContenu = document.querySelector('#contenu');
  const divReglesPanel = document.querySelector('#regles-panel');
  const divResolve = document.createElement('div');
  const buttonResolve = document.createElement('div');

  divResolve.appendChild(buttonResolve);
  divContenu?.insertBefore(divResolve, divReglesPanel);

  buttonResolve.classList.add('input-lettre', 'lettre-bien-place');
  buttonResolve.appendChild(document.createTextNode('Résoudre !'));

  buttonResolve.addEventListener('click', async function handler() {
    this.removeEventListener('click', handler);
    buttonResolve.classList.remove('lettre-bien-place');
    buttonResolve.classList.add('lettre-mal-place');
    await startGame(dictionary);
    divResolve.remove();
    if (IS_DEBUG) console.log('Game finished!');
  });
})();
