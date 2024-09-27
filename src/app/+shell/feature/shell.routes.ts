import { Routes } from '@angular/router';
import { LayoutComponent } from '../ui/layout.component';
import { AuthGuard } from '../../+auth/data-access/api/auth.guard';
import { PageNotFoundComponent } from '../ui/component/page-not-found/page-not-found.component';

export const ShellRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    data: { breadcrumb: 'Home' },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },
      {
        path: 'home',
        canActivate: [],
        loadChildren: () => import('../../+home/home.routes'),
      },
      {
        path: 'house',
        canActivate: [AuthGuard],
        loadChildren: () => import('../../+house/house.routes'),
      },
      {
        path: '**', // Wildcard route for a 404 page
        component: PageNotFoundComponent,
      }
    ]
  }
];