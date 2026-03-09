import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/parking/find' },
    { path: 'parking', loadChildren: () => import('./@components/pages/pages.module').then(m => m.PagesModule) }
];
