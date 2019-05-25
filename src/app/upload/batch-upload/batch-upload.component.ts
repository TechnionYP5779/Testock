import { Component, OnInit } from '@angular/core';
import {FileSystemDirectoryEntry, FileSystemFileEntry, UploadEvent, UploadFile} from 'ngx-file-drop';
import {UploadService} from '../upload.service';

@Component({
  selector: 'app-batch-upload',
  templateUrl: './batch-upload.component.html',
  styleUrls: ['./batch-upload.component.scss']
})
export class BatchUploadComponent implements OnInit {

  uploadActive = false;
  isDragged: boolean;
  private files: File[];
  private uploadTasks: Promise<string>[];

  constructor(private upload: UploadService) { }

  ngOnInit() {
  }

  public dropped(event: UploadEvent) {
    const fileEntries = [];
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

    if (fileEntries.length === 0) {
      return;
    }

    Promise.all(fileEntries.map(fe => getFile(fe))).then(files => {
      this.files = files;
      this.uploadActive = true;
      this.uploadTasks = files.map((file) => this.upload.uploadPDFFile(file));
    });
  }
}

function getFile(fileEntry: FileSystemFileEntry): Promise<File> {
  return new Promise<File>((resolve => {
    fileEntry.file((file) => resolve(file));
  }));
}
