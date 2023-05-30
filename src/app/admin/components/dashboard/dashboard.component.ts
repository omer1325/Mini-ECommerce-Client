import { Component, OnInit } from '@angular/core';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SignalRService } from 'src/app/services/common/signalr.service';
import { ReceiveFunctions } from 'src/app/constants/receive-functions';
import { HubUrls } from 'src/app/constants/hub-urls';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})


export class DashboardComponent extends BaseComponent {
  constructor(private alertify : AlertifyService, spinner: NgxSpinnerService, private signalRService: SignalRService) {
    super(spinner)
    // signalRService.start(HubUrls.ProductHub)
    // signalRService.start(HubUrls.OrderHub)
  }
  
  ngOnInit(): void{
    this.signalRService.on(HubUrls.ProductHub ,ReceiveFunctions.ProductAddedMessageReceiveFunction, message => {
      this.alertify.message(message,
         {
          messageType: MessageType.Notify,
          position: Position.TopRight
         })
    });

    this.signalRService.on(HubUrls.OrderHub, ReceiveFunctions.OrderAddedMessageReceiveFunction, message => {
      this.alertify.message(message,
         {
          messageType: MessageType.Notify,
          position: Position.TopRight
         })
    });
  }

  m(){
    this.alertify.message("Merhaba", {
      messageType: MessageType.Success,
      delay: 5,
      position: Position.TopRight
    })
  }

  d(){
    this.alertify.dismiss();
  }
  
}
