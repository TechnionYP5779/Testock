import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../auth.service';
import {map, take, tap} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class UsersOnlyGuard implements CanActivate {

  constructor(private auth: AuthService, private snackBar: MatSnackBar) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.auth.user$.pipe(
      take(1),
      map(user => user && user.roles.user),
      tap(canView => {
        if (!canView) {
          const ref = this.snackBar.open('Please Sign in to view this page', 'Sign In', {duration: 5000});

          ref.onAction().subscribe(async () => {
            await this.auth.login();
          });
          console.error('Access denied.');
        }
      })
    );
  }
}
