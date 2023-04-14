import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { AuthService, _isAuthenticated } from 'src/app/services/common/auth.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/ui/custom-toastr.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private jwtHelper: JwtHelperService, 
    private router: Router, 
    private toastrService: CustomToastrService, 
    private spinner: NgxSpinnerService,
    private authService: AuthService
    ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    this.spinner.show(SpinnerType.BallAtom);

    if (!_isAuthenticated) {
      this.router.navigate(["login"], { queryParams: { returnUrl: state.url } });
      this.toastrService.message("You need to sign in!", "Unauthorized Access!",{
        messageType: ToastrMessageType.Warning,
        position: ToastrPosition.TopRight
      });
    }

    this.spinner.hide(SpinnerType.BallAtom);
    return true;
  }

}
