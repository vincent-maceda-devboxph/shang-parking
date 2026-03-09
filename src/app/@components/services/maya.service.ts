import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MayaService {
  private apiUrl = `${environment.apiUrl}/maya`;
  private publicKey = 'pk-eo4sL393CWU5KmveJUaW8V730TTei2zY8zE4dHJDxkF'; // Replace with your Maya Sandbox Public Key
  private secretKey = 'sk-KfmfLJXFdV5t1inYN8lIOwSrueC1G27SCAklBqYCdrU';

  constructor(private http: HttpClient) { }

  createCheckout(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.publicKey}:${this.secretKey}`)}`,
      'Content-Type': 'application/json',
    });

    return this.http.post(this.apiUrl, data, { headers });
  }
}
