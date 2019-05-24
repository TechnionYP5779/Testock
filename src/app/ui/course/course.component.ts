import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../../entities/course';
import {DbService} from '../../core/db.service';
import {QuestionId} from '../../entities/question';
import {ExamId} from '../../entities/exam';
import {AuthService} from '../../users/auth.service';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {MatSnackBar, Sort} from '@angular/material';
import {NgxSpinnerService} from 'ngx-spinner';

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

  constructor(private afs: AngularFirestore, private route: ActivatedRoute, private db: DbService, private auth: AuthService,
  private snackBar: MatSnackBar, private spinner: NgxSpinnerService) {
    this.id = +this.route.snapshot.paramMap.get('id');
    this.topics$ = this.db.getTopicsForCourseWithCreators(this.id);
  }

  ngOnInit() {
    this.getCourse();
    this.getQuestions();
    this.getExams();
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

  sortQuestions(sort: Sort) {
    const data = this.questions;
    if (!sort.active || sort.direction === '') {
      return;
    }
    this.questions = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'year': return compare(a.year, b.year, isAsc);
        case 'semester': return compare(a.semester, b.semester, isAsc);
        case 'moed': return compare(a.moed, b.moed, isAsc);
        case 'number': return compare(a.number, b.number, isAsc);
        // TODO: case 'difficulty': return compare(a.difficulty, b.difficulty, isAsc);
        // TODO: case 'is_solved': return compare(a.is_solved, b.is_solved, isAsc);
        default: return 0;
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
        case 'year': return compare(a.year, b.year, isAsc);
        case 'semester': return compare(a.semester, b.semester, isAsc);
        case 'moed': return compare(a.moed, b.moed, isAsc);
        // TODO: case 'grade': return compare(a.grade, b.grade, isAsc);
        default: return 0;
      }
    });
  }

  addNewTag() {
    if(this.course.tags == null){
      this.course.tags = [this.newTag];
    } else {
      if (!this.course.tags.includes(this.newTag)){
        this.course.tags.push(this.newTag);
      } else {
        this.snackBar.open(`Tag Already Exists..`, 'close', {duration: 3000});
        return;
      }
    }
    this.spinner.show();
    this.db.createCourse(this.course).then(() => this.spinner.hide())
      .then(() => {
        this.snackBar.open(`Added Tag Successfully!`, 'close', {duration: 3000});
      });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? -1 : 1);
}
