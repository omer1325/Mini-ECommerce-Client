import { Component, Inject, OnInit } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { QrCodeService } from 'src/app/services/common/qr-code.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SpinnerType } from 'src/app/base/base.component';

@Component({
  selector: 'app-qrcode-dialog',
  templateUrl: './qrcode-dialog.component.html',
  styleUrls: ['./qrcode-dialog.component.scss']
})
export class QrcodeDialogComponent extends BaseDialog<QrcodeDialogComponent> implements OnInit{

  constructor(dialogRef: MatDialogRef<QrcodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private spinner: NgxSpinnerService,
    private qeCodeService: QrCodeService,
    private domSanitizer: DomSanitizer
    ) {
    super(dialogRef)
  }

  qrCodeSafeUrl: SafeUrl
  async ngOnInit(){
    this.spinner.show(SpinnerType.BallAtom);
    const qrCodeBlob: Blob = await this.qeCodeService.generateQrCode(this.data);
    const url: string = URL.createObjectURL(qrCodeBlob);
    this.qrCodeSafeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(url);
    this.spinner.hide(SpinnerType.BallAtom);
  }
}
