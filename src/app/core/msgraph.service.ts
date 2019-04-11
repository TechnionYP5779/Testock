import { Injectable } from '@angular/core';
import {AuthService} from './auth.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MsGraphService {

  constructor(private auth: AuthService, private http: HttpClient) {}

  get profilePictureAsBlob(): Promise<Blob> {
    return this.auth.msToken.then(accessToken => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + accessToken
          }),
          responseType: 'blob' as 'blob'
        };
        return this.http.get('https://graph.microsoft.com/v1.0/me/photos/120x120/$value', httpOptions).toPromise();
      }
    );
  }
}
