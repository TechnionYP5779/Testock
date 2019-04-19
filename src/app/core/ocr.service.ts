import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OCRService {

  public http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  public getInfoFromSticker(firstPage: Blob): Promise<any> {
    return this.http.post<string>('https://us-central1-yp5779-testock.cloudfunctions.net/getStickerInfoFromTitlePage', firstPage)
      .toPromise();
  }

  public async isImageBlank(image: Blob): Promise<any> {
    return this.http.post<string>('https://us-central1-yp5779-testock.cloudfunctions.net/isImageBlank',
      image).toPromise();
  }
}
