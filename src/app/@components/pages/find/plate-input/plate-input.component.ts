import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParkingService, ParkingDetails } from '../../../services/parking.service';

@Component({
  selector: 'app-plate-input',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './plate-input.component.html',
  styleUrl: './plate-input.component.scss'
})
export class PlateInputComponent implements OnInit {
  plateNumber: string = '';
  showToast: boolean = false;
  toastMessage: string = '';

  constructor(private spinner: NgxSpinnerService, private router: Router, private parkingService: ParkingService) {}

  ngOnInit(): void {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }

  onNext(): void {
    if (!this.plateNumber.trim()) return;
    this.spinner.show();
    this.parkingService.getParkingDetails('LPN', this.plateNumber.trim()).subscribe({
      next: (details) => {
        this.spinner.hide();
        if (details.message !== 'SUCCESS') {
          this.displayToast(details.message || 'Parking ticket not found. Please try again.');
          return;
        }
        sessionStorage.setItem('parkingDetails', JSON.stringify(details));
        this.router.navigate(['/parking/results/plate']);
      },
      error: (err) => {
        this.spinner.hide();
        this.displayToast(err.error?.message || 'Failed to fetch parking details. Please try again.');
      },
    });
  }

  displayToast(message: string): void {
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 5000);
  }

  dismissToast(): void {
    this.showToast = false;
  }
}
