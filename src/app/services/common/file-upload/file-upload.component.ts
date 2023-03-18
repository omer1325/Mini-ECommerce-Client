import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { FileUploadDialogState } from 'src/app/dialogs/file-upload-dialog/file-upload-dialog.component';
import { AlertifyService, MessageType, Position } from '../../admin/alertify.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { HttpClientService } from '../http-client.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  constructor(
    private httpClientService: HttpClientService,
    private alertifyService: AlertifyService,
    private customToastrService: CustomToastrService,
    private dialog: MatDialog
  ) { }

  @Input() options: Partial<FileUploadOptions>;

  public files: NgxFileDropEntry[];

  public selectedFiles(files: NgxFileDropEntry[]) {
    this.files = files;
    const fileData: FormData = new FormData();
    for (const file of files) {
      (file.fileEntry as FileSystemFileEntry).file((_file: File) => {
        fileData.append(_file.name, _file, file.relativePath);
      });
    }

    this.openDialog(() => {
      this.httpClientService.post({
        controller: this.options.controller,
        action: this.options.action,
        queryString: this.options.queryString,
        headers: new HttpHeaders({ "responseType": "blob" })
      }, fileData).subscribe(data => {

        const mesage: string = "Files uploaded successfully."

        if (this.options.isAdminPage) {
          this.alertifyService.message(mesage, {
            dismissOthers: true,
            messageType: MessageType.Success,
            position: Position.TopRight
          })
        }
        else {
          this.customToastrService.message(mesage, "Success", {
            messageType: ToastrMessageType.Success,
            position: ToastrPosition.TopRight
          })
        }
      }, (errorResponse: HttpErrorResponse) => {
        const mesage: string = "An unexpected error occurred while uploading files."

        if (this.options.isAdminPage) {
          this.alertifyService.message(mesage, {
            dismissOthers: true,
            messageType: MessageType.Error,
            position: Position.TopRight
          })
        }
        else {
          this.customToastrService.message(mesage, "Error", {
            messageType: ToastrMessageType.Error,
            position: ToastrPosition.TopRight
          })
        }
      });
    });
  }

  openDialog(afterClosed: any): void {
    const dialogRef = this.dialog.open(FileUploadComponent, {
      data: FileUploadDialogState.Yes,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == FileUploadDialogState.Yes) {
        afterClosed();
      }
    });
  }

}

export class FileUploadOptions {
  controller?: string;
  action?: string;
  queryString?: string;
  explanation?: string;
  accept?: string;
  isAdminPage?: boolean = false;
}
