import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../../entities/course';
import {DbService} from '../../core/db.service';
import {QuestionId} from '../../entities/question';
import {ExamId} from '../../entities/exam';
import {AuthService} from '../../users/auth.service';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {MatSnackBar} from '@angular/material';
import {NgxSpinnerService} from 'ngx-spinner';
import {Sort} from '@angular/material';
import {map, take} from 'rxjs/operators';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {

  public course: Course;
  public id: number;
  public questions: QuestionId[];
  public exams: ExamId[];
  topics$: Observable<any[]>;
  adminAccess: boolean;
  newTag: any;
  favorite$: Observable<boolean>;
  tags: string[];

  constructor(private afs: AngularFirestore, private route: ActivatedRoute, private db: DbService, private auth: AuthService,
              private snackBar: MatSnackBar, private spinner: NgxSpinnerService) {
    this.id = +this.route.snapshot.paramMap.get('id');
    this.topics$ = this.db.getTopicsForCourseWithCreators(this.id);
    this.favorite$ = auth.user$.pipe(
      map(user => user.favoriteCourses.includes(this.course.id))
    );
  }

  ngOnInit() {
    this.getCourse();
    this.getQuestions();
    this.getExams();
    this.getTags();
    this.auth.isAdminForCourse(this.id).subscribe(is => this.adminAccess = is);
  }

  getCourse(): void {
    this.db.getCourse(this.id).subscribe(course => this.course = course);
  }

  getQuestions(): void {
    this.db.getQuestionsOfCourse(this.id).subscribe(questions => this.questions = questions);
  }

  getExams(): void {
    this.db.getExamsOfCourse(this.id).subscribe(exams => this.exams = exams);
  }

  getTags(): void {
    this.db.getTagsOfCourse(this.id).subscribe(tags => this.tags = tags);
  }

  sortQuestions(sort: Sort) {
    const data = this.questions;
    if (!sort.active || sort.direction === '') {
      return;
    }
    this.questions = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'year':
          return compare(a.year, b.year, isAsc);
        case 'semester':
          return compare(a.semester, b.semester, isAsc);
        case 'moed':
          return compare(a.moed, b.moed, isAsc);
        case 'number':
          return compare(a.number, b.number, isAsc);
        // TODO: case 'difficulty': return compare(a.difficulty, b.difficulty, isAsc);
        // TODO: case 'is_solved': return compare(a.is_solved, b.is_solved, isAsc);
        default:
          return 0;
      }
    });
  }

  sortExams(sort: Sort) {
    const data = this.exams;
    if (!sort.active || sort.direction === '') {
      return;
    }
    this.exams = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'year':
          return compare(a.year, b.year, isAsc);
        case 'semester':
          return compare(a.semester, b.semester, isAsc);
        case 'moed':
          return compare(a.moed, b.moed, isAsc);
        // TODO: case 'grade': return compare(a.grade, b.grade, isAsc);
        default:
          return 0;
      }
    });
  }

  sortTags(sort: Sort) {
    const data = this.tags;
    if (!sort.active || sort.direction === '') {
      return;
    }
    this.tags = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      return compare(a, b, isAsc);
    });
  }

  addNewTag() {
    this.newTag = this.newTag.toUpperCase();
    this.newTag = this.newTag.replace(/\s/g, '');
    this.spinner.show();
    this.db.addTagToCourse(this.id, this.newTag).then(() => this.spinner.hide())
      .then(() => {
        this.snackBar.open(`Added Tag Successfully!`, 'close', {duration: 3000});
      });
  }

  updateFavoriteCourse() {
    this.favorite$.pipe(take(1)).toPromise().then(fav => this.auth.updateFavoriteCourse(this.id, !fav));
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? -1 : 1);
}
