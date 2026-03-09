import { Component } from '@angular/core';
import { PlateInputComponent } from "./plate-input/plate-input.component";
import { CommonModule } from '@angular/common';
import { ScanTicketComponent } from "./scan-ticket/scan-ticket.component";

@Component({
  selector: 'app-find',
  standalone: true,
  imports: [PlateInputComponent, CommonModule, ScanTicketComponent],
  templateUrl: './find.component.html',
  styleUrl: './find.component.scss'
})
export class FindComponent {
  activeTab: string = 'plate';
}
