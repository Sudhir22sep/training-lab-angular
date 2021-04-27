import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { mergeMap, take, tap } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthenticationService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return from(this.getToken()).pipe(
      take(1),
      tap(token => {
        if (token && this.requestRequiresToken(req)) {
          req = req.clone({
            setHeaders: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              Authorization: 'Bearer ' + token,
            },
          });
        }
      }),
      mergeMap(() => next.handle(req)),
    );
  }

  private async getToken(): Promise<string | undefined> {
    return this.auth.getAccessToken();
  }

  private requestRequiresToken(req: HttpRequest<any>): boolean {
    return !/\/login$/.test(req.url);
  }
}
