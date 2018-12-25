import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl'
})
export class SafeUrlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(img: any, args?: any): any {
    const url = URL.createObjectURL(img);
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

}
