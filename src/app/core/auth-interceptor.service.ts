import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { mergeMap, take, tap } from 'rxjs/operators';
import { VaultService } from './vault.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private vault: VaultService) {}

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
    const session = await this.vault.restoreSession();
    return session?.token;
  }

  private requestRequiresToken(req: HttpRequest<any>): boolean {
    return !/\/login$/.test(req.url);
  }
}
