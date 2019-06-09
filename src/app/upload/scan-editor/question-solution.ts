import {SolutionImage} from './solution-image';

export class QuestionSolution {
  public number: number;
  public images: SolutionImage[];
  public grade: number;
  public points: number;
  public fetchedQuestion: boolean;

  constructor(number: number, grade: number, points: number, fetchedQuestion = false) {
    this.images = [];
    this.grade = grade;
    this.number = number;
    this.points = points;
    this.fetchedQuestion = fetchedQuestion;
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
}
