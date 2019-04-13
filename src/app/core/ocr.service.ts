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

  private matchInArray(regex, expressions) {

    const len = expressions.length;
    let i = 0;

    for (; i < len; i++) {
      if (expressions[i].match(regex)) {
        return expressions[i];
      }
    }
    return '';
  }

  public async getInfoFromSticker(firstPage: Blob) {
    const p = new Promise((resolve, reject) => {
      const reader = new FileReader();
      let base64data: any;
      reader.readAsDataURL(firstPage);
      reader.onloadend = function () {
        base64data = reader.result;
        resolve(base64data);
      };
    });
    const res = await p;
    const json = {
      'requests': [
        {
          'image': {
            'content': res.toString().substr(23)
          },
          'features': [
            {
              'type': 'TEXT_DETECTION',
              'maxResults': 10000
            }
          ]
        }
      ]
    };
    const retJson = await this.http.post('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBPgqzt5VUAa-Jqc5Qu9DSFcO851rj8p5Q'
      , json).toPromise();
    return this.matchInArray(/^[/\d]{4}[.][/\d]{2}[-][/\d]{6}[-][/\d]$/,
      retJson['responses'][0].textAnnotations.map((val, ind) => val['description']));
  }
}
