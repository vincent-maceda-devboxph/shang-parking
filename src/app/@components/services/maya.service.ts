import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MayaService {
  private apiUrl = `${environment.apiUrl}/maya`;
  private publicKey = 'pk-vIUY04LyYBRUIV4ueK44uX7QAblZNUK0KJbldYdeyWn';
  private secretKey = 'sk-6wRmqf8g4nl2dWaoGNEBRYf6R2TErIkOVAZjlJEIU3m';

  constructor(private http: HttpClient) { }

  createCheckout(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.publicKey}:${this.secretKey}`)}`,
      'Content-Type': 'application/json',
    });

    return this.http.post(this.apiUrl, data, { headers });
  }
}
