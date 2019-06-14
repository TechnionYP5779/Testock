import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ScanDetails} from '../entities/scan-details';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OCRService {

  public http: HttpClient;
  private baseUrl = 'https://' + environment.firebase.functionsLocation + '-' + environment.firebase.projectId + '.cloudfunctions.net/';

  constructor(http: HttpClient) {
    this.http = http;
  }

  public getInfoFromSticker(firstPage: Blob): Promise<ScanDetails> {
    return this.http.post<ScanDetails>(this.baseUrl + 'getStickerInfoFromTitlePage', firstPage)
      .toPromise();
  }

  public async isImageBlank(image: Blob): Promise<boolean> {
    return this.http.post<{isBlank: boolean}>(this.baseUrl + 'isImageBlank',
      image).toPromise().then(res => res.isBlank);
  }
}
