import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../ui/custom-toastr.service';
import { UserAuthService } from './models/user-auth.service';
import { Router } from '@angular/router';
import { SpinnerType } from 'src/app/base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerInterceptorService implements HttpInterceptor {
  constructor(
    private toastrService: CustomToastrService,
    private userAuthService: UserAuthService,
    private router: Router,
    private spinner: NgxSpinnerService
    ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError(error => {
      switch (error.status) {
        case HttpStatusCode.Unauthorized:

        
          
          this.userAuthService.refreshTokenLogin(localStorage.getItem("refreshToken"), (state)=> {
            if(!state){
              const url = this.router.url;
            if(url == "/products"){
              this.toastrService.message("You need to be logged in to add items to the cart", "Sign In",{
                messageType: ToastrMessageType.Warning,
                position: ToastrPosition.TopRight
              })
            }
            else{
              this.toastrService.message("You are not authorized to do this!", "Unauthorized Operation!", {
                messageType: ToastrMessageType.Warning,
                position: ToastrPosition.BottomFullWidth
              });
            }
            }
          }).then(data => {

          });
          break;
        case HttpStatusCode.InternalServerError:
          this.toastrService.message("The server is unreachable!", "Server Error!", {
            messageType: ToastrMessageType.Error,
            position: ToastrPosition.TopRight
          })
          break;
        case HttpStatusCode.BadRequest:
          this.toastrService.message("Invalid request made!", "Invalid Request!", {
            messageType: ToastrMessageType.Warning,
            position: ToastrPosition.TopRight
          })
          break;
        case HttpStatusCode.NotFound:
          this.toastrService.message("Page not found!", "Page not found!", {
            messageType: ToastrMessageType.Error,
            position: ToastrPosition.TopRight
          })
          break;
        default:
          this.toastrService.message("An unexpected error has occurred!", "Error", {
            messageType: ToastrMessageType.Error,
            position: ToastrPosition.TopRight
          })
          break;
      }
      this.spinner.hide((SpinnerType.BallAtom))
      return of(error);
    }));
  }
}
