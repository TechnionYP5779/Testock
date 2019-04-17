import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OCRService {

  public http: HttpClient;
  private BLANK_THRESHOLD = 0.88;

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

  public blobToBase64(blob: Blob){
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      let base64data: any;
      reader.readAsDataURL(blob);
      reader.onloadend = function () {
        base64data = reader.result;
        resolve(base64data);
      };
    });
  }

  public async httpResult(image, reqType){
    const json = {
      'requests': [
        {
          'image': {
            'content': image.toString().substr(23)
          },
          'features': [
            {
              'type': reqType,
              'maxResults': 10000
            }
          ]
        }
      ]
    };
    const retJson = await this.http.post('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBPgqzt5VUAa-Jqc5Qu9DSFcO851rj8p5Q'
      , json).toPromise();
    return retJson;
  }

  public async getInfoFromSticker(firstPage: Blob) {
    const firstPageBase64 = await this.blobToBase64(firstPage);

    const retJson = await this.httpResult(firstPageBase64, 'TEXT_DETECTION');
    const retInStrs = retJson['responses'][0].textAnnotations.map((val, ind) => val['description']);
    let possibleRegex: RegExp[];
    possibleRegex = [/^[/\d]{4}[.][/\d]{2}[-][/\d]{6}[-][/\d]$/,
      /^[/\d]{7}[.][/\d]{2}[-][/\d]{6}[-][/\d]$/,
      /^[/\d]{4}[.][/\d]{2}[-][/\d]{6}[-][/\d]{3}[.][/\d]{2}[.][/\d]{2}$/];

    const matchReg1 = this.matchInArray(possibleRegex[0], retInStrs);
    const matchReg2 = this.matchInArray(possibleRegex[1], retInStrs);
    const matchReg3 = this.matchInArray(possibleRegex[2], retInStrs);

    let infoStr = '';
    if (matchReg1 !== '') {
      infoStr = matchReg1.toString();
    } else if (matchReg2 !== '') {
      infoStr = matchReg2.toString().substring(3);
    } else if (matchReg3 !== ''){
      infoStr = matchReg3.toString().substring(0, 16);
    }
    return infoStr;
  }

  public async isImageBlank(image: Blob) {
    const imageBase64 = await this.blobToBase64(image);
    const retJson = await this.httpResult(imageBase64, 'IMAGE_PROPERTIES');
    const retJsonLabel = await this.httpResult(imageBase64, 'LABEL_DETECTION');
    const dominantColorFraction = retJson['responses'][0].imagePropertiesAnnotation.dominantColors.colors[0]['score'];
    const textlLabel = retJsonLabel['responses'][0].labelAnnotations.filter(label => label['description'] === 'Text');
    if (dominantColorFraction > this.BLANK_THRESHOLD && (textlLabel.length < 1 || textlLabel[0]['score'] < this.BLANK_THRESHOLD)) {
      return true;
    }
    return false;
  }
}
