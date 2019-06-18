import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DbService} from '../../core/db.service';
import {QuestionId} from '../../entities/question';
import {Exam} from '../../entities/exam';
import {AuthService} from '../../users/auth.service';
import {Course} from '../../entities/course';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {NgxSpinnerService} from 'ngx-spinner';
import {saveAs} from 'file-saver';
import {FullMoedPipe} from '../../core/full-moed.pipe';
import {MoedPipe} from '../../core/moed.pipe';
import {SemesterPipe} from '../../core/semester.pipe';
import {YearPipe} from '../../core/year.pipe';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit {

  private courseId: number;
  private examId: string;
  public questions: QuestionId[];
  public exam: Exam;
  course: Course;
  public difficulty: number;
  public tags: string[];

  adminAccess: boolean;
  getPdfUrl = 'https://' + environment.firebase.functionsLocation +
    '-' + environment.firebase.projectId + '.cloudfunctions.net/getPDFofExam';

  constructor(private route: ActivatedRoute, private db: DbService, private auth: AuthService,
              private http: HttpClient, private spinner: NgxSpinnerService,
              private moedPipe: MoedPipe, private semesterPipe: SemesterPipe, private yearPipe: YearPipe) {
    this.courseId = +route.snapshot.paramMap.get('cid');
    this.examId = route.snapshot.paramMap.get('eid');
    this.auth.isAdminForCourse(this.courseId).subscribe(is => this.adminAccess = is);
    this.db.getCourse(this.courseId).subscribe(course => this.course = course);
  }

  ngOnInit() {
    this.getExam();
    this.getQuestions();
  }

  private getQuestions() {
    this.db.getQuestionsOfExam(this.courseId, this.examId).subscribe(ques => {
      this.questions = ques;

      if (this.questions.length > 0 ) {
        let sumAverages = 0;
        let tags: string[] = [];
        for (const question of this.questions) {
          sumAverages += question.sum_difficulty_ratings / question.count_difficulty_ratings;
          tags = tags.concat(question.tags);
        }
        if (sumAverages > 0) {
          this.difficulty = sumAverages / this.questions.length;
        }
        this.tags = Array.from(new Set(tags));
      }
    });
  }

  private getExam() {
    this.db.getExam(this.courseId, this.examId).subscribe(exam => this.exam = exam );
  }

  async downloadSuperScan(courseId: number, exam: Exam) {
    await this.spinner.show();

    const url = this.getPdfUrl + '?course=' + courseId + '&year=' +
      exam.moed.semester.year + '&semester=' + exam.moed.semester.num + '&moed=' + exam.moed.num;

    const blob = await this.http.get(url, {responseType: 'blob'}).toPromise();
    const filename = `Testock-Super-Scan-${courseId}-${this.semesterPipe.transform(exam.moed)}` +
      `-${this.yearPipe.transform(exam.moed)}-${this.moedPipe.transform(exam.moed)}`;
    saveAs(blob, filename);

    await this.spinner.hide();
  }
}
