import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  
  hasBaseDropZoneOver: boolean;
  filesPreview: any = [];
  @Input() disable: boolean;
  constructor() { 
  }

  ngOnInit(): void {
  }

  fileOverBase(evt: any) {
    this.hasBaseDropZoneOver = evt;
  }

  onPreviewFileSelect(event: any) {
    this.filesPreview = [];
    if (event.addedFiles[0].type == 'image/jpeg'){
      this.filesPreview.push(...event.addedFiles);
    }
  }

  onPreviewFileRemove(event: any) {
    this.filesPreview.splice(this.filesPreview.indexOf(event), 1);
  }

}
