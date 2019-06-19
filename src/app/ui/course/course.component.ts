import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Course} from '../../entities/course';
import {DbService} from '../../core/db.service';
import {ExamId} from '../../entities/exam';
import {AuthService} from '../../users/auth.service';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import {NgxSpinnerService} from 'ngx-spinner';
import {map, switchMap, take} from 'rxjs/operators';
import {TopicWithCreatorId} from '../../entities/topic';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {

  id$: Observable<number>;
  course$: Observable<Course>;
  exams$: Observable<ExamId[]>;
  topics$: Observable<TopicWithCreatorId[]>;
  isAdmin$: Observable<boolean>;
  isFavorite$: Observable<boolean>;

  newTag: any;
  newCourseName: string;
  newCourseDescription: string;

  constructor(private afs: AngularFirestore, private route: ActivatedRoute, private db: DbService, private auth: AuthService,
              private snackBar: MatSnackBar, private spinner: NgxSpinnerService, private router: Router) {
    this.id$ = this.route.params.pipe(map(params => +params.id));
    this.course$ = this.id$.pipe(switchMap(id => this.db.getCourse(id)));
    this.exams$ = this.id$.pipe(switchMap(id => this.db.getExamsOfCourse(id)));
    this.topics$ = this.id$.pipe(switchMap(id => this.db.getTopicsForCourseWithCreators(id)));
    this.isFavorite$ = this.id$.pipe(switchMap(id => auth.user$.pipe(
      map(user => user.favoriteCourses.includes(id))
    )));
    this.isAdmin$ = this.id$.pipe(switchMap(id => this.auth.isAdminForCourse(id)));
  }

  ngOnInit() {}

  addNewTag(courseId: number) {
    this.newTag = this.newTag.toUpperCase();
    this.newTag = this.newTag.replace(/\s/g, '');
    this.spinner.show();
    this.db.addTagToCourse(courseId, this.newTag).then(() => this.spinner.hide())
      .then(() => {
        this.snackBar.open(`Added Tag Successfully!`, 'close', {duration: 3000});
      });
  }

  toggleFavoriteCourse(id: number) {
    return this.isFavorite$.pipe(take(1)).toPromise().then(fav => this.auth.updateFavoriteCourse(id, !fav));
  }

  async editCourseDetails(courseId: number): Promise<void> {
    await this.spinner.show();
    const p1 =  this.db.updateCourseName(courseId, this.newCourseName);
    const p2 = this.db.updateCourseDescription(courseId, this.newCourseDescription);
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

  async removeTag(courseId: number, event: MouseEvent, tag: string) {
    event.preventDefault();
    event.stopPropagation();

    await this.spinner.show();
    await this.db.removeTagFromCourse(courseId, tag);
    await this.spinner.hide();
    this.snackBar.open(`Tag Deleted Successfully!`, 'close', {duration: 3000});
  }
}
