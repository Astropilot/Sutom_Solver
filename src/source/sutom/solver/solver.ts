export interface LetterInfo {
  letter: string;
  type: 'absent' | 'present' | 'correct';
  index: number;
}

export interface LetterFilters {
  count: number;
  countType: 'min' | 'exact';
  matchPositions: Set<number>;
  forbiddenPositions: Set<number>;
}

export function constructFiltersQuery(rowInfo: LetterInfo[], lettersFilters: Map<string, LetterFilters>): void {
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

export function filterDictionary(dictionary: string[], lettersFilters: Map<string, LetterFilters>, wordSize: number): string[] {
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
