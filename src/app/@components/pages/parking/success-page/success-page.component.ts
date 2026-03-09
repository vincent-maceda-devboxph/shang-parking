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
