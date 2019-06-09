import {Component, OnInit, TemplateRef} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  team = [
    {name: 'Ron Marcovich', photo: 'ronmar.jpg', position: ''},
    {name: 'Guy Menhel', photo: 'guymen.jpg', position: ''},
    {name: 'Yuval Ron', photo: 'yuvalron.jpg', position: ''},
    {name: 'Isar A\'mer', photo: 'isaram.jpg', position: ''},
    {name: 'Moshe Sabag', photo: 'moshesab.jpg', position: ''}
  ];

  technologies = [
    {name: 'Angular', photo: 'angular.svg', url: 'https://angular.io'},
    {name: 'Firebase', photo: 'firebase.svg', url: 'https://firebase.google.com'},
    {name: 'Bootstrap', photo: 'bootstrap.svg', url: 'https://getbootstrap.com'},
    {name: 'Google Cloud', photo: 'gcloud.png', url: 'https://cloud.google.com/'},
  ];

  libs = [
    {name: 'Font Awesome', url: 'https://fontawesome.com/'},
    {name: 'Angular Material', url: 'https://material.angular.io'},
    {name: 'ng-bootstrap', url: 'https://ng-bootstrap.github.io'},
    {name: 'PDF.js', author: 'Mozilla', url: 'https://mozilla.github.io/pdf.js/'},
    {name: 'pdfkit', url: 'http://pdfkit.org/'},
    {name: 'ngx-image-cropper', author: 'Mawi137', url: 'https://github.com/Mawi137/ngx-image-cropper'},
    {name: 'ngx-file-drop', author: 'georgipeltekov', url: 'https://github.com/georgipeltekov/ngx-file-drop'},
    {name: 'ngx-spinner', author: 'Napster2210', url: 'https://github.com/Napster2210/ngx-spinner'},
    {name: 'ngx-ckeditor', author: 'HstarComponents', url: 'https://github.com/HstarComponents/ngx-ckeditor'},
  ];

  acks = [
    {photo: 'cs-technion.jpg', url: 'https://cs.technion.ac.il', width: 2},
    {photo: 'ssdl.png', url: 'http://ssdl.cs.technion.ac.il/', width: 8},
    {photo: 'cs-vaad.png', url: 'https://www.facebook.com/cs.technion/', width: 2}
  ];

  constructor(private modal: NgbModal) { }

  ngOnInit() {
  }

  contactClick(contactUsModal: TemplateRef<any>) {
    this.modal.open(contactUsModal);
  }
}
