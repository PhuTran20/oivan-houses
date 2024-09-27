import { Route } from '@angular/router';
import { AuthGuard } from '../+auth/data-access/api/auth.guard';

const HOUSE_ROUTES: Route[] = [
  {
    path: 'edit',
    loadComponent: () => import('./feature/house-edit/house-edit.component').then((m) => m.HouseEditComponent),
    data: { breadcrumb: '' }, 
    canActivate: [AuthGuard],
  },
  {
    path: 'create',
    loadComponent: () => import('./feature/house-create/house-create.component').then((m) => m.HouseCreateComponent),
    data: { breadcrumb: 'Create new house' },
    canActivate: [AuthGuard],
  },
];

export default HOUSE_ROUTES;