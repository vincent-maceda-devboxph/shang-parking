import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { PlateInputComponent } from './find/plate-input/plate-input.component';
import { ScanTicketComponent } from './find/scan-ticket/scan-ticket.component';
import { ResultsPageComponent } from './parking/results-page/results-page.component';
import { SuccessPageComponent } from './parking/success-page/success-page.component';
import { FailedPageComponent } from './parking/failed-page/failed-page.component';
import { FindComponent } from './find/find.component';

const routes: Routes = [
  {
		path: 'find',
		component: PagesComponent,
		// canActivate: [authGuard],
		children: [
			{ path: '', component: FindComponent },
			{ path: 'plate', component: PlateInputComponent },
      		{ path: 'scan', component: ScanTicketComponent },

		]
	},
  {
		path: 'results',
		component: PagesComponent,
		// canActivate: [authGuard],
		children: [
			{ path: 'plate', component: ResultsPageComponent },
      // { path: 'scan', component: ScanTicketComponent },

		]
	},
	{
		path: 'redirect',
		component: PagesComponent,
		// canActivate: [authGuard],
		children: [
			{ path: 'success', component: SuccessPageComponent },
			{ path: 'fail', component: FailedPageComponent },
			{ path: 'cancel', component: FailedPageComponent },

		]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
