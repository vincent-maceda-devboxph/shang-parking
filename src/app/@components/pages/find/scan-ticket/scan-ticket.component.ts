import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxScannerQrcodeComponent, NgxScannerQrcodeModule, ScannerQRCodeConfig, ScannerQRCodeConfigType, ScannerQRCodeResult, ScannerQRCodeSymbolType } from 'ngx-scanner-qrcode';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParkingService, ParkingDetails } from '../../../services/parking.service';

@Component({
  selector: 'app-scan-ticket',
  standalone: true,
  imports: [NgxScannerQrcodeModule, CommonModule, FormsModule],
  templateUrl: './scan-ticket.component.html',
  styleUrl: './scan-ticket.component.scss'
})
export class ScanTicketComponent {
  @ViewChild('scanner', { static: false }) action!: NgxScannerQrcodeComponent;
  result: string = '';
  type: string = '';
  manualBarcode: string = '';
  showToast: boolean = false;
  toastMessage: string = '';
  testMode: boolean = false;

  public config: ScannerQRCodeConfig = {
    constraints: {
      video: {
        width: window.innerWidth,
      },
    },
    symbolType: [ScannerQRCodeSymbolType.ScannerQRCode_I25, ScannerQRCodeSymbolType.ScannerQRCode_CODE128]
  };

  constructor(private spinner: NgxSpinnerService, private router: Router, private route: ActivatedRoute, private parkingService: ParkingService) {
    this.testMode = this.route.snapshot.queryParamMap.get('test') === 'true';
  }

  ngAfterViewInit(): void {
    if (this.testMode) return;
    this.action.isReady.subscribe((res: any) => {

      this.handle(this.action, 'start');
    });
  }

  onManualSubmit(): void {
    if (this.manualBarcode.trim()) {
      this.lookupBarcode(this.manualBarcode.trim());
    }
  }

  public onEvent(e: ScannerQRCodeResult[], action?: any): void {
    this.result = e[0].value;
    this.type = e[0].type.toString();
    this.action.stop();
    this.lookupBarcode(this.result);
  }

  private lookupBarcode(barcode: string): void {
    this.spinner.show();
    this.parkingService.getParkingDetails('BARCODE', barcode).subscribe({
      next: (details: ParkingDetails) => {
        this.spinner.hide();
        if (details.message !== 'SUCCESS') {
          this.displayToast(details.message || 'Parking ticket not found. Please try again.');
          this.resetScanner();
          return;
        }
        sessionStorage.setItem('parkingDetails', JSON.stringify(details));
        this.router.navigate(['/parking/results/plate']);
      },
      error: (err: any) => {
        this.spinner.hide();
        this.displayToast(err.error?.message || 'Failed to fetch parking details. Please try again.');
        this.resetScanner();
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

  private resetScanner(): void {
    this.result = '';
    setTimeout(() => {
      this.handle(this.action, 'start');
    }, 500);
  }

  public handle(action: any, fn: string): void {
    this.spinner.show();
    const playDeviceFacingBack = (devices: any[]) => {
      const device = devices.find((f) =>
        /back|rear|environment/gi.test(f.label)
      );
      action.playDevice(device ? device.deviceId : devices[0].deviceId);
    };

    if (fn === 'start') {
      action[fn](playDeviceFacingBack).subscribe(
        (r: any) => console.log(fn, r),
        alert
      );
    } else {
      action[fn]().subscribe((r: any) => console.log(fn, r), alert);
    }
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
  }
}
