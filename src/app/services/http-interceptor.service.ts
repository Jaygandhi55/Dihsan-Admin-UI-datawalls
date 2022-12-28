import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { LoginService } from './login.service';
import { AuthService } from '../shared/services/firebase/auth.service';

/**
 * Intercepts the HTTP responses, and in case that an error/exception is thrown, handles it
 * and extract the relevant information of it.
 */
@Injectable()
export class LoginHttpInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (!req.url.includes('users/login') && !req.url.includes('bexit')) {
            req = req.clone({
                headers: req.headers.append('Authorization', `jwt ${localStorage.getItem('token')}`)
            });
        }
    
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status == 401) {
                    this.authService.SignOut();
                }
                return throwError(error);
            })
        )
    }

}