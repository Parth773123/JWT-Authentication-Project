import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TokenApiModel } from '../models/token-api..model';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const myToken = this.authService.getToken();

    if (myToken) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${myToken}` },
      });
    }
    return next.handle(request).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.handleUnAuthError(request, next);
          }
        }
        return throwError(
          () => new Error('Something went wrong, please try again later!')
        );
      })
    );
  }

  handleUnAuthError(req: HttpRequest<any>, next: HttpHandler) {
    let tokenModel = new TokenApiModel();

    tokenModel.accessToken = this.authService.getToken()!;
    tokenModel.refreshToken = this.authService.getRefreshToken()!;

    return this.authService.refreshToken(tokenModel).pipe(
      switchMap((data: TokenApiModel) => {
        this.authService.storeToken(data.accessToken);
        this.authService.storeRefreshToken(data.refreshToken);

        req = req.clone({
          setHeaders: { Authorization: `Bearer ${data.accessToken}` },
        });

        return next.handle(req);
      }),
      catchError((err) => {
        return throwError(() => {
          this.toastr.warning('Token has expired, Please login again !');
          this.router.navigate(['login']);
        });
      })
    );
  }
}
