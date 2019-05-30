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
  newCourseName: string;
  newCourseDescription: string;

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
    this.db.getCourse(this.id).subscribe(course => {
      this.course = course;
      this.newCourseName = this.course.name;
      this.newCourseDescription = this.course.description;
    });
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

  sortExams(sort: Sort) {
    const data = this.exams;
    if (!sort.active || sort.direction === '') {
      return;
    }
    this.exams = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'year':
          return compare(a.moed.semester.year, b.moed.semester.year, isAsc);
        case 'semester':
          return compare(a.moed.semester.num, b.moed.semester.num, isAsc);
        case 'moed':
          return compare(a.moed.num, b.moed.num, isAsc);
        // TODO: case 'grade': return compare(a.grade, b.grade, isAsc);
        default:
          return 0;
      }
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
    return this.favorite$.pipe(take(1)).toPromise().then(fav => this.auth.updateFavoriteCourse(this.id, !fav));
  }

  editCourseDetails(): void {
    this.spinner.show();
    const p1 =  this.db.updateCourseName(this.course.id, this.newCourseName);
    const p2 = this.db.updateCourseDescription(this.course.id, this.newCourseDescription);
    const promises = [];
    if (this.newCourseName) {
      promises.push(p1);
    }
    if (this.newCourseDescription) {
      promises.push(p2);
    }
    Promise.all(promises).then(() => this.spinner.hide())
      .then(() => this.snackBar.open(`Course Details Changed Successfully!`, 'close', {duration: 3000}));
    return;
  }

  removeTag(event: MouseEvent, tag: string) {
    event.preventDefault();
    event.stopPropagation();

    this.spinner.show();
    this.db.removeTagFromCourse(this.course.id, tag).then(() => this.spinner.hide())
      .then(() => this.snackBar.open(`Tag Deleted Successfully!`, 'close', {duration: 3000}));
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? -1 : 1);
}
