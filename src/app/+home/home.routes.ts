import { Route } from "@angular/router";

const HOME_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./feature/home.component').then(m => m.FeatureComponent),
    data: { breadcrumb: 'Home' }, // Add breadcrumb for the home component
  },
];

export default HOME_ROUTES;