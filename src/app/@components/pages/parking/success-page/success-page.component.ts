import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParkingService } from '../../../services/parking.service';

@Component({
  selector: 'app-success-page',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './success-page.component.html',
  styleUrl: './success-page.component.scss'
})
export class SuccessPageComponent implements OnInit {
  paymentProcessed = false;
  paymentError = '';

  constructor(
    private parkingService: ParkingService,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    const stored = sessionStorage.getItem('parkingDetails');
    const checkoutId = sessionStorage.getItem('checkoutId');
    if (checkoutId) {
      console.log('=== WEBHOOK TEST PAYLOAD (copy-paste to Postman) ===');
      console.log('POST URL: ' + window.location.origin.replace('spi-client-dev', 'spi-webapi-dev').replace(':4200', ':5000') + '/api/webhook/maya');
      console.log(JSON.stringify({
        id: checkoutId,
        isPaid: true,
        status: 'PAYMENT_SUCCESS',
        paymentStatus: 'PAYMENT_SUCCESS',
        requestReferenceNumber: stored ? JSON.parse(stored).requestReferenceNumber : 'UNKNOWN',
        totalAmount: { value: stored ? JSON.parse(stored).amount : 0, currency: 'PHP' },
        paymentScheme: 'master-card',
        transactionReferenceNumber: 'TRN-TEST-' + Date.now(),
      }, null, 2));
      console.log('=== END WEBHOOK TEST PAYLOAD ===');
      sessionStorage.removeItem('checkoutId');
    }

    if (!stored) {
      this.paymentProcessed = true;
      return;
    }

    const parkingDetails = JSON.parse(stored);
    sessionStorage.removeItem('parkingDetails');

    this.spinner.show();
    this.parkingService.processParkingPayment({
      sessionId: parkingDetails.sessionId,
      paymentIdentifier: parkingDetails.paymentIdentifier,
      baseUrl: parkingDetails.baseUrl,
      customerId: 'devbox',
    }).subscribe({
      next: (res) => {
        console.log('Scheidt-Bachmann Payment Result:', res);
        this.paymentProcessed = true;
        this.spinner.hide();
      },
      error: (err) => {
        console.error('Error processing parking payment:', err);
        this.paymentError = 'Payment was received but parking gate update failed. Please contact support.';
        this.paymentProcessed = true;
        this.spinner.hide();
      },
    });
  }
}
