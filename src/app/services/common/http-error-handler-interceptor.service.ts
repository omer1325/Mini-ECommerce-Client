import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../ui/custom-toastr.service';
import { UserAuthService } from './models/user-auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerInterceptorService implements HttpInterceptor {
  constructor(private toastrService: CustomToastrService, private userAuthService: UserAuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError(error => {
      switch (error.status) {
        case HttpStatusCode.Unauthorized:
          this.toastrService.message("You are not authorized to do this!", "Unauthorized Operation!", {
            messageType: ToastrMessageType.Warning,
            position: ToastrPosition.BottomFullWidth
          });
          this.userAuthService.refreshTokenLogin(localStorage.getItem("refreshToken")).then(data => {

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
      return of(error);
    }));
  }
}
