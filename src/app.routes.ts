import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout/app.layout';
import { Dashboard } from './app/pages/archived/dashboard/dashboard';
import { Documentation } from './app/pages/archived/documentation/documentation';
import { Landing } from './app/pages/archived/landing/landing';
import { Notfound } from './app/pages/archived/notfound/notfound';
import { Start } from '@/pages/start/start';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: Start },
            { path: 'landing', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./app/pages/archived/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/archived/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
