import { Component } from '@angular/core';
import { AuthService } from './services/common/auth.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from './services/ui/custom-toastr.service';
import { Router } from '@angular/router';
declare var $: any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    public authService: AuthService, 
    private toastrService: CustomToastrService,
    private router: Router
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
}