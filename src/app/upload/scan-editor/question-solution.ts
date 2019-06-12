import {SolutionImage} from './solution-image';
import {ScanPage} from './scan-page';

export enum QuestionType {
  REGULAR,
  FETCHED,
  EXTRACTED
}

export class QuestionSolution {
  public number: number;
  public images: SolutionImage[];
  public grade: number;
  public points: number;
  public questionType: QuestionType;

  constructor(number: number, grade: number, points: number, questionType = QuestionType.REGULAR) {
    this.images = [];
    this.grade = grade;
    this.number = number;
    this.points = points;
    this.questionType = questionType;
  }

  addImage(image: SolutionImage) {
    this.images.push(image);
  }

  removeImage(image: SolutionImage) {
    this.images = this.images.filter(sol => sol !== image);
  }

  highlightRelatedPages() {
    this.images.map(solImg => solImg.source).map(page => page.highlightInc());
  }

  unhighlightRelatedPages() {
    this.images.map(solImg => solImg.source).map(page => page.highlightDec());

  }

  getTotalBytes(): number {
    return this.images.reduce((sum, i) => sum + i.size, 0);
  }

  hasFullPage(scanPage: ScanPage) {
    return this.images.find(sol => sol.fullPage && sol.source === scanPage) != null;
  }

  removeFullPage(scanPage: ScanPage) {
    this.images = this.images.filter(sol => !sol.fullPage || sol.source !== scanPage);
  }
}
