import { Injectable } from '@angular/core';
import {AuthService} from './auth.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MsGraphService {

  constructor(private http: HttpClient) {}

  selfProfilePicture(accessToken: string): Observable<Blob> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + accessToken
      }),
      responseType: 'blob' as 'blob'
    };
    return this.http.get('https://graph.microsoft.com/v1.0/me/photos/64x64/$value', httpOptions);
  }

  getFaculty(accessToken: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + accessToken
      })
    };
    return this.http.get('https://graph.microsoft.com/v1.0/me?$select=department', httpOptions);
  }
}
