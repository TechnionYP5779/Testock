import {Component, HostListener, OnInit} from '@angular/core';
import {FileSystemDirectoryEntry, FileSystemFileEntry, UploadEvent, UploadFile} from 'ngx-file-drop';
import {UploadService} from '../upload.service';
import {PendingScanId} from '../../entities/pending-scan';

@Component({
  selector: 'app-batch-upload',
  templateUrl: './batch-upload.component.html',
  styleUrls: ['./batch-upload.component.scss']
})
export class BatchUploadComponent implements OnInit {

  uploadActive = false;
  private files: File[];
  private uploadTasks: Promise<PendingScanId|Error>[];

  constructor(private upload: UploadService) { }

  ngOnInit() {
  }

  public dropped(event: UploadEvent) {
    let fileEntries: FileSystemFileEntry[] = [];
    for (const droppedFile of event.files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntries.push(fileEntry);
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }

    fileEntries = fileEntries.filter(fe => fe.name.endsWith('.pdf'));

    if (fileEntries.length === 0) {
      return;
    }

    Promise.all(fileEntries.map(fe => getFile(fe))).then(files => {
      this.files = files;
      this.uploadActive = true;
      this.uploadTasks = files.map((file) => this.upload.uploadPDFFile(file).catch(reason => reason));
      return Promise.all(this.uploadTasks);
    }).then(() => {
      this.uploadActive = false;
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.uploadActive) {
      $event.returnValue = true;
    }
  }
}

function getFile(fileEntry: FileSystemFileEntry): Promise<File> {
  return new Promise<File>((resolve => {
    fileEntry.file((file) => resolve(file));
  }));
}
