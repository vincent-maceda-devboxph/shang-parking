import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MayaService {
  private apiUrl = `${environment.apiUrl}/maya`;
  private publicKey = 'pk-6BluPsIvq24sDzsYiepwLngpXknMcQ8p4AdZWpdxx4K';
  private secretKey = 'sk-pX6HfoHkqaIvDKerqi0OGW99kMyeHxMvBd0138WX8zo';

  constructor(private http: HttpClient) { }

  createCheckout(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.publicKey}:${this.secretKey}`)}`,
      'Content-Type': 'application/json',
    });

    return this.http.post(this.apiUrl, data, { headers });
  }
}
