import { environment } from "./environment";
import { LetterInfo } from "./solver/solver";

export function isGameFinished(): boolean {
  return document.querySelector<HTMLElement>('.fin-de-partie-panel') !== null;
}

export function isGamePending(): boolean {
  return document.querySelector('td.resultat') !== null;
}

export function getGameDomGridRows() {
  return document.querySelectorAll('#grille > table > tr');
}

export function getGameWordSize(domGridRows: NodeListOf<Element>): number {
  return domGridRows[0]!.querySelectorAll('td').length;
}

export function sendWordToVirtualKeyboard(word: string): void {
  for (const letter of word) {
    document.querySelector<HTMLElement>(`.input-lettre[data-lettre="${letter}"]`)?.click();
  }

  document.querySelector<HTMLElement>('.input-lettre[data-lettre="_entree"]')?.click();
}

export function constructRowInfo(rowElement: Element): LetterInfo[] {
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
      if (environment.debugOutput) {
        console.error(`Letter "${letter}" on cell index ${j} do not have any type!`, rowElement);
      }

      cellType = 'absent';
    }

    rowInfo.push({letter, type: cellType, index: j});
  }

  return rowInfo;
}

export function addSolveButtonToGame(onButtonClick: (this: HTMLDivElement, ev: MouseEvent) => any): void {
  const divInputArea = document.querySelector('#input-area');
  const divResolve = document.createElement('div');
  const buttonSolve = document.createElement('div');

  divResolve.append(buttonSolve);
  divInputArea?.parentNode?.insertBefore(divResolve, divInputArea.nextSibling);

  buttonSolve.classList.add('input-lettre', 'lettre-bien-place');
  buttonSolve.append(document.createTextNode('Résoudre !'));

  buttonSolve.addEventListener('click', onButtonClick);
}
