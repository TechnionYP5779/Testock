import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OCRService {

  public http: HttpClient;
  private DOMINANT_FRACTION_THRESHOLD = 0.88;
  private TEXT_SCORE_THRESHOLD = 0.95;

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

  public getInfoFromSticker(firstPage: Blob): Promise<any> {
    return this.http.post<string>('https://us-central1-yp5779-testock.cloudfunctions.net/getStickerInfoFromTitlePage', firstPage)
      .toPromise();
  }

  public async isImageBlank(image: Blob) {
    const imageBase64 = await this.blobToBase64(image);
    const retJson = await this.httpResult(imageBase64, 'IMAGE_PROPERTIES');
    const retJsonLabel = await this.httpResult(imageBase64, 'LABEL_DETECTION');
    const dominantColorFraction = retJson['responses'][0].imagePropertiesAnnotation.dominantColors.colors[0]['score'];
    const textlLabel = retJsonLabel['responses'][0].labelAnnotations.filter(label => label['description'] === 'Text');
    if (dominantColorFraction > this.DOMINANT_FRACTION_THRESHOLD && (textlLabel.length < 1
      || textlLabel[0]['score'] < this.TEXT_SCORE_THRESHOLD)) {
      return true;
    }
    return false;
  }
}
