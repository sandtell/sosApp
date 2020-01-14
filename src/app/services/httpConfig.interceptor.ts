import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {

    constructor() {
        console.log('ask =' + localStorage.getItem('lsAPIToken'));
     }

     intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const authReq = req.clone({
          headers: new HttpHeaders({
            'Api_Token':  localStorage.getItem('lsAPIToken'),
            'User_Email': localStorage.getItem('lsEmail'),
          })
        });
      
        console.log('Intercepted HTTP call', authReq);
      
        return next.handle(authReq);
      }
    // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    //     request = request.clone({
    //         setHeaders: {
    //             'Api_Token': localStorage.getItem('lsAPIToken'),
    //             'User_Email': localStorage.getItem('lsEmail'),
    //         }
    //     });
    //     console.log(request);
    //     return next.handle(request);
    // }

}