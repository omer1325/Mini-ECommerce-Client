import { Component, ViewChild } from '@angular/core';
import { AuthService } from './services/common/auth.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from './services/ui/custom-toastr.service';
import { Router } from '@angular/router';
import { DynamicLoadComponentService } from './services/common/dynamic-load-component.service';
import { DynamicLoadComponentDirective } from './directives/common/dynamic-load-component.directive';
import { ComponentType } from '../app/services/common/dynamic-load-component.service'
declare var $: any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild(DynamicLoadComponentDirective, {static: true})
  dynamicLoadComponentDirective: DynamicLoadComponentDirective

  constructor(
    public authService: AuthService, 
    private toastrService: CustomToastrService,
    private router: Router,
    private dynamicLoadComponentService: DynamicLoadComponentService
    ) {
      authService.identityCheck();
    }

    Signout(){
      localStorage.removeItem("accessToken");
      this.authService.identityCheck();
      this.router.navigate([""])
      this.toastrService.message("Signed out", "Logged out",{
        messageType: ToastrMessageType.Warning,
        position: ToastrPosition.TopRight
      })
    }

  loadComponent(){
    this.dynamicLoadComponentService.loadComponent(ComponentType.BasketsComponent, this.dynamicLoadComponentDirective.viewContainerRef)
  }
}