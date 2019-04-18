import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

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
    return this.http.get('https://graph.microsoft.com/v1.0/me/photos/120x120/$value', httpOptions);
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
