import { CurrencyPipe, DatePipe, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParkingService, ParkingDetails } from '../../../services/parking.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-results-page',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, CommonModule],
  templateUrl: './results-page.component.html',
  styleUrl: './results-page.component.scss'
})
export class ResultsPageComponent implements OnInit {
  appUrl = environment.appUrl;

  parkingDetails: ParkingDetails | null = null;
  errorMessage: string = '';
  showToast: boolean = false;
  toastMessage: string = '';

  checkoutRequest: any = {};

  constructor(
    private spinner: NgxSpinnerService,
    private parkingService: ParkingService,
    private router: Router,
  ) {}


  ngOnInit(): void {
    this.spinner.show();
    const stored = sessionStorage.getItem('parkingDetails');

    if (!stored) {
      this.spinner.hide();
      this.router.navigate(['/parking/find']);
      return;
    }

    const details: ParkingDetails = JSON.parse(stored);
    details.startTime = details.startTime?.replace('Z', '');
    details.endTime = details.endTime?.replace('Z', '');
    this.parkingDetails = details;
    this.checkoutRequest = {
      requestReferenceNumber: `REF-${Date.now()}`,
      totalAmount: {
        value: details.amount,
        currency: 'PHP',
      },
      buyer: {
        firstName: 'Parking',
        lastName: 'Customer',
        contact: {
          email: 'parking@shangrila-plaza.com',
          phone: '+639000000000',
        },
      },
      items: [
        {
          name: 'Parking Fee',
          quantity: 1,
          totalAmount: { value: details.amount },
        },
      ],
      redirectUrl: {
        success: `${this.appUrl}/parking/redirect/success`,
        failure: `${this.appUrl}/parking/redirect/fail`,
      },
      parkingDetails: {
        sessionId: details.sessionId,
        paymentIdentifier: details.paymentIdentifier,
        baseUrl: details.baseUrl,
      },
    };
    this.spinner.hide();
  }

  displayToast(message: string): void {
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 5000);
  }

  dismissToast(): void {
    this.showToast = false;
  }

  onCheckout(){
    this.spinner.show();
    // Store parking details in sessionStorage for the success page to process SB payment
    if (this.parkingDetails) {
      sessionStorage.setItem('parkingDetails', JSON.stringify(this.parkingDetails));
    }
    this.parkingService.createCheckout(this.checkoutRequest).subscribe({
      next: (response) => {
        console.log('Maya Checkout Response:', response);
        window.location.href = response.redirectUrl;
        this.spinner.hide();
      },
      error: (err) => {
        this.spinner.hide();
        console.error('Error during checkout:', err);
        this.displayToast(err.error?.message || 'Checkout failed. Please try again.');
      },
    });
  }
}
