import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ParkingDetails {
  message: string;
  paymentIdentifier: string;
  amount: number;
  requestReferenceNumber: string;
  startTime: string;
  endTime: string;
  duration: {
    numberOfDays: number;
    numberOfHours: number;
    numberOfMinutes: number;
  };
  baseUrl: string;
  sessionId: string;
}

@Injectable({
  providedIn: 'root'
})
export class ParkingService {
  private parkingUrl = `${environment.apiUrl}/parking`;
  private checkoutUrl = `${environment.apiUrl}/checkout`;

  constructor(private http: HttpClient) {}

  getParkingDetails(idType: 'LICENSEPLATE' | 'BARCODE', id: string): Observable<ParkingDetails> {
    return this.http.post<ParkingDetails>(`${this.parkingUrl}/details`, { idType, id });
  }

  createCheckout(data: any): Observable<any> {
    return this.http.post<any>(this.checkoutUrl, data);
  }

  processParkingPayment(data: { sessionId: string; paymentIdentifier: string; baseUrl: string; customerId: string }): Observable<any> {
    return this.http.post<any>(`${this.parkingUrl}/process-payment`, data);
  }
}
