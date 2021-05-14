import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpHeaders
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { User } from '@app/models';

const users: User[] = [{ id: 1, username: 'admin', password: '111', firstName: 'Test', lastName: 'User' }];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    public intercept<T>(request: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
        return of(null)
            .pipe(mergeMap(() => this.handleRoute(request, next)))
            .pipe(materialize())
            .pipe(delay(500))
            .pipe(dematerialize());
    }

    private handleRoute<T>(request: HttpRequest<T>, next: HttpHandler) {
        const { url, method, headers, body } = request;

        switch (true) {
            case url.endsWith('/users/authenticate') && method === 'POST':
                return this.authenticate(body);
            case url.endsWith('/users') && method === 'GET':
                return this.getUsers(headers);
            default:
                return next.handle(request);
        }
    }

    private authenticate(body) {
        const { username, password } = body;
        const user = users.find((userInfo: User) => userInfo.username === username && userInfo.password === password);

        if (!user) {
            return this.onError('Username or password is incorrect');
        }

        return this.onSuccess({
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            token: 'fake-jwt-token',
        });
    }

    private unauthorized() {
        return throwError({
            status: 401,
            error: {
                message: 'Unauthorised',
            },
        });
    }

    private getUsers(headers: HttpHeaders) {
        const isLoggedIn = headers.get('Authorization') === 'Bearer fake-jwt-token';
        if (!isLoggedIn) {
            return this.unauthorized();
        }
        return this.onSuccess(users);
    }

    private onSuccess(body?: any) {
        return of(
            new HttpResponse({
                status: 200,
                body,
            })
        );
    }

    private onError(message?: string) {
        return throwError({
            error: {
                message,
            },
        });
    }
}

export const fakeBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
